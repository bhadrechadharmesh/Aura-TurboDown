const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const youtubedl = require('youtube-dl-exec');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

// Serve downloaded files
app.use('/files', express.static(DOWNLOAD_DIR));

const activeProcesses = new Map();

app.get('/api/info', async (req, res) => {
  const { url, browserCookie } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const isPlaylist = url.includes('playlist?list=') || url.includes('&list=');
    const options = {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
    };
    
    if (browserCookie && browserCookie !== 'none') {
      options.cookiesFromBrowser = browserCookie;
    } else if (fs.existsSync(path.join(__dirname, 'cookies.txt'))) {
      options.cookies = path.join(__dirname, 'cookies.txt');
    }
    
    if (isPlaylist) {
      options.flatPlaylist = true;
    }
    
    const output = await youtubedl(url, options);
    
    res.json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch info' });
  }
});

// For playlist individual items, frontend will call info for each or download for each.
// yt-dlp might fail if we don't have a reliable regex. Let's make it robust.

app.post('/api/download', (req, res) => {
  const { url, formatId, socketId, browserCookie } = req.body;
  if (!url || !socketId) return res.status(400).json({ error: 'URL and socketId required' });
  
  const options = {
    ffmpegLocation: ffmpegStatic,
    output: path.join(DOWNLOAD_DIR, '%(title)s - %(id)s.%(ext)s'),
    format: formatId || 'bestvideo+bestaudio/best',
    mergeOutputFormat: 'mp4',
    noWarnings: true,
    noCheckCertificate: true,
  };
  
  if (browserCookie && browserCookie !== 'none') {
    options.cookiesFromBrowser = browserCookie;
  } else if (fs.existsSync(path.join(__dirname, 'cookies.txt'))) {
    options.cookies = path.join(__dirname, 'cookies.txt');
  }
  
  const subprocess = youtubedl.exec(url, options);
  
  // Prevent unhandled promise rejection from crashing node when yt-dlp fails
  subprocess.catch(err => {
    console.error(`Download process rejected: ${err.message}`);
  });
  
  const processKey = `${socketId}_${url}`;
  activeProcesses.set(processKey, subprocess);
  
  let currentFile = null;
  
  // Progress regex parsing
  // Expected output line: [download]  15.5% of 200.00MiB at 4.54MiB/s ETA 00:30
  // Or: [download] Destination: downloads\Video Title.mp4
  const progressRegex = /\[download\]\s+(?:(\d+\.?\d*)%|Destination:\s+(.+))/;

  subprocess.stdout.on('data', (data) => {
    const line = data.toString();
    console.log(line);
    
    const match = line.match(progressRegex);
    if (match) {
      if (match[2]) {
        // Destination line
        currentFile = match[2].trim();
      } else if (match[1]) {
        // Percentage line
        io.to(socketId).emit('progress', {
          url: url,
          percent: parseFloat(match[1]),
          text: line.trim()
        });
      }
    }
    
    if (line.includes('[Merger]') || line.includes('Merging formats')) {
        io.to(socketId).emit('progress', {
          url: url,
          percent: 99,
          text: 'Merging video and audio streams...'
        });
    }
  });

  subprocess.stderr.on('data', (data) => {
    console.error(`yt-dlp err: ${data.toString()}`);
  });

  subprocess.on('close', (code) => {
    activeProcesses.delete(processKey);
    if (code === 0) {
      // Find the created file since we use template
      // If we don't know the exact filename from stdout, we could list directory
      // But let's just trigger a generic complete event and the client can inform user 
      // or we can parse it from stdout. If currentFile is caught, we send it.
      
      let downloadUrl = null;
      if (currentFile) {
        const basename = path.basename(currentFile);
        downloadUrl = `http://localhost:4000/api/download-file?filename=${encodeURIComponent(basename)}`;
      }
      
      io.to(socketId).emit('completed', {
        url: url,
        downloadUrl: downloadUrl,
        message: 'Download complete!'
      });
    } else {
      io.to(socketId).emit('error', {
        url: url,
        message: 'Download failed'
      });
    }
  });

  res.json({ message: 'Download started' });
});

app.post('/api/cancel', (req, res) => {
  const { url, socketId } = req.body;
  if (!url || !socketId) return res.status(400).json({ error: 'URL and socketId required' });
  
  const processKey = `${socketId}_${url}`;
  const subprocess = activeProcesses.get(processKey);
  
  if (subprocess) {
    subprocess.kill('SIGTERM'); // Send termination to yt-dlp
    activeProcesses.delete(processKey);
    
    // Also emit an error/cancellation event to let the client know immediately
    io.to(socketId).emit('error', {
      url: url,
      message: 'Download cancelled by user'
    });
    
    return res.json({ message: 'Cancelled successfully' });
  }
  
  res.status(404).json({ error: 'Download process not found' });
});

app.get('/api/download-file', (req, res) => {
  const { filename } = req.query;
  if (!filename) return res.status(400).send('Filename required');
  
  // Prevent directory traversal attacks
  const safeFilename = path.basename(filename);
  const filePath = path.join(DOWNLOAD_DIR, safeFilename);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
