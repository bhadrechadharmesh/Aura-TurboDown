import { DownloadCloud, CheckCircle, AlertCircle, X, StopCircle } from 'lucide-react';

function ProgressManager({ downloads, onDismiss, onCancel }) {
  const activeDownloads = Object.entries(downloads);

  if (activeDownloads.length === 0) return null;

  return (
    <div className="progress-manager">
      {activeDownloads.map(([url, data]) => {
        const isError = data.status === 'error';
        const isCompleted = data.status === 'completed';
        const isStarting = data.status === 'starting';
        
        let colorStyle = { width: `${data.percent || 0}%` };
        if (isError) colorStyle.background = '#ef4444';
        if (isCompleted) colorStyle.background = '#10b981';

        // Extract a simple ID from URL for display if we don't have the title easily accessible here
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();

        return (
          <div key={url} className="progress-item">
            <div className="progress-header">
              <span style={{ fontWeight: 'bold' }}>
                {isError ? <AlertCircle size={16} color="#ef4444" style={{marginRight:'5px', verticalAlign:'middle'}}/> :
                 isCompleted ? <CheckCircle size={16} color="#10b981" style={{marginRight:'5px', verticalAlign:'middle'}}/> :
                 <DownloadCloud size={16} style={{marginRight:'5px', verticalAlign:'middle'}}/>}
                Task: {videoId.substring(0, 11)}...
              </span>
              <span>{Math.round(data.percent || 0)}%</span>
            </div>
            
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={colorStyle}
              ></div>
            </div>
            
            <div className="progress-text">
              <span>{data.text || 'Processing...'}</span>
              {!isCompleted && !isError && (
                <button
                  onClick={() => onCancel(url)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.8rem',
                    padding: 0
                  }}
                  title="Stop Download"
                >
                  <StopCircle size={14} /> Stop
                </button>
              )}
            </div>
            
            {isCompleted && data.downloadUrl && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                <button
                  onClick={() => onDismiss(url)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.9rem',
                    padding: '0.5rem'
                  }}
                >
                  <X size={16} /> Dismiss
                </button>
                <a 
                  href={data.downloadUrl} 
                  className="success-link" 
                  style={{ marginTop: 0 }}
                  download
                  target="_blank"
                  rel="noreferrer"
                >
                  Save to Computer →
                </a>
              </div>
            )}
            
            {isError && (
              <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <button
                  onClick={() => onDismiss(url)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.9rem',
                    padding: '0.5rem 1rem'
                  }}
                >
                  <X size={16} /> Dismiss Error
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ProgressManager;
