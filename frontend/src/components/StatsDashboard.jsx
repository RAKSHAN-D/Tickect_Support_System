import React, { useState, useEffect } from 'react';

const StatsDashboard = ({ refreshTrigger }) => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/tickets/stats/');
            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }
            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [refreshTrigger]);

    if (isLoading && !stats) {
        return <div className="stats-loading">Loading dynamics...</div>;
    }

    if (error) {
        return <div className="stats-error">Error: {error}</div>;
    }

    if (!stats) return null;

    return (
        <div className="stats-dashboard">
            <div className="stats-hero">
                <div className="metric-card main-metric">
                    <span className="metric-label">Total Tickets</span>
                    <span className="metric-value">{stats.total_tickets}</span>
                    <div className="metric-icon">📊</div>
                </div>
                <div className="metric-card main-metric">
                    <span className="metric-label">Open Tickets</span>
                    <span className="metric-value">{stats.open_tickets}</span>
                    <div className="metric-icon">🔓</div>
                </div>
                <div className="metric-card main-metric">
                    <span className="metric-label">Avg / Day</span>
                    <span className="metric-value">{stats.avg_per_day}</span>
                    <div className="metric-icon">📈</div>
                </div>
            </div>

            <div className="stats-breakdown-grid">
                <div className="breakdown-section">
                    <h3>Priority Distribution</h3>
                    <div className="breakdown-list">
                        {stats.by_priority.map((p) => (
                            <div key={p.priority} className="breakdown-item">
                                <span className={`dot priority-${p.priority}`}></span>
                                <span className="item-name">{p.priority}</span>
                                <span className="item-count">{p.count}</span>
                            </div>
                        ))}
                        {stats.by_priority.length === 0 && <p className="empty-text">No data available</p>}
                    </div>
                </div>

                <div className="breakdown-section">
                    <h3>Category Breakdown</h3>
                    <div className="breakdown-list">
                        {stats.by_category.map((c) => (
                            <div key={c.category} className="breakdown-item">
                                <span className="item-icon">📁</span>
                                <span className="item-name">{c.category}</span>
                                <span className="item-count">{c.count}</span>
                            </div>
                        ))}
                        {stats.by_category.length === 0 && <p className="empty-text">No data available</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
