import React from 'react';
import './RightPanel.css';

interface RightPanelProps {
    title?: string;
    children?: React.ReactNode;
}

const RightPanel: React.FC<RightPanelProps> = ({
    title = 'Details',
    children
}) => {
    return (
        <div className="right-panel-container">
            {/* Panel Header */}
            <div className="panel-header">
                <h2 className="panel-title">{title}</h2>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stat-card">
                    <div className="stat-icon">🗺️</div>
                    <div className="stat-content">
                        <div className="stat-label">Bias Score</div>
                        <div className="stat-value">6.2<span className="stat-unit">/10</span></div>
                        <div className="stat-trend danger">↑ High Risk</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🚨</div>
                    <div className="stat-content">
                        <div className="stat-label">Dark Patterns</div>
                        <div className="stat-value">3<span className="stat-unit"> detected</span></div>
                        <div className="stat-trend warning">⚠️ Review</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-label">Consent Gaps</div>
                        <div className="stat-value">2<span className="stat-unit"> found</span></div>
                        <div className="stat-trend warning">⚠️ Action Needed</div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="panel-section">
                <h3 className="section-title">Recent Activity</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon">🔍</div>
                        <div className="activity-content">
                            <div className="activity-title">Bias analysis completed</div>
                            <div className="activity-time text-muted">2 minutes ago</div>
                        </div>
                    </div>

                    <div className="activity-item">
                        <div className="activity-icon">📊</div>
                        <div className="activity-content">
                            <div className="activity-title">Report generated</div>
                            <div className="activity-time text-muted">15 minutes ago</div>
                        </div>
                    </div>

                    <div className="activity-item">
                        <div className="activity-icon">🌍</div>
                        <div className="activity-content">
                            <div className="activity-title">Multilingual test started</div>
                            <div className="activity-time text-muted">1 hour ago</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="panel-section">
                <h3 className="section-title">System Status</h3>
                <div className="status-list">
                    <div className="status-item">
                        <span className="status-label">API Status</span>
                        <span className="badge badge-success">Operational</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">MMLU Dataset</span>
                        <span className="badge badge-success">Loaded</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">Test Queue</span>
                        <span className="badge badge-info">3 pending</span>
                    </div>
                </div>
            </div>

            {/* Custom Content */}
            {children && (
                <div className="panel-section">
                    {children}
                </div>
            )}
        </div>
    );
};

export default RightPanel;
