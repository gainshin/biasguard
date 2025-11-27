import React from 'react';
import ThreeColumnLayout from './components/ThreeColumnLayout';
import ConversationInput from './components/ConversationInput';
import COTRoadmap from './components/COTRoadmap';
import DarkPatternAnnotation from './components/DarkPatternAnnotation';
import './styles/index.css';

function App() {
    return (
        <ThreeColumnLayout
            leftSidebar={
                <ConversationInput />
            }
            mainContent={
                <COTRoadmap />
            }
            rightPanel={
                <DarkPatternAnnotation />
            }
        />
    );
}

export default App;
