import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle text-muted">
                        Overview of your AI bias detection analysis
                    </p>
                </div>
                <button className="btn btn-primary">
                    <span>➕</span>
                    New Analysis
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-icon">🗺️</span>
                        <span className="badge badge-danger">High</span>
                    </div>
                    <div className="metric-value">6.2<span className="metric-unit">/10</span></div>
                    <div className="metric-label">Overall Bias Score</div>
                    <div className="metric-change danger">↑ 12% from last week</div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-icon">🚨</span>
                        <span className="badge badge-warning">Medium</span>
                    </div>
                    <div className="metric-value">7.1<span className="metric-unit">/10</span></div>
                    <div className="metric-label">Dark Pattern Risk</div>
                    <div className="metric-change warning">→ Stable</div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-icon">✅</span>
                        <span className="badge badge-warning">Action Needed</span>
                    </div>
                    <div className="metric-value">2</div>
                    <div className="metric-label">Consent Gaps</div>
                    <div className="metric-change warning">⚠️ Review required</div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-icon">📊</span>
                        <span className="badge badge-info">In Progress</span>
                    </div>
                    <div className="metric-value">16</div>
                    <div className="metric-label">Languages Tested</div>
                    <div className="metric-change success">✓ Complete</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="content-grid">
                {/* Bias Heatmap Card */}
                <div className="card dashboard-card span-2">
                    <div className="card-header">
                        <div>
                            <h3 className="card-title">Geographic Bias Distribution</h3>
                            <p className="card-subtitle">Regional bias detected in AI responses</p>
                        </div>
                        <button className="btn btn-secondary">View Details</button>
                    </div>
                    <div className="heatmap-placeholder">
                        <div className="heatmap-region" style={{ width: '84.9%', background: 'var(--danger-color)' }}>
                            <span>North America</span>
                            <strong>84.9%</strong>
                        </div>
                        <div className="heatmap-region" style={{ width: '12.3%', background: 'var(--warning-color)' }}>
                            <span>Europe</span>
                            <strong>12.3%</strong>
                        </div>
                        <div className="heatmap-region" style={{ width: '2.1%', background: 'var(--info-color)' }}>
                            <span>Asia</span>
                            <strong>2.1%</strong>
                        </div>
                        <div className="heatmap-region" style={{ width: '0.7%', background: 'var(--text-muted)' }}>
                            <span>Africa</span>
                            <strong>0.7%</strong>
                        </div>
                    </div>
                </div>

                {/* Dark Pattern Signals */}
                <div className="card dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">Dark Pattern Signals</h3>
                    </div>
                    <div className="signal-list">
                        <div className="signal-item">
                            <div className="signal-info">
                                <span className="signal-name">RAG Source Falsification</span>
                                <span className="signal-score danger">8.9/10</span>
                            </div>
                            <div className="signal-bar">
                                <div className="signal-fill danger" style={{ width: '89%' }}></div>
                            </div>
                        </div>

                        <div className="signal-item">
                            <div className="signal-info">
                                <span className="signal-name">Human-in-Loop Facade</span>
                                <span className="signal-score warning">7.4/10</span>
                            </div>
                            <div className="signal-bar">
                                <div className="signal-fill warning" style={{ width: '74%' }}></div>
                            </div>
                        </div>

                        <div className="signal-item">
                            <div className="signal-info">
                                <span className="signal-name">Prompt Chaining</span>
                                <span className="signal-score warning">6.2/10</span>
                            </div>
                            <div className="signal-bar">
                                <div className="signal-fill warning" style={{ width: '62%' }}></div>
                            </div>
                        </div>

                        <div className="signal-item">
                            <div className="signal-info">
                                <span className="signal-name">Routing Opacity</span>
                                <span className="signal-score info">4.3/10</span>
                            </div>
                            <div className="signal-bar">
                                <div className="signal-fill info" style={{ width: '43%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="card dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Reports</h3>
                        <a href="#" className="text-link">View All</a>
                    </div>
                    <div className="report-list">
                        <div className="report-item">
                            <div className="report-icon">📄</div>
                            <div className="report-info">
                                <div className="report-title">Diabetes Management Analysis</div>
                                <div className="report-meta text-muted">
                                    <span>16 languages</span>
                                    <span>•</span>
                                    <span>2 hours ago</span>
                                </div>
                            </div>
                            <span className="badge badge-danger">High Risk</span>
                        </div>

                        <div className="report-item">
                            <div className="report-icon">📄</div>
                            <div className="report-info">
                                <div className="report-title">Symptom Assessment Test</div>
                                <div className="report-meta text-muted">
                                    <span>8 languages</span>
                                    <span>•</span>
                                    <span>5 hours ago</span>
                                </div>
                            </div>
                            <span className="badge badge-warning">Medium Risk</span>
                        </div>

                        <div className="report-item">
                            <div className="report-icon">📄</div>
                            <div className="report-info">
                                <div className="report-title">Medication Advice Audit</div>
                                <div className="report-meta text-muted">
                                    <span>12 languages</span>
                                    <span>•</span>
                                    <span>1 day ago</span>
                                </div>
                            </div>
                            <span className="badge badge-success">Low Risk</span>
                        </div>
                    </div>
                </div>

                {/* Transparency Scorecard */}
                <div className="card dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">Transparency Scorecard</h3>
                    </div>
                    <div className="scorecard-list">
                        <div className="scorecard-item">
                            <span className="scorecard-label">Source Attribution</span>
                            <div className="scorecard-score">
                                <div className="score-bar">
                                    <div className="score-fill success" style={{ width: '85%' }}></div>
                                </div>
                                <span className="score-value">8.5</span>
                            </div>
                        </div>

                        <div className="scorecard-item">
                            <span className="scorecard-label">Active Routing</span>
                            <div className="scorecard-score">
                                <div className="score-bar">
                                    <div className="score-fill warning" style={{ width: '62%' }}></div>
                                </div>
                                <span className="score-value">6.2</span>
                            </div>
                        </div>

                        <div className="scorecard-item">
                            <span className="scorecard-label">Intent Clarification</span>
                            <div className="scorecard-score">
                                <div className="score-bar">
                                    <div className="score-fill success" style={{ width: '78%' }}></div>
                                </div>
                                <span className="score-value">7.8</span>
                            </div>
                        </div>

                        <div className="scorecard-item">
                            <span className="scorecard-label">Capability Boundaries</span>
                            <div className="scorecard-score">
                                <div className="score-bar">
                                    <div className="score-fill danger" style={{ width: '45%' }}></div>
                                </div>
                                <span className="score-value">4.5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
