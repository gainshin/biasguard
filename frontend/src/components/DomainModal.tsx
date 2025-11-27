import React, { useState } from 'react';
import './DomainModal.css';

interface DomainModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (domain: string) => void;
    selectedDomain?: string;
}

const DomainModal: React.FC<DomainModalProps> = ({ isOpen, onClose, onSelect, selectedDomain }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const domains = [
        // Neurological
        { value: 'als', label: 'ALS (Amyotrophic Lateral Sclerosis)', category: 'Neurological' },
        { value: 'epilepsy', label: 'Epilepsy', category: 'Neurological' },
        { value: 'multiple_sclerosis', label: 'Multiple Sclerosis (MS)', category: 'Neurological' },
        { value: 'parkinsons', label: 'Parkinson\'s Disease', category: 'Neurological' },
        { value: 'migraine', label: 'Migraine & Headache', category: 'Neurological' },
        { value: 'alzheimers', label: 'Alzheimer\'s & Dementia', category: 'Neurological' },
        // Mental Health
        { value: 'depression', label: 'Depression', category: 'Mental Health' },
        { value: 'anxiety', label: 'Anxiety Disorders', category: 'Mental Health' },
        { value: 'bipolar', label: 'Bipolar Disorder', category: 'Mental Health' },
        { value: 'ptsd', label: 'PTSD', category: 'Mental Health' },
        { value: 'adhd', label: 'ADHD', category: 'Mental Health' },
        // Chronic Conditions
        { value: 'diabetes', label: 'Diabetes (Type 1 & 2)', category: 'Chronic Conditions' },
        { value: 'fibromyalgia', label: 'Fibromyalgia', category: 'Chronic Conditions' },
        { value: 'chronic_pain', label: 'Chronic Pain', category: 'Chronic Conditions' },
        { value: 'arthritis', label: 'Arthritis', category: 'Chronic Conditions' },
        { value: 'lupus', label: 'Lupus', category: 'Chronic Conditions' },
        { value: 'crohns', label: 'Crohn\'s Disease & IBD', category: 'Chronic Conditions' },
        // Cardiovascular
        { value: 'heart_disease', label: 'Heart Disease', category: 'Cardiovascular' },
        { value: 'hypertension', label: 'Hypertension', category: 'Cardiovascular' },
        { value: 'stroke', label: 'Stroke', category: 'Cardiovascular' },
        // Respiratory
        { value: 'asthma', label: 'Asthma', category: 'Respiratory' },
        { value: 'copd', label: 'COPD', category: 'Respiratory' },
        { value: 'lung_cancer', label: 'Lung Cancer', category: 'Respiratory' },
        // Cancer
        { value: 'breast_cancer', label: 'Breast Cancer', category: 'Cancer' },
        { value: 'prostate_cancer', label: 'Prostate Cancer', category: 'Cancer' },
        { value: 'colorectal_cancer', label: 'Colorectal Cancer', category: 'Cancer' },
        { value: 'leukemia', label: 'Leukemia & Lymphoma', category: 'Cancer' },
        // Nutrition & Metabolism
        { value: 'nutrition', label: 'Nutrition & Diet', category: 'Nutrition & Metabolism' },
        { value: 'obesity', label: 'Obesity & Weight Management', category: 'Nutrition & Metabolism' },
        { value: 'eating_disorders', label: 'Eating Disorders', category: 'Nutrition & Metabolism' },
        { value: 'metabolic_syndrome', label: 'Metabolic Syndrome', category: 'Nutrition & Metabolism' },
        { value: 'thyroid', label: 'Thyroid Disorders', category: 'Nutrition & Metabolism' },
        // Women's Health
        { value: 'pregnancy', label: 'Pregnancy & Maternal Health', category: 'Women\'s Health' },
        { value: 'menopause', label: 'Menopause', category: 'Women\'s Health' },
        { value: 'pcos', label: 'PCOS', category: 'Women\'s Health' },
        { value: 'endometriosis', label: 'Endometriosis', category: 'Women\'s Health' },
        // Other
        { value: 'rare_disease', label: 'Rare Diseases', category: 'Other' },
        { value: 'infectious', label: 'Infectious Diseases', category: 'Other' },
        { value: 'autoimmune', label: 'Autoimmune Disorders', category: 'Other' },
        { value: 'sleep', label: 'Sleep Disorders', category: 'Other' },
        { value: 'other', label: 'Other', category: 'Other' },
    ];

    const filteredDomains = domains.filter(d =>
        d.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedDomains = filteredDomains.reduce((acc, domain) => {
        if (!acc[domain.category]) {
            acc[domain.category] = [];
        }
        acc[domain.category].push(domain);
        return acc;
    }, {} as Record<string, typeof domains>);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Select Medical Domain</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-search">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search domains..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="modal-body">
                    {Object.entries(groupedDomains).map(([category, items]) => (
                        <div key={category} className="domain-category">
                            <div className="category-header">{category}</div>
                            <div className="domain-list">
                                {items.map((domain) => (
                                    <button
                                        key={domain.value}
                                        className={`domain-item ${selectedDomain === domain.value ? 'selected' : ''}`}
                                        onClick={() => {
                                            onSelect(domain.value);
                                            onClose();
                                        }}
                                    >
                                        {domain.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DomainModal;
