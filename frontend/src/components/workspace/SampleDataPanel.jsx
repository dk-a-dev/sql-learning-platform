import React from 'react';
import './SampleDataPanel.scss';

const SampleDataPanel = ({ schema }) => {
    if (!schema) return <div className="panel empty">No sample data available.</div>;

    return (
        <div className="sample-data-panel">
            <h3>Sample Data</h3>
            <div className="schema-view">
                <pre>{schema}</pre>
            </div>
        </div>
    );
};

export default SampleDataPanel;
