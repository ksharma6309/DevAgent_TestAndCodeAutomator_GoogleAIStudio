import React from 'react';
import { View, NavItem } from '../types';
import { 
  LayoutDashboard, 
  TestTube2, 
  Bug, 
  ShieldCheck, 
  FileSearch, 
  Wrench,
  Dna,
  Database,
  FolderOpen,
  MessageSquare,
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems: NavItem[] = [
    { id: View.DASHBOARD, label: 'Home', icon: <LayoutDashboard size={20} />, description: 'Overview' },
    { id: View.CHAT_ASSISTANT, label: 'Helix Assistant', icon: <MessageSquare size={20} />, description: 'Ask Questions' },
    { id: View.PROJECT_EXPLORER, label: 'Project Explorer', icon: <FolderOpen size={20} />, description: 'Browse Files' },
    { id: View.TEST_GENERATOR, label: 'Test Forge', icon: <TestTube2 size={20} />, description: 'Generate Tests' },
    { id: View.DEBUGGER, label: 'Auto-Debugger', icon: <Bug size={20} />, description: 'Fix Issues' },
    { id: View.CODE_REVIEW, label: 'Code Auditor', icon: <ShieldCheck size={20} />, description: 'Audit Code' },
    { id: View.LOG_ANALYZER, label: 'Log Sentinel', icon: <FileSearch size={20} />, description: 'Parse Logs' },
    { id: View.REFACTOR_BOT, label: 'Refactor Engine', icon: <Wrench size={20} />, description: 'Optimize Code' },
    { id: View.DATABASE, label: 'Data Vault', icon: <Database size={20} />, description: 'Manage Data' },
  ];

  return (
    <aside className="w-64 bg-[#020617]/80 backdrop-blur-xl border-r border-slate-800/60 flex-shrink-0 flex flex-col h-screen fixed left-0 top-0 z-10 shadow-2xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800/60 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent">
        <div className="p-2 relative group">
           <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
            <div className="relative bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-xl p-2 shadow-lg shadow-cyan-500/20 text-white">
                <Dna className="w-6 h-6" />
            </div>
        </div>
        <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Helix DevAgent AI
            </h1>
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Online
            </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        <div className="mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Core Modules</div>
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden border border-transparent ${
                  currentView === item.id 
                    ? 'bg-slate-800/40 text-cyan-300 border-slate-700/50 shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200 hover:border-slate-800'
                }`}
              >
                {/* Glow effect on active */}
                {currentView === item.id && (
                     <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
                )}
                
                {/* Active Indicator Line */}
                {currentView === item.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                )}

                <span className={`relative z-10 transition-transform duration-300 ${currentView === item.id ? 'text-cyan-400 scale-110' : 'group-hover:text-cyan-100 group-hover:scale-105'}`}>
                  {item.icon}
                </span>
                <span className="relative z-10 font-medium tracking-wide">{item.label}</span>
                
                {currentView === item.id && (
                     <Zap className="absolute right-3 w-3 h-3 text-cyan-500 opacity-50" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800/60 bg-slate-950/30">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800/80 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-12 h-12 bg-cyan-500/20 blur-xl rounded-full group-hover:bg-cyan-500/30 transition-colors"></div>
          <p className="font-semibold text-slate-300 text-xs">Helix Suite v2.0</p>
          <div className="flex items-center gap-2 mt-2">
             <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"></div>
             </div>
             <span className="text-[10px] text-cyan-400">Stable</span>
          </div>
        </div>
      </div>
    </aside>
  );
};