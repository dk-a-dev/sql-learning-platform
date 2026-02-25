import React from 'react';
import { Terminal } from 'lucide-react';
import '../../styles/components/dashboard/DashboardCard.scss';

const DashboardCard = ({ assignment, status, onClick }) => {
    return (
        <div
            className={`dashboard-card dashboard-card--${assignment.difficulty.toLowerCase()}`}
            onClick={onClick}
        >
            <div className="card-top">
                <div className={`difficulty-badge difficulty-badge--${assignment.difficulty.toLowerCase()}`}>
                    {assignment.difficulty}
                </div>
                {status.badge !== 'badge-new' && (
                    <div className={`status-icon ${status.badge}`}>
                        {status.icon}
                    </div>
                )}
            </div>

            <h3>{assignment.title}</h3>
            <p>{assignment.description}</p>

            <div className="card-footer">
                <div className="card-schema-info">
                    <Terminal size={14} />
                </div>
                <button className={`action-btn ${status.className}`}>
                    {status.label}
                </button>
            </div>
        </div>
    );
};

export default DashboardCard;
