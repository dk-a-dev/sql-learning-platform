import React from 'react';
import './QuestionPanel.scss';

const QuestionPanel = ({ assignment }) => {
    if (!assignment) return <div className="panel empty">Loading assignment...</div>;

    return (
        <div className="question-panel">
            <div className="question-panel__header">
                <h2>{assignment.title}</h2>
                <span className={`badge badge--${assignment.difficulty.toLowerCase()}`}>
                    {assignment.difficulty}
                </span>
            </div>
            <div className="question-panel__content">
                <p className="description">{assignment.description}</p>
                <div className="question-box">
                    <strong>Task:</strong>
                    <p>{assignment.question}</p>
                </div>
            </div>
        </div>
    );
};

export default QuestionPanel;
