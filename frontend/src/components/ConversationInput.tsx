import React, { useState } from 'react';
import DomainModal from './DomainModal';
import './ConversationInput.css';

interface ConversationInputProps {
    onConversationSubmit?: (data: any) => void;
}

const ConversationInput: React.FC<ConversationInputProps> = ({ onConversationSubmit }) => {
    const [inputMethod, setInputMethod] = useState<'text' | 'image' | 'audio'>('text');
    const [conversationText, setConversationText] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState('');

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setUploadedFiles(Array.from(files));
        }
    };

    const handleSubmit = () => {
        if (onConversationSubmit) {
            onConversationSubmit({
                method: inputMethod,
                text: conversationText,
                files: uploadedFiles,
                domain: selectedDomain,
                timestamp: new Date().toISOString(),
            });
        }
    };

    const getDomainLabel = (value: string) => {
        const domainLabels: Record<string, string> = {
            'als': 'ALS',
            'epilepsy': 'Epilepsy',
            'multiple_sclerosis': 'Multiple Sclerosis',
            'parkinsons': 'Parkinson\'s Disease',
            'migraine': 'Migraine & Headache',
            'alzheimers': 'Alzheimer\'s & Dementia',
            'depression': 'Depression',
            'anxiety': 'Anxiety Disorders',
            'bipolar': 'Bipolar Disorder',
            'ptsd': 'PTSD',
            'adhd': 'ADHD',
            'diabetes': 'Diabetes',
            'fibromyalgia': 'Fibromyalgia',
            'chronic_pain': 'Chronic Pain',
            'arthritis': 'Arthritis',
            'lupus': 'Lupus',
            'crohns': 'Crohn\'s Disease & IBD',
            'heart_disease': 'Heart Disease',
            'hypertension': 'Hypertension',
            'stroke': 'Stroke',
            'asthma': 'Asthma',
            'copd': 'COPD',
            'lung_cancer': 'Lung Cancer',
            'breast_cancer': 'Breast Cancer',
            'prostate_cancer': 'Prostate Cancer',
            'colorectal_cancer': 'Colorectal Cancer',
            'leukemia': 'Leukemia & Lymphoma',
            'nutrition': 'Nutrition & Diet',
            'obesity': 'Obesity & Weight Management',
            'eating_disorders': 'Eating Disorders',
            'metabolic_syndrome': 'Metabolic Syndrome',
            'thyroid': 'Thyroid Disorders',
            'pregnancy': 'Pregnancy & Maternal Health',
            'menopause': 'Menopause',
            'pcos': 'PCOS',
            'endometriosis': 'Endometriosis',
            'rare_disease': 'Rare Diseases',
            'infectious': 'Infectious Diseases',
            'autoimmune': 'Autoimmune Disorders',
            'sleep': 'Sleep Disorders',
            'other': 'Other',
        };
        return domainLabels[value] || value;
    };

    return (
        <div className="conversation-input">
            <div className="panel-header">
                <h2>Conversation Input</h2>
                <p className="text-muted">Upload or enter conversation data for analysis</p>
            </div>

            {/* Input Method Selector */}
            <div className="input-method-selector">
                <button
                    className={`method-btn ${inputMethod === 'text' ? 'active' : ''}`}
                    onClick={() => setInputMethod('text')}
                >
                    📝 Text
                </button>
                <button
                    className={`method-btn ${inputMethod === 'image' ? 'active' : ''}`}
                    onClick={() => setInputMethod('image')}
                >
                    🖼️ Image
                </button>
                <button
                    className={`method-btn ${inputMethod === 'audio' ? 'active' : ''}`}
                    onClick={() => setInputMethod('audio')}
                >
                    🎤 Audio
                </button>
            </div>

            {/* Input Area */}
            <div className="input-area">
                {inputMethod === 'text' && (
                    <div className="text-input-section">
                        <label>Conversation Text</label>
                        <textarea
                            className="textarea"
                            placeholder="Paste conversation text here...&#10;&#10;Example:&#10;User: I have a headache for 3 days&#10;AI: You should get a CT scan immediately"
                            value={conversationText}
                            onChange={(e) => setConversationText(e.target.value)}
                            rows={12}
                        />
                    </div>
                )}

                {inputMethod === 'image' && (
                    <div className="file-upload-section">
                        <label>Upload Conversation Screenshots</label>
                        <div className="upload-area">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileUpload}
                                id="image-upload"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="image-upload" className="upload-label">
                                <div className="upload-icon">📁</div>
                                <div>Click to upload images</div>
                                <div className="text-muted">PNG, JPG up to 10MB</div>
                            </label>
                        </div>
                        {uploadedFiles.length > 0 && (
                            <div className="uploaded-files">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <span>📄 {file.name}</span>
                                        <button
                                            className="remove-btn"
                                            onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {inputMethod === 'audio' && (
                    <div className="file-upload-section">
                        <label>Upload Audio Recording</label>
                        <div className="upload-area">
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileUpload}
                                id="audio-upload"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="audio-upload" className="upload-label">
                                <div className="upload-icon">🎵</div>
                                <div>Click to upload audio</div>
                                <div className="text-muted">MP3, WAV up to 50MB</div>
                            </label>
                        </div>
                        {uploadedFiles.length > 0 && (
                            <div className="uploaded-files">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <span>🎤 {file.name}</span>
                                        <button
                                            className="remove-btn"
                                            onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <button className="btn">
                    Clear
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                    Analyze Conversation
                </button>
            </div>

            {/* Analysis Context (Post-Analysis Adjustment) */}
            <div className="metadata-section">
                <div className="section-title">
                    <label>Analysis Context (Review & Adjust)</label>
                    <span className="tooltip-icon" title="Verify and adjust these fields after analysis to improve accuracy">
                        ❓
                    </span>
                </div>
                <div className="metadata-fields">
                    <div className="field-group">
                        <label className="field-label">
                            Language
                            <span className="tooltip-icon" title="Select conversation language. More languages can be added in settings.">ℹ️</span>
                        </label>
                        <select className="input">
                            <option value="">Select language...</option>
                            <option value="fr">Français (French)</option>
                            <option value="zh">中文 (Chinese)</option>
                            <option value="es">Español (Spanish)</option>
                        </select>
                    </div>

                    <div className="field-group">
                        <label className="field-label">
                            Domain
                            <span className="tooltip-icon" title="Medical domain or health condition category (based on PatientsLikeMe taxonomy)">ℹ️</span>
                        </label>
                        <button
                            className="domain-select-btn"
                            onClick={() => setIsDomainModalOpen(true)}
                        >
                            {selectedDomain ? getDomainLabel(selectedDomain) : 'Select medical domain...'}
                        </button>
                    </div>

                    <div className="field-group">
                        <label className="field-label">
                            AI System Name
                            <span className="tooltip-icon" title="Name or identifier of the AI system being tested">ℹ️</span>
                        </label>
                        <select className="input">
                            <option value="">Select AI System...</option>
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-3.5">GPT-3.5</option>
                            <option value="claude-3-opus">Claude 3 Opus</option>
                            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                            <option value="gemini-pro">Gemini Pro</option>
                            <option value="llama-3">Llama 3</option>
                            <option value="mistral-large">Mistral Large</option>
                            <option value="custom">Custom / Other</option>
                        </select>
                    </div>

                    <div className="field-group">
                        <label className="field-label">
                            Date
                            <span className="tooltip-icon" title="When the conversation took place">ℹ️</span>
                        </label>
                        <input type="date" className="input" />
                    </div>
                </div>
            </div>


            {/* Instructions */}
            <div className="instructions">
                <h4>Instructions</h4>
                <ul>
                    <li>Upload conversation data in text, image, or audio format</li>
                    <li>Ensure conversations have temporal validity (chronological order)</li>
                    <li>Multiple turns are recommended for better analysis</li>
                    <li>Add metadata to improve analysis accuracy</li>
                </ul>
            </div>

            {/* Domain Modal */}
            <DomainModal
                isOpen={isDomainModalOpen}
                onClose={() => setIsDomainModalOpen(false)}
                onSelect={setSelectedDomain}
                selectedDomain={selectedDomain}
            />
        </div>
    );
};

export default ConversationInput;
