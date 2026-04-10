const youtubedl = require('youtube-dl-exec');
const path = require('path');
const ffmpegStatic = require('ffmpeg-static');

(async () => {
    try {
        const url = 'https://www.youtube.com/watch?v=lea-Wl_uWXY';
        const options = {
            ffmpegLocation: ffmpegStatic,
            output: path.join(__dirname, 'test.mp4'),
            format: 'bestvideo+bestaudio/best',
            mergeOutputFormat: 'mp4',
            noWarnings: true,
            noCheckCertificate: true,
            extractorArgs: 'youtube:player-client=android'
        };

        console.log('Running with options:', options);
        
        const subprocess = youtubedl.exec(url, options);
        
        subprocess.stdout.on('data', d => console.log('stdout:', d.toString()));
        subprocess.stderr.on('data', d => console.log('stderr:', d.toString()));
        
        subprocess.on('close', code => {
            console.log('Process closed with code:', code);
        });

    } catch (err) {
        console.error('Error:', err);
    }
})();
