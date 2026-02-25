import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAssignmentStore, useWorkspaceStore, useAuthStore } from '../../stores';
import QuestionPanel from '../../components/workspace/QuestionPanel';
import SampleDataPanel from '../../components/workspace/SampleDataPanel';
import WorkspaceHeader from '../../components/workspace/WorkspaceHeader';
import ResultsPanel from '../../components/workspace/ResultsPanel';
import SubmissionsPanel from '../../components/workspace/SubmissionsPanel';
import WorkspaceTabs from '../../components/workspace/WorkspaceTabs';
import { Lightbulb } from 'lucide-react';
import '../../styles/pages/workspace/Workspace.scss';

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
            <WorkspaceHeader
                assignment={currentAssignment}
                hintLoading={hintLoading}
                executing={executing}
                onHint={handleHint}
                onExecute={handleExecute}
                onSubmit={handleSubmit}
            />

            <main className="workspace-layout">
                {/* Left Panel: Tabs */}
                <div className="workspace-panel-left">
                    <WorkspaceTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        isAuthenticated={isAuthenticated}
                    />

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
                                <SubmissionsPanel attempts={attempts} loading={attemptsLoading} />
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
