import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lightbulb, Play, Check } from 'lucide-react';
import '../../styles/components/workspace/WorkspaceHeader.scss';

const WorkspaceHeader = ({
    assignment,
    hintLoading,
    executing,
    onHint,
    onExecute,
    onSubmit,
}) => {
    const navigate = useNavigate();

    return (
        <header className="workspace-header">
            <div className="header-left">
                <button className="btn-back" onClick={() => navigate('/')}>
                    <ChevronLeft size={20} /> <span>Dashboard</span>
                </button>
                <div className="vertical-divider"></div>
                <div className="assignment-info">
                    <h2>{assignment.title}</h2>
                    <span className={`difficulty-badge difficulty-badge--${assignment.difficulty.toLowerCase()}`}>
                        {assignment.difficulty}
                    </span>
                </div>
            </div>
            <div className="header-actions">
                <button className="btn-action btn-hint" onClick={onHint} disabled={hintLoading}>
                    <Lightbulb size={16} /> <span>{hintLoading ? 'Thinking...' : 'Get Hint'}</span>
                </button>
                <button className="btn-action btn-run" onClick={onExecute} disabled={executing}>
                    <Play size={16} fill="currentColor" /> <span>{executing ? 'Running...' : 'Run Code'}</span>
                </button>
                <button className="btn-action btn-submit" onClick={onSubmit} disabled={executing}>
                    <Check size={16} strokeWidth={3} /> <span>{executing ? 'Checking...' : 'Submit'}</span>
                </button>
            </div>
        </header>
    );
};

export default WorkspaceHeader;
