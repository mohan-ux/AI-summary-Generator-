import { useState } from 'react';
import './TranscriptInput.css';

function TranscriptInput({ onSubmit, isLoading }) {
  const [transcript, setTranscript] = useState('');
  const [validationError, setValidationError] = useState('');

  const MIN_LENGTH = 50;
  const MAX_LENGTH = 50000;

  const handleChange = (e) => {
    const value = e.target.value;
    setTranscript(value);
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = transcript.trim();
    const length = trimmed.length;

    // Validate length
    if (length < MIN_LENGTH) {
      setValidationError(`Transcript must be at least ${MIN_LENGTH} characters. Current: ${length}`);
      return;
    }

    if (length > MAX_LENGTH) {
      setValidationError(`Transcript must not exceed ${MAX_LENGTH} characters. Current: ${length}`);
      return;
    }

    onSubmit(trimmed);
  };

  const characterCount = transcript.length;
  const isValid = characterCount >= MIN_LENGTH && characterCount <= MAX_LENGTH;

  return (
    <div className="transcript-input-container">
      <h2>📝 Enter Meeting Transcript</h2>
      <p className="input-description">
        Paste your meeting transcript below (Zoom, Google Meet, or any text format)
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          className={`transcript-textarea ${validationError ? 'error' : ''}`}
          value={transcript}
          onChange={handleChange}
          placeholder="Paste your meeting transcript here...

Example:
John: Hey everyone, thanks for joining today's standup.
Sarah: No problem! I wanted to discuss the new feature we're building.
John: Great, let's start with that. What's the current status?
Sarah: I've completed the UI mockups and shared them in Slack..."
          disabled={isLoading}
        />

        <div className="input-footer">
          <div className="character-count">
            <span className={isValid ? 'valid' : 'invalid'}>
              {characterCount.toLocaleString()} / {MAX_LENGTH.toLocaleString()} characters
            </span>
            {characterCount < MIN_LENGTH && (
              <span className="min-warning">
                (minimum {MIN_LENGTH} required)
              </span>
            )}
          </div>

          {validationError && (
            <div className="validation-error">
              ⚠️ {validationError}
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading || !isValid}
          >
            {isLoading ? 'Processing...' : '🚀 Analyze Meeting'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TranscriptInput;
