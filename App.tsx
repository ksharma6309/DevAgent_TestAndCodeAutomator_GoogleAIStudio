import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { View } from './types';
import { Dashboard } from './views/Dashboard';
import { TestGenerator } from './views/TestGenerator';
import { Debugger } from './views/Debugger';
import { CodeReview } from './views/CodeReview';
import { LogAnalyzer } from './views/LogAnalyzer';
import { RefactorBot } from './views/RefactorBot';
import { DatabaseManager } from './views/DatabaseManager';
import { ProjectExplorer } from './views/ProjectExplorer';
import { ChatAssistant } from './views/ChatAssistant';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [sharedCode, setSharedCode] = useState<string>('');

  const handleNavigate = (view: View) => {
    // Regular navigation clears shared code
    setSharedCode('');
    setCurrentView(view);
  };

  const handleNavigateWithCode = (view: View, code: string) => {
    // Navigation with data pre-fills the view
    setSharedCode(code);
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard onNavigate={handleNavigate} />;
      case View.CHAT_ASSISTANT:
        return <ChatAssistant initialPrompt={sharedCode} />;
      case View.PROJECT_EXPLORER:
        return <ProjectExplorer onNavigateWithCode={handleNavigateWithCode} />;
      case View.TEST_GENERATOR:
        return <TestGenerator initialCode={sharedCode} />;
      case View.DEBUGGER:
        return <Debugger initialCode={sharedCode} />;
      case View.CODE_REVIEW:
        return <CodeReview initialCode={sharedCode} />;
      case View.LOG_ANALYZER:
        return <LogAnalyzer />;
      case View.REFACTOR_BOT:
        return <RefactorBot initialCode={sharedCode} />;
      case View.DATABASE:
        return <DatabaseManager />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-100 bg-grid-pattern">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-full w-full relative">
         {/* Enhanced Background Effects */}
         <div className="fixed top-0 left-64 right-0 h-[500px] bg-indigo-600/5 -z-10 blur-[150px] pointer-events-none rounded-full" />
         <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/5 -z-10 blur-[150px] rounded-full pointer-events-none" />
         <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/5 -z-10 blur-[200px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto h-full">
            {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;