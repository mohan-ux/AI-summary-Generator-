import './ResultsDisplay.css';

function ResultsDisplay({ summary, actionItems, timeline, ambiguities }) {
  return (
    <div className="results-container">
      <h2 className="results-title">📊 Analysis Results</h2>

      {/* Summary Section */}
      <section className="result-section">
        <h3 className="section-title">📝 Meeting Summary</h3>
        <div className="summary-content">
          <ul className="summary-list">
            {summary.map((point, index) => (
              <li key={index} className="summary-item">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Action Items Section */}
      <section className="result-section">
        <h3 className="section-title">✅ Action Items</h3>
        {actionItems.length > 0 ? (
          <div className="table-wrapper">
            <table className="action-items-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Owner</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {actionItems.map((item, index) => (
                  <tr key={index}>
                    <td className="task-cell">{item.task}</td>
                    <td className="owner-cell">
                      {item.owner || 'Unassigned'}
                    </td>
                    <td className="deadline-cell">
                      {item.deadline || 'Not specified'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No action items identified in this meeting.</p>
        )}
      </section>

      {/* Timeline Section */}
      <section className="result-section">
        <h3 className="section-title">⏱️ Meeting Timeline</h3>
        <div className="timeline-content">
          <div className="timeline-phase">
            <h4 className="phase-title">🟢 Beginning</h4>
            <ul className="timeline-list">
              {timeline.beginning.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="timeline-phase">
            <h4 className="phase-title">🟡 Middle</h4>
            <ul className="timeline-list">
              {timeline.middle.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="timeline-phase">
            <h4 className="phase-title">🔴 End</h4>
            <ul className="timeline-list">
              {timeline.end.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Ambiguities Section */}
      {ambiguities.length > 0 && (
        <section className="result-section ambiguities-section">
          <h3 className="section-title">⚠️ Quality Warnings</h3>
          <p className="ambiguities-description">
            The following segments may have quality issues or unclear content:
          </p>
          <div className="ambiguities-list">
            {ambiguities.map((item, index) => (
              <div key={index} className="ambiguity-item">
                <div className="ambiguity-header">
                  <span className="ambiguity-position">
                    Position: {item.position}
                  </span>
                  <span className="ambiguity-reason">{item.reason}</span>
                </div>
                <div className="ambiguity-segment">
                  "{item.segment}"
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ResultsDisplay;
