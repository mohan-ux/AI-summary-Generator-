import { useState } from 'react';
import TranscriptInput from './components/TranscriptInput';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorDisplay from './components/ErrorDisplay';
import { summarizeTranscript } from './services/api';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (transcript) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await summarizeTranscript(transcript);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setResults(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1><span className="bot-icon">🤖</span> AI Meeting Summarizer</h1>
        <p>Transform your meeting transcripts into actionable insights</p>
      </header>

      <main className="app-main">
        {!results && !loading && !error && (
          <TranscriptInput onSubmit={handleSubmit} isLoading={loading} />
        )}

        {loading && <LoadingIndicator />}

        {error && <ErrorDisplay error={error} onRetry={handleRetry} />}

        {results && !loading && (
          <>
            <ResultsDisplay
              summary={results.summary}
              actionItems={results.actionItems}
              timeline={results.timeline}
              ambiguities={results.ambiguities}
            />
            <button className="new-analysis-btn" onClick={handleRetry}>
              Analyze Another Transcript
            </button>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Google Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
}

export default App;
