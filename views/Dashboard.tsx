import React, { useEffect, useState } from 'react';
import { View } from '../types';
import { getStats } from '../utils/storage';
import { 
    Activity, 
    CheckCircle2, 
    AlertTriangle, 
    Zap,
    Database,
    Dna
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardProps {
    onNavigate: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState(getStats());

  useEffect(() => {
    // Refresh stats on mount
    setStats(getStats());
  }, []);

  // Transform stats for the chart (Simple visualization for now)
  const chartData = [
    { name: 'Tests', count: stats.tests },
    { name: 'Debugs', count: stats.bugs },
    { name: 'Reviews', count: stats.reviews },
    { name: 'Refactor', count: stats.refactors },
    { name: 'Logs', count: stats.logs },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
        <header className="mb-10 flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Helix</span> Command Center
                </h1>
                <p className="text-slate-400">Real-time overview of your autonomous development lifecycle.</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-full border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                <Database size={12} className="text-cyan-400" />
                <span className="font-mono tracking-wide">LOCAL_DB: ACTIVE</span>
            </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full group-hover:bg-indigo-500/20 transition-all"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Tests Generated</p>
                        <h3 className="text-4xl font-bold text-white mt-2">{stats.tests}</h3>
                    </div>
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                        <CheckCircle2 size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full group-hover:bg-rose-500/20 transition-all"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Bugs Neutralized</p>
                        <h3 className="text-4xl font-bold text-white mt-2">{stats.bugs}</h3>
                    </div>
                    <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
                        <AlertTriangle size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full group-hover:bg-amber-500/20 transition-all"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Code Audits</p>
                        <h3 className="text-4xl font-bold text-white mt-2">{stats.reviews}</h3>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                        <Activity size={24} />
                    </div>
                </div>
            </div>

             <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full group-hover:bg-cyan-500/20 transition-all"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Refactor Ops</p>
                        <h3 className="text-4xl font-bold text-white mt-2">{stats.refactors}</h3>
                    </div>
                    <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                        <Zap size={24} />
                    </div>
                </div>
            </div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 bg-slate-900 p-8 rounded-2xl border border-white/5 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-400" />
                    System Activity
                </h3>
                <div className="h-72 w-full">
                    {stats.total > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#64748b" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fill: '#94a3b8', fontSize: 12}}
                                    dy={10}
                                />
                                <YAxis 
                                    stroke="#64748b" 
                                    allowDecimals={false} 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fill: '#94a3b8', fontSize: 12}}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#0f172a', 
                                        borderColor: '#334155', 
                                        color: '#f8fafc',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    cursor={{fill: '#1e293b', opacity: 0.8}}
                                />
                                <Bar 
                                    dataKey="count" 
                                    fill="url(#colorGradient)" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={40}
                                />
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                            <Database size={48} className="mb-4" />
                            <p>No activity recorded yet. Initialize agents.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl border border-white/5 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-6">Quick Launch</h3>
                <div className="space-y-4">
                    <button 
                        onClick={() => onNavigate(View.TEST_GENERATOR)}
                        className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 hover:border-indigo-500/50 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h4 className="font-medium text-slate-200 group-hover:text-indigo-300 relative z-10">Initialize Test Forge</h4>
                        <p className="text-xs text-slate-500 mt-1 relative z-10">Generate robust unit tests</p>
                    </button>
                    <button 
                        onClick={() => onNavigate(View.DEBUGGER)}
                        className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 hover:border-rose-500/50 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h4 className="font-medium text-slate-200 group-hover:text-rose-300 relative z-10">Deploy Auto-Debugger</h4>
                        <p className="text-xs text-slate-500 mt-1 relative z-10">Analyze traces & fix bugs</p>
                    </button>
                    <button 
                         onClick={() => onNavigate(View.CODE_REVIEW)}
                        className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 hover:border-emerald-500/50 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h4 className="font-medium text-slate-200 group-hover:text-emerald-300 relative z-10">Run Code Auditor</h4>
                        <p className="text-xs text-slate-500 mt-1 relative z-10">Security & performance scan</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};