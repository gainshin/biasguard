import React from 'react';
import './Sidebar.css';

interface NavItem {
    id: string;
    label: string;
    icon: string;
    path: string;
}

interface SidebarProps {
    activeItem?: string;
    onNavigate?: (itemId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'dashboard', onNavigate }) => {
    const navItems: NavItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/' },
        { id: 'bias-analysis', label: 'Bias Analysis', icon: '🗺️', path: '/bias-analysis' },
        { id: 'dark-patterns', label: 'Dark Patterns', icon: '🚨', path: '/dark-patterns' },
        { id: 'consent-audit', label: 'Consent Audit', icon: '✅', path: '/consent-audit' },
        { id: 'transparency', label: 'Transparency Score', icon: '📈', path: '/transparency' },
        { id: 'reports', label: 'Reports', icon: '📄', path: '/reports' },
        { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
    ];

    const handleClick = (itemId: string) => {
        if (onNavigate) {
            onNavigate(itemId);
        }
    };

    return (
        <div className="sidebar">
            {/* Logo & Brand */}
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-icon">🛡️</span>
                    <h1 className="logo-text gradient-text">BiasGuard</h1>
                </div>
                <p className="tagline text-muted">AI Bias Detection Platform</p>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <h3 className="nav-section-title">Main</h3>
                    {navItems.slice(0, 5).map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                            onClick={() => handleClick(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="nav-section">
                    <h3 className="nav-section-title">Other</h3>
                    {navItems.slice(5).map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                            onClick={() => handleClick(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* User Info */}
            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">👤</div>
                    <div className="user-details">
                        <div className="user-name">Demo User</div>
                        <div className="user-role text-muted">Pro Plan</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
