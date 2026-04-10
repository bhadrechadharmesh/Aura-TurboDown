import { useState } from 'react';
import { Download } from 'lucide-react';

function InfoCard({ info, onDownload }) {
  const [selectedFormat, setSelectedFormat] = useState('bestvideo+bestaudio/best');
  
  if (!info) return null;

  const isPlaylist = !!info.entries;

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown duration';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s].filter(Boolean).join(':');
  };

  // Extract unique video resolutions if formats exist
  const getQualityOptions = () => {
    if (!info.formats) return [];
    
    // Some formats are audio only (vcodec: none) or video only
    // Let's just create a curated list based on standard yt-dlp queries
    return [
      { id: 'bestvideo+bestaudio/best', label: 'Best Quality (Auto-merged)' },
      { id: 'bestvideo[height<=1080]+bestaudio/best[height<=1080]', label: '1080p' },
      { id: 'bestvideo[height<=720]+bestaudio/best[height<=720]', label: '720p' },
      { id: 'bestvideo[height<=480]+bestaudio/best[height<=480]', label: '480p' },
      { id: 'bestaudio/best', label: 'Audio Only (Best)' }
    ];
  };

  return (
    <div className="glass-panel info-card">
      {!isPlaylist && (
        <>
          <div className="thumbnail-container">
            <img src={info.thumbnail || (info.thumbnails && info.thumbnails[0]?.url)} alt="Thumbnail" />
          </div>
          <div className="info-content">
            <h2 className="info-title">{info.title}</h2>
            <div className="info-channel">
              {info.uploader || info.channel} • {formatDuration(info.duration)}
            </div>
            
            <div className="format-selection">
              <label style={{ color: 'var(--text-secondary)' }}>Select Quality:</label>
              <select 
                className="format-dropdown"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                {getQualityOptions().map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              
              <button 
                className="btn-primary" 
                style={{ marginTop: '1rem', width: 'fit-content' }}
                onClick={() => onDownload(info.webpage_url, selectedFormat)}
              >
                <Download size={20} /> Download Source
              </button>
            </div>
          </div>
        </>
      )}

      {isPlaylist && (
        <div style={{ width: '100%' }}>
          <h2 className="info-title">{info.title} (Playlist)</h2>
          <div className="info-channel">{info.uploader || info.channel} • {info.entries?.length} videos</div>
          
          <div className="format-selection" style={{flexDirection: 'row', alignItems: 'center', marginBottom: '2rem'}}>
            <label style={{ color: 'var(--text-secondary)' }}>Quality across playlist:</label>
            <select 
              className="format-dropdown"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="bestvideo+bestaudio/best">Best Quality</option>
              <option value="bestvideo[height<=1080]+bestaudio/best[height<=1080]">1080p</option>
              <option value="bestvideo[height<=720]+bestaudio/best[height<=720]">720p</option>
              <option value="bestaudio/best">Audio Only</option>
            </select>
          </div>

          <div className="playlist-grid">
            {info.entries.map((item, idx) => (
              <div key={item.id} className="playlist-item">
                <div className="playlist-item-title">{idx+1}. {item.title}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {formatDuration(item.duration)}
                </div>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  onClick={() => onDownload(item.url || `https://youtube.com/watch?v=${item.id}`, selectedFormat)}
                >
                  <Download size={16} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoCard;
