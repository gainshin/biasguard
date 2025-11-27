import React, { useState } from 'react';
import './ThreeColumnLayout.css';

interface ThreeColumnLayoutProps {
    leftSidebar: React.ReactNode;
    mainContent: React.ReactNode;
    rightPanel: React.ReactNode;
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
    leftSidebar,
    mainContent,
    rightPanel,
}) => {
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

    return (
        <div className="three-column-layout">
            <div className="left-sidebar">
                <div className="sidebar-content">{leftSidebar}</div>
            </div>

            <div className="main-content">
                <div className="content-wrapper">
                    {/* Toggle Button for Right Panel */}
                    <button
                        className="panel-toggle-btn"
                        onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                        title={isRightPanelOpen ? 'Close annotation panel' : 'Open annotation panel'}
                    >
                        {isRightPanelOpen ? '✕' : '📝'} {isRightPanelOpen ? 'Close' : 'Annotations'}
                    </button>

                    {mainContent}
                </div>
            </div>

            <div className={`right-panel ${isRightPanelOpen ? 'open' : ''}`}>
                <div className="panel-content">
                    <div className="panel-header-with-close">
                        <h3>Dark Pattern Annotations</h3>
                        <button
                            className="close-panel-btn"
                            onClick={() => setIsRightPanelOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                    {rightPanel}
                </div>
            </div>

            {/* Overlay when panel is open */}
            {isRightPanelOpen && (
                <div
                    className="panel-overlay"
                    onClick={() => setIsRightPanelOpen(false)}
                />
            )}
        </div>
    );
};

export default ThreeColumnLayout;
