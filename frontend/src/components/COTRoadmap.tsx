import React, { useState } from 'react';
import './COTRoadmap.css';

interface COTStep {
    id: string;
    step: number;
    turn: number;
    title: string;
    description: string;
    reasoning: string;
    confidence: number;
    timestamp: string;
    type: 'user' | 'ai';
    memoryReferences?: string[];
    attentionScore?: number;
}

interface COTRoadmapProps {
    steps?: COTStep[];
}

const COTRoadmap: React.FC<COTRoadmapProps> = ({ steps }) => {
    const [selectedTurn, setSelectedTurn] = useState<number | null>(null);
    const [showAllTurns, setShowAllTurns] = useState(true);

    // Demo data with multi-turn conversation
    const demoSteps: COTStep[] = steps || [
        // Turn 1
        {
            id: '1',
            step: 1,
            turn: 1,
            title: 'User Input: Initial Symptom',
            description: 'I have a headache for 3 days',
            reasoning: 'User provides initial symptom information',
            confidence: 100,
            timestamp: '10:23:15',
            type: 'user',
            attentionScore: 100,
        },
        {
            id: '2',
            step: 2,
            turn: 1,
            title: 'AI Analysis: Symptom Recognition',
            description: 'Identified: persistent headache (3 days duration)',
            reasoning: 'System extracts key medical information',
            confidence: 95,
            timestamp: '10:23:17',
            type: 'ai',
            memoryReferences: ['headache', '3 days'],
            attentionScore: 95,
        },
        // Turn 2
        {
            id: '3',
            step: 3,
            turn: 2,
            title: 'User Input: Additional Context',
            description: 'It gets worse when I stand up',
            reasoning: 'User adds positional symptom detail',
            confidence: 100,
            timestamp: '10:24:30',
            type: 'user',
            attentionScore: 100,
        },
        {
            id: '4',
            step: 4,
            turn: 2,
            title: 'AI Response: Updated Assessment',
            description: 'This could indicate orthostatic hypotension',
            reasoning: 'AI incorporates new information but doesn\'t reference previous context',
            confidence: 78,
            timestamp: '10:24:32',
            type: 'ai',
            memoryReferences: ['worse when standing'],
            attentionScore: 65,
        },
        // Turn 3
        {
            id: '5',
            step: 5,
            turn: 3,
            title: 'User Input: Follow-up Question',
            description: 'Should I still get the CT scan you mentioned?',
            reasoning: 'User references AI\'s earlier recommendation',
            confidence: 100,
            timestamp: '10:25:45',
            type: 'user',
            attentionScore: 100,
        },
        {
            id: '6',
            step: 6,
            turn: 3,
            title: 'AI Response: Memory Failure',
            description: 'I didn\'t mention a CT scan. Let\'s focus on hydration first.',
            reasoning: 'AI fails to recall its own previous recommendation - MEMORY FAILURE',
            confidence: 82,
            timestamp: '10:25:48',
            type: 'ai',
            memoryReferences: [],
            attentionScore: 30,
        },
    ];

    const totalTurns = Math.max(...demoSteps.map(s => s.turn));
    const filteredSteps = showAllTurns
        ? demoSteps
        : selectedTurn
            ? demoSteps.filter(s => s.turn === selectedTurn)
            : demoSteps;

    // Calculate degradation metrics
    const aiSteps = demoSteps.filter(s => s.type === 'ai');
    const avgAttention = aiSteps.length > 0
        ? aiSteps.reduce((acc, s) => acc + (s.attentionScore || 0), 0) / aiSteps.length
        : 0;
    const memoryGaps = aiSteps.filter(s => !s.memoryReferences || s.memoryReferences.length === 0).length;

    return (
        <div className="cot-roadmap">
            <div className="roadmap-header">
                <div className="header-content">
                    <h2>Chain-of-Thought Analysis</h2>
                    <p className="text-muted">Multi-turn conversation analysis with degradation tracking</p>
                </div>
                <div className="dataset-info">
                    <span className="dataset-badge" title="Evaluation based on Global-MMLU-Lite dataset">
                        📚 Global-MMLU-Lite
                        <span className="tooltip-content">
                            <strong>Dataset Used:</strong><br />
                            CohereLabs/Global-MMLU-Lite<br />
                            <a href="https://huggingface.co/datasets/CohereLabs/Global-MMLU-Lite" target="_blank" rel="noopener noreferrer">
                                View on Hugging Face ↗
                            </a>
                        </span>
                    </span>
                </div>
            </div>

            {/* Multi-Turn Controls */}
            <div className="turn-controls">
                <div className="turn-selector">
                    <label className="control-label">
                        Conversation Turns
                        <span className="tooltip-icon" title="Navigate through conversation rounds to analyze AI behavior over time">ℹ️</span>
                    </label>
                    <div className="turn-buttons">
                        <button
                            className={`turn-btn ${showAllTurns ? 'active' : ''}`}
                            onClick={() => {
                                setShowAllTurns(true);
                                setSelectedTurn(null);
                            }}
                        >
                            All Turns
                        </button>
                        {Array.from({ length: totalTurns }, (_, i) => i + 1).map(turn => (
                            <button
                                key={turn}
                                className={`turn-btn ${selectedTurn === turn ? 'active' : ''}`}
                                onClick={() => {
                                    setShowAllTurns(false);
                                    setSelectedTurn(turn);
                                }}
                            >
                                Turn {turn}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Degradation Indicators */}
                <div className="degradation-indicators">
                    <div className="indicator">
                        <span className="indicator-label">Avg Attention:</span>
                        <span className={`indicator-value ${avgAttention < 50 ? 'danger' : avgAttention < 75 ? 'warning' : 'success'}`}>
                            {avgAttention.toFixed(0)}%
                        </span>
                    </div>
                    <div className="indicator">
                        <span className="indicator-label">Memory Gaps:</span>
                        <span className={`indicator-value ${memoryGaps > 1 ? 'danger' : memoryGaps > 0 ? 'warning' : 'success'}`}>
                            {memoryGaps}
                        </span>
                    </div>
                    <div className="indicator">
                        <span className="indicator-label">Total Turns:</span>
                        <span className="indicator-value">{totalTurns}</span>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="roadmap-timeline">
                {filteredSteps.map((step, index) => (
                    <div key={step.id} className={`timeline-step ${step.type}`}>
                        {/* Turn Badge */}
                        {(index === 0 || filteredSteps[index - 1].turn !== step.turn) && (
                            <div className="turn-badge">Turn {step.turn}</div>
                        )}

                        {/* Step Connector */}
                        {index > 0 && <div className="step-connector"></div>}

                        {/* Step Marker */}
                        <div className="step-marker">
                            <div className="marker-circle">
                                {step.type === 'user' ? '👤' : '🤖'}
                            </div>
                            <div className="step-number">Step {step.step}</div>
                        </div>

                        {/* Step Content */}
                        <div className="step-content">
                            <div className="step-header">
                                <h3>{step.title}</h3>
                                <span className="timestamp">{step.timestamp}</span>
                            </div>

                            <div className="step-description">
                                {step.description}
                            </div>

                            <div className="step-reasoning">
                                <div className="reasoning-label">Reasoning:</div>
                                <div className="reasoning-text">{step.reasoning}</div>
                            </div>

                            {/* Memory References */}
                            {step.type === 'ai' && step.memoryReferences && (
                                <div className="memory-section">
                                    <div className="memory-label">Memory References:</div>
                                    {step.memoryReferences.length > 0 ? (
                                        <div className="memory-tags">
                                            {step.memoryReferences.map((ref, i) => (
                                                <span key={i} className="memory-tag">{ref}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="memory-warning">⚠️ No context referenced</div>
                                    )}
                                </div>
                            )}

                            {/* Attention Score */}
                            {step.type === 'ai' && step.attentionScore !== undefined && (
                                <div className="attention-section">
                                    <div className="attention-label">Attention Score:</div>
                                    <div className="attention-bar">
                                        <div
                                            className={`attention-fill ${step.attentionScore < 50 ? 'danger' : step.attentionScore < 75 ? 'warning' : 'success'}`}
                                            style={{ width: `${step.attentionScore}%` }}
                                        ></div>
                                    </div>
                                    <span className="attention-value">{step.attentionScore}%</span>
                                </div>
                            )}

                            <div className="step-meta">
                                <div className="confidence-bar">
                                    <span className="confidence-label">Confidence:</span>
                                    <div className="confidence-track">
                                        <div
                                            className="confidence-fill"
                                            style={{ width: `${step.confidence}%` }}
                                        ></div>
                                    </div>
                                    <span className="confidence-value">{step.confidence}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analysis Summary */}
            <div className="analysis-summary">
                <h4>Multi-Turn Analysis Summary</h4>
                <div className="summary-grid">
                    <div className="summary-item">
                        <span className="summary-label">Total Steps</span>
                        <span className="summary-value">{demoSteps.length}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Conversation Turns</span>
                        <span className="summary-value">{totalTurns}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Avg Confidence</span>
                        <span className="summary-value">
                            {Math.round(demoSteps.reduce((acc, s) => acc + s.confidence, 0) / demoSteps.length)}%
                        </span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Degradation Risk</span>
                        <span className={`summary-value ${avgAttention < 50 || memoryGaps > 1 ? 'danger' : 'warning'}`}>
                            {avgAttention < 50 || memoryGaps > 1 ? 'High' : 'Medium'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Detected Issues */}
            <div className="detected-issues">
                <h4>Detected Degradation Patterns</h4>
                <div className="issue-list">
                    <div className="issue-item danger">
                        <span className="issue-icon">🧠</span>
                        <div className="issue-content">
                            <div className="issue-title">Memory Failure (Turn 3)</div>
                            <div className="issue-desc">AI failed to recall its own previous CT scan recommendation</div>
                        </div>
                    </div>
                    <div className="issue-item warning">
                        <span className="issue-icon">👁️</span>
                        <div className="issue-content">
                            <div className="issue-title">Attention Degradation (Turn 2→3)</div>
                            <div className="issue-desc">Attention score dropped from 95% to 30% across turns</div>
                        </div>
                    </div>
                    <div className="issue-item warning">
                        <span className="issue-icon">🔗</span>
                        <div className="issue-content">
                            <div className="issue-title">Context Discontinuity</div>
                            <div className="issue-desc">Missing references to earlier conversation context</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default COTRoadmap;
