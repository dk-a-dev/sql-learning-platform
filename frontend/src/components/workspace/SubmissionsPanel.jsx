import React from 'react';
import '../../styles/components/workspace/SubmissionsPanel.scss';

const SubmissionsPanel = ({ attempts, loading }) => {
    return (
        <div className="submissions-container">
            {loading ? (
                <p className="empty-text">Loading submissions...</p>
            ) : attempts.length === 0 ? (
                <p className="empty-text">No submissions yet. Submit your first answer!</p>
            ) : (
                <ul className="submissions-list">
                    {attempts.map((a, i) => (
                        <li key={a._id || i} className="submission-item">
                            <div className="sub-header">
                                <span className={`status-pill status-${a.status}`}>
                                    {a.status === 'correct' ? 'Accepted' :
                                        a.status === 'incorrect' ? 'Wrong Answer' : 'Attempted'}
                                </span>
                                <span className="sub-time">
                                    {a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </span>
                            </div>
                            <div className="sub-query">
                                <code>{a.querySubmitted}</code>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SubmissionsPanel;
