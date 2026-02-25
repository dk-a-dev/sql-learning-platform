import React from 'react';
import { AlertCircle, CheckCircle2, PlayCircle, XCircle } from 'lucide-react';
import '../../styles/components/workspace/ResultsPanel.scss';

const ResultsPanel = ({ results, error, loading }) => {
    if (loading) return (
        <div className="results-panel loading">
            <span className="spinner"></span> Executing query...
        </div>
    );

    if (error) return (
        <div className="results-panel error">
            <AlertCircle size={18} /> {error}
        </div>
    );

    if (!results) return <div className="results-panel empty">Run a query to see results here.</div>;

    if (results.rows && results.rows.length === 0) {
        return (
            <div className="results-panel">
                <div className="result-banner result-banner--success">
                    <PlayCircle size={16} /> Query executed successfully — 0 rows returned.
                </div>
            </div>
        );
    }

    return (
        <div className="results-panel">
            {/* Run-only success */}
            {results.success && results.isCorrect === undefined && (
                <div className="result-banner result-banner--success">
                    <PlayCircle size={16} /> Query ran successfully — {results.rowCount} row(s) returned.
                </div>
            )}

            {/* Submit correct */}
            {results.isCorrect === true && (
                <div className="result-banner result-banner--correct">
                    <CheckCircle2 size={16} /> Correct! Your query returned the expected results.
                </div>
            )}

            {/* Submit incorrect */}
            {results.isCorrect === false && (
                <div className="result-banner result-banner--incorrect">
                    <XCircle size={16} /> Incorrect — returned {results.rowCount} row(s),
                    expected {results.expectedRowCount}. Try again!
                </div>
            )}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {results.fields.map((field, idx) => (
                                <th key={idx}>{field}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {results.rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                {results.fields.map((field, colIdx) => (
                                    <td key={colIdx}>{String(row[field] ?? '')}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultsPanel;
