import React from 'react';
import { BookOpen, Database, History } from 'lucide-react';
import '../../styles/components/workspace/WorkspaceTabs.scss';

const WorkspaceTabs = ({ activeTab, setActiveTab, isAuthenticated }) => {
    return (
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
    );
};

export default WorkspaceTabs;
