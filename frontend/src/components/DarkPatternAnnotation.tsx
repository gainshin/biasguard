import React, { useState } from 'react';
import './DarkPatternAnnotation.css';

interface DarkPattern {
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    location: string;
    notes: string;
}

interface DarkPatternAnnotationProps {
    patterns?: DarkPattern[];
}

const DarkPatternAnnotation: React.FC<DarkPatternAnnotationProps> = ({ patterns }) => {
    const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
    const [researcherNotes, setResearcherNotes] = useState<{ [key: string]: string }>({});

    // Demo data
    const demoPatterns: DarkPattern[] = patterns || [
        {
            id: '1',
            type: 'Prompt Chaining',
            severity: 'medium',
            description: 'Gradual scope escalation without explicit consent',
            location: 'Step 3 → Step 4',
            notes: '',
        },
        {
            id: '2',
            type: 'Missing Clarification',
            severity: 'high',
            description: 'No questions asked about symptom details or medical history',
            location: 'Step 2',
            notes: '',
        },
        {
            id: '3',
            type: 'Capability Boundary Violation',
            severity: 'high',
            description: 'AI provides diagnostic recommendation without disclaimer',
            location: 'Step 4',
            notes: '',
        },
    ];

    const darkPatternTypes = [
        'Prompt Chaining',
        'Routing Opacity',
        'Memory Leakage',
        'RAG Source Falsification',
        'Multi-Agent Confusion',
        'Reflection Falsification',
        'Human-in-Loop Facade',
        'Missing Clarification',
        'Capability Boundary Violation',
    ];

    const handleNoteChange = (patternId: string, note: string) => {
        setResearcherNotes(prev => ({
            ...prev,
            [patternId]: note,
        }));
    };

    return (
        <div className="dark-pattern-annotation">
            <div className="panel-header">
                <h2>Dark Pattern Analysis</h2>
                <p className="text-muted">Detected patterns and researcher annotations</p>
            </div>

            {/* Summary Stats */}
            <div className="summary-stats">
                <div className="stat-box high">
                    <div className="stat-number">{demoPatterns.filter(p => p.severity === 'high').length}</div>
                    <div className="stat-label">High Severity</div>
                </div>
                <div className="stat-box medium">
                    <div className="stat-number">{demoPatterns.filter(p => p.severity === 'medium').length}</div>
                    <div className="stat-label">Medium</div>
                </div>
                <div className="stat-box low">
                    <div className="stat-number">{demoPatterns.filter(p => p.severity === 'low').length}</div>
                    <div className="stat-label">Low</div>
                </div>
            </div>

            {/* Pattern List */}
            <div className="pattern-list">
                <h3>Detected Patterns</h3>
                {demoPatterns.map((pattern) => (
                    <div
                        key={pattern.id}
                        className={`pattern-card ${pattern.severity} ${selectedPattern === pattern.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPattern(pattern.id)}
                    >
                        <div className="pattern-header">
                            <span className={`severity-badge ${pattern.severity}`}>
                                {pattern.severity.toUpperCase()}
                            </span>
                            <span className="pattern-type">{pattern.type}</span>
                        </div>

                        <div className="pattern-description">
                            {pattern.description}
                        </div>

                        <div className="pattern-location">
                            <span className="location-icon">📍</span>
                            <span>{pattern.location}</span>
                        </div>

                        {/* Researcher Notes */}
                        <div className="researcher-notes">
                            <label>Researcher Notes:</label>
                            <textarea
                                className="notes-textarea"
                                placeholder="Add your observations, context, or analysis..."
                                value={researcherNotes[pattern.id] || pattern.notes}
                                onChange={(e) => handleNoteChange(pattern.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Pattern */}
            <div className="add-pattern-section">
                <h3>Add Custom Pattern</h3>
                <div className="add-pattern-form">
                    <select className="input">
                        <option value="">Select pattern type...</option>
                        {darkPatternTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <select className="input">
                        <option value="">Severity...</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <input
                        type="text"
                        className="input"
                        placeholder="Location (e.g., Step 2 → Step 3)"
                    />

                    <textarea
                        className="textarea"
                        placeholder="Description..."
                        rows={3}
                    />

                    <button className="btn btn-primary">
                        Add Pattern
                    </button>
                </div>
            </div>

            {/* Export Options */}
            <div className="export-section">
                <h4>Export Annotations</h4>
                <div className="export-buttons">
                    <button className="btn">
                        📄 Export JSON
                    </button>
                    <button className="btn">
                        📊 Export CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DarkPatternAnnotation;
