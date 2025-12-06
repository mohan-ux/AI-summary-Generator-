import './LoadingIndicator.css';

function LoadingIndicator() {
  return (
    <div className="loading-container">
      <div className="spinner-wrapper">
        <div className="spinner"></div>
      </div>
      <h3 className="loading-title">Analyzing Your Meeting...</h3>
      <div className="loading-steps">
        <div className="loading-step">
          <span className="step-icon">🔍</span>
          <span>Chunking transcript into topics</span>
        </div>
        <div className="loading-step">
          <span className="step-icon">🧠</span>
          <span>Extracting key insights</span>
        </div>
        <div className="loading-step">
          <span className="step-icon">✨</span>
          <span>Generating summary</span>
        </div>
      </div>
      <p className="loading-message">This may take 20-40 seconds...</p>
    </div>
  );
}

export default LoadingIndicator;
