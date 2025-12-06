import './ErrorDisplay.css';

function ErrorDisplay({ error, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">❌</div>
      <h3 className="error-title">Oops! Something Went Wrong</h3>
      <div className="error-message">
        <p>{error}</p>
      </div>
      
      <div className="error-suggestions">
        <h4>Suggestions:</h4>
        <ul>
          <li>Check that your transcript is between 50 and 50,000 characters</li>
          <li>Ensure you have a stable internet connection</li>
          <li>Try with a shorter transcript if it's very long</li>
          <li>Wait a moment and try again</li>
        </ul>
      </div>

      <button className="retry-btn" onClick={onRetry}>
        🔄 Try Again
      </button>
    </div>
  );
}

export default ErrorDisplay;
