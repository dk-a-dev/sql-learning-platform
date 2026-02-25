import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAssignmentStore, useWorkspaceStore, useAuthStore } from '../../stores';
import QuestionPanel from '../../components/workspace/QuestionPanel';
import SampleDataPanel from '../../components/workspace/SampleDataPanel';
import ResultsPanel from '../../components/workspace/ResultsPanel';
import { Play, Check, Lightbulb, ChevronLeft, BookOpen, Database, History } from 'lucide-react';
import './Workspace.scss';

const Workspace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('problem'); // 'problem', 'schema', 'submissions'

    const { currentAssignment, fetchAssignmentById, loading: assignmentLoading } = useAssignmentStore();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    const {
        query, setQuery,
        results, executing, error,
        hint, hintLoading,
        attempts, attemptsLoading,
        executeQuery, submitQuery, getHint, saveAttempt, fetchAttempts,
        resetWorkspace,
    } = useWorkspaceStore();

    useEffect(() => {
        fetchAssignmentById(id);
        if (isAuthenticated) fetchAttempts(id);
        return () => resetWorkspace();
    }, [id, fetchAssignmentById, fetchAttempts, isAuthenticated, resetWorkspace]);

    const handleExecute = async () => await executeQuery();

    const handleSubmit = async () => {
        if (!currentAssignment) return;
        const result = await submitQuery(currentAssignment._id);
        if (isAuthenticated && result) {
            const status = result.isCorrect ? 'correct' : 'incorrect';
            await saveAttempt(currentAssignment._id, status);
            fetchAttempts(currentAssignment._id);
            setActiveTab('submissions'); // Switch to submissions tab after submit
        }
    };

    const handleHint = () => {
        if (!currentAssignment) return;
        getHint(currentAssignment.question, currentAssignment.schemaText);
    };

    if (assignmentLoading || !currentAssignment) {
        return <div className="loading-center">Loading workspace environment...</div>;
    }

    return (
        <div className="workspace-container">
            {/* Top Toolbar */}
            <header className="workspace-header">
                <div className="header-left">
                    <button className="btn-back" onClick={() => navigate('/')}>
                        <ChevronLeft size={20} /> <span>Dashboard</span>
                    </button>
                    <div className="vertical-divider"></div>
                    <div className="assignment-info">
                        <h2>{currentAssignment.title}</h2>
                        <span className={`difficulty-badge difficulty-badge--${currentAssignment.difficulty.toLowerCase()}`}>
                            {currentAssignment.difficulty}
                        </span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-action btn-hint" onClick={handleHint} disabled={hintLoading}>
                        <Lightbulb size={16} /> <span>{hintLoading ? 'Thinking...' : 'Get Hint'}</span>
                    </button>
                    <button className="btn-action btn-run" onClick={handleExecute} disabled={executing}>
                        <Play size={16} fill="currentColor" /> <span>{executing ? 'Running...' : 'Run Code'}</span>
                    </button>
                    <button className="btn-action btn-submit" onClick={handleSubmit} disabled={executing}>
                        <Check size={16} strokeWidth={3} /> <span>{executing ? 'Checking...' : 'Submit'}</span>
                    </button>
                </div>
            </header>

            <main className="workspace-layout">
                {/* Left Panel: Tabs */}
                <div className="workspace-panel-left">
                    <div className="panel-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'problem' ? 'active' : ''}`}
                            onClick={() => setActiveTab('problem')}
                        >
                            <BookOpen size={16} /> Description
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'schema' ? 'active' : ''}`}
                            onClick={() => setActiveTab('schema')}
                        >
                            <Database size={16} /> Schema
                        </button>
                        {isAuthenticated && (
                            <button
                                className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
                                onClick={() => setActiveTab('submissions')}
                            >
                                <History size={16} /> Submissions
                            </button>
                        )}
                    </div>

                    <div className="panel-content">
                        {activeTab === 'problem' && (
                            <div className="tab-pane fade-in">
                                <QuestionPanel assignment={currentAssignment} />
                                {hint && (
                                    <div className="hint-alert fade-in">
                                        <div className="hint-header">
                                            <Lightbulb size={16} className="hint-icon" />
                                            <strong>AI Hint</strong>
                                        </div>
                                        <p>{hint}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'schema' && (
                            <div className="tab-pane fade-in" style={{ height: '100%' }}>
                                <SampleDataPanel schema={currentAssignment.schemaText} />
                            </div>
                        )}

                        {activeTab === 'submissions' && isAuthenticated && (
                            <div className="tab-pane fade-in">
                                <div className="submissions-container">
                                    {attemptsLoading ? (
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
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Resizable Flex (Editor & Results) */}
                <div className="workspace-panel-right">
                    <div className="editor-section">
                        <div className="section-header-small">
                            <span>main.sql</span>
                        </div>
                        <div className="editor-wrapper">
                            <Editor
                                height="100%"
                                defaultLanguage="sql"
                                value={query}
                                onChange={(val) => setQuery(val)}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    scrollBeyondLastLine: false,
                                    padding: { top: 16 },
                                    lineHeight: 24,
                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                }}
                            />
                        </div>
                    </div>

                    <div className="results-section">
                        <div className="section-header-small">
                            <span>Console</span>
                        </div>
                        <div className="results-wrapper">
                            <ResultsPanel results={results} error={error} loading={executing} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Workspace;
