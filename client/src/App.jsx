import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Search, Download, Video } from 'lucide-react';
import InfoCard from './components/InfoCard';
import ProgressManager from './components/ProgressManager';
import './index.css';

const socket = io('http://localhost:4000');

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');
  const [downloads, setDownloads] = useState({});
  const [browserCookie, setBrowserCookie] = useState('chrome');

  useEffect(() => {
    socket.on('progress', (data) => {
      setDownloads(prev => ({
        ...prev,
        [data.url]: { ...prev[data.url], percent: data.percent, text: data.text, status: 'downloading' }
      }));
    });

    socket.on('completed', (data) => {
      setDownloads(prev => ({
        ...prev,
        [data.url]: { ...prev[data.url], percent: 100, text: 'Download complete!', status: 'completed', downloadUrl: data.downloadUrl }
      }));
    });

    socket.on('error', (data) => {
      setDownloads(prev => ({
        ...prev,
        [data.url]: { ...prev[data.url], status: 'error', text: 'Error occurred' }
      }));
    });

    return () => {
      socket.off('progress');
      socket.off('completed');
      socket.off('error');
    };
  }, []);

  const handleFetchInfo = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setInfo(null);
    
    try {
      const res = await fetch(`http://localhost:4000/api/info?url=${encodeURIComponent(url)}&browserCookie=${browserCookie}`);
      const data = await res.json();
      if (res.ok) {
        setInfo(data);
      } else {
        setError(data.error || 'Failed to fetch video info.');
      }
    } catch (err) {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const startDownload = async (downloadUrl, formatId) => {
    setDownloads(prev => ({
      ...prev,
      [downloadUrl]: { percent: 0, text: 'Starting...', status: 'starting' }
    }));

    try {
      await fetch('http://localhost:4000/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: downloadUrl,
          formatId: formatId,
          socketId: socket.id,
          browserCookie: browserCookie
        })
      });
    } catch (err) {
      setDownloads(prev => ({
        ...prev,
        [downloadUrl]: { status: 'error', text: 'Failed to request download' }
      }));
    }
  };

  const handleCancelDownload = async (downloadUrl) => {
    try {
      await fetch('http://localhost:4000/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: downloadUrl,
          socketId: socket.id
        })
      });
      // The backend will emit an 'error' event to mark it as cancelled.
    } catch (err) {
      console.error('Failed to cancel download', err);
    }
  };

  const handleDismissDownload = (downloadUrl) => {
    setDownloads(prev => {
      const next = { ...prev };
      delete next[downloadUrl];
      return next;
    });
  };

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <div className="app-container">
        <div className="title-container">
          <div className="title-icon">
            <Video color="white" size={40} />
          </div>
          <h1 className="title">Aura TubeDown</h1>
        </div>
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div className="input-group">
          <input 
            type="text" 
            className="url-input" 
            placeholder="Paste YouTube Video or Playlist URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchInfo()}
          />
          <button className="btn-primary" onClick={handleFetchInfo} disabled={loading || !url}>
            {loading ? <div className="spinner"></div> : <Search size={20} />}
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Bot Protection Bypass (Optional):
          </label>
          <select 
            className="format-dropdown" 
            style={{ padding: '0.5rem', fontSize: '0.9rem' }}
            value={browserCookie}
            onChange={(e) => setBrowserCookie(e.target.value)}
          >
            <option value="none">None</option>
            <option value="chrome">Chrome</option>
            <option value="edge">Edge</option>
            <option value="firefox">Firefox</option>
            <option value="brave">Brave</option>
            <option value="opera">Opera</option>
            <option value="safari">Safari</option>
          </select>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '600px' }}>
            <strong>Note on Bot Errors:</strong> If you use Chrome/Edge on Windows, "Bot Protection" might fail due to database encryption. The most reliable fix is to use an extension like "Get cookies.txt LOCALLY", export your Youtube cookies, and save the file as <code>cookies.txt</code> in the <code>server/</code> folder. Select "None" here to use it. Or, use Firefox instead.
          </div>
        </div>
        
        {error && <div style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
      </div>

      {info && (
        <InfoCard 
          info={info} 
          onDownload={startDownload} 
        />
      )}

      <ProgressManager 
        downloads={downloads} 
        onDismiss={handleDismissDownload} 
        onCancel={handleCancelDownload} 
      />
    </div>
    </>
  );
}

export default App;
