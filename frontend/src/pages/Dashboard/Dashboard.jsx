import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssignmentStore, useAuthStore } from '../../stores';
import { attemptsApi } from '../../api';
import { CheckCircle, RotateCcw, PlayCircle } from 'lucide-react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import '../../styles/pages/dashboard/Dashboard.scss';

const Dashboard = () => {
    const navigate = useNavigate();
    const { assignments, loading, error, fetchAssignments } = useAssignmentStore();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const [attemptMap, setAttemptMap] = React.useState({});

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    useEffect(() => {
        if (!isAuthenticated) return;
        attemptsApi.getMine()
            .then(({ data }) => {
                const map = {};
                data.forEach((attempt) => {
                    const aId = attempt.assignment?._id || attempt.assignment;
                    if (!map[aId] || attempt.status === 'correct') {
                        map[aId] = attempt.status;
                    }
                });
                setAttemptMap(map);
            })
            .catch(() => { });
    }, [isAuthenticated]);

    const getCardStatus = (assignmentId) => {
        const status = attemptMap[assignmentId];
        if (status === 'correct') return { label: 'Solved', icon: <CheckCircle size={16} />, className: 'btn-solved', badge: 'badge-solved' };
        if (status) return { label: 'Attempted', icon: <RotateCcw size={16} />, className: 'btn-attempted', badge: 'badge-attempted' };
        return { label: 'Practice Now', icon: <PlayCircle size={16} />, className: 'btn-start', badge: 'badge-new' };
    };

    if (loading) {
        return <div className="loading-center">Loading assignments database...</div>;
    }

    if (error) {
        return <div className="loading-center" style={{ color: '#ef4444' }}>{error}</div>;
    }

    return (
        <div className="dashboard-page">
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">✨ With Brand New Challenges Every Week</div>
                    <h1>Master SQL <br />The Smart Way.</h1>
                    <p>Practice writing database queries in an interactive sandbox. Get instant validation and AI-powered hints when you get stuck.</p>
                </div>
            </section>

            <section className="challenges-section">
                <div className="section-header">
                    <h2>Available Challenges</h2>
                    <p>Select a difficulty and start practicing right away.</p>
                </div>

                <div className="dashboard-grid">
                    {assignments.length === 0 ? (
                        <div className="empty-state">No assignments available. Please seed the database.</div>
                    ) : (
                        assignments.map((assignment) => (
                            <DashboardCard
                                key={assignment._id}
                                assignment={assignment}
                                status={getCardStatus(assignment._id)}
                                onClick={() => navigate(`/workspace/${assignment._id}`)}
                            />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
