import React from 'react';
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
    const [isRightPanelOpen, setIsRightPanelOpen] = React.useState(false);

    return (
        <div className="three-column-layout">
            {/* Left Sidebar - Navigation */}
            <aside className="left-sidebar">
                <div className="sidebar-content">
                    {leftSidebar}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                {/* Top Navigation Bar */}
                <div className="main-header-controls">
                    <button
                        className={`nav-toggle-btn ${isRightPanelOpen ? 'active' : ''}`}
                        onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                    >
                        {isRightPanelOpen ? 'Close Analysis Panel' : 'Open Dark Pattern Analysis'}
                    </button>
                </div>

                <div className="content-wrapper">
                    {mainContent}
                </div>

                {/* Right Panel Toggle Button (Side) */}
                <button
                    className={`right-panel-toggle ${isRightPanelOpen ? 'open' : ''}`}
                    onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                    title={isRightPanelOpen ? "Close Analysis Panel" : "Open Analysis Panel"}
                >
                    {isRightPanelOpen ? '→' : '←'}
                </button>
            </main>

            {/* Right Panel - Slide-in Sidebar */}
            <aside className={`right-panel ${isRightPanelOpen ? 'open' : ''}`}>
                <div className="panel-content">
                    {rightPanel}
                </div>
            </aside>

            {/* Overlay for mobile/when panel is open */}
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
