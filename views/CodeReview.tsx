import React, { useState, useEffect } from 'react';
import { reviewCode } from '../services/geminiService';
import { saveHistoryItem, getHistory } from '../utils/storage';
import { View, HistoryItem } from '../types';
import { Button } from '../components/Button';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { ShieldCheck, Search, History, Clock, ChevronRight } from 'lucide-react';

interface CodeReviewProps {
    initialCode?: string;
}

export const CodeReview: React.FC<CodeReviewProps> = ({ initialCode = '' }) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (initialCode) {
        setCode(initialCode);
    }
  }, [initialCode]);

  const loadHistory = () => {
    const allHistory = getHistory();
    const reviewHistory = allHistory.filter(h => h.type === View.CODE_REVIEW);
    setHistory(reviewHistory);
  };

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const review = await reviewCode(code);
      setResult(review);
      
      // Save to History
      saveHistoryItem({
          type: View.CODE_REVIEW,
          input: code,
          output: review
      });
      
      // Refresh local history list
      loadHistory();
      
    } catch (error) {
      console.error(error);
      setResult('Error completing review.');
    } finally {
      setLoading(false);
    }
  };

  const loadSession = (item: HistoryItem) => {
    setCode(item.input);
    setResult(item.output);
    setShowHistory(false);
  };

  return (
    <div className="h-full flex flex-col space-y-4 max-h-[calc(100vh-4rem)] relative">
      <header className="flex-shrink-0 flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                </span>
                Autonomous Code Reviewer
            </h2>
            <p className="text-slate-400 mt-1">Deep analysis for security, performance, and style.</p>
        </div>
        <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${showHistory ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
        >
            <History size={16} />
            <span>History</span>
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 relative">
        {/* History Sidebar Overlay */}
        {showHistory && (
            <div className="absolute top-0 right-0 h-full w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
                <div className="p-4 border-b border-slate-800 bg-slate-800 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-200">Recent Audits</h3>
                    <button onClick={() => setShowHistory(false)} className="text-slate-500 hover:text-white">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {history.length === 0 ? (
                        <div className="text-center text-slate-500 p-8 text-sm">No saved reviews yet.</div>
                    ) : (
                        history.map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => loadSession(item)}
                                className="w-full text-left p-3 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all group"
                            >
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                                    <Clock size={12} />
                                    {new Date(item.timestamp).toLocaleDateString()}
                                </div>
                                <div className="text-sm font-mono text-slate-300 truncate">
                                    {item.input.substring(0, 40)}...
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        )}

        <div className="flex flex-col space-y-4 h-full">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1 flex flex-col">
                <label className="text-sm font-medium text-slate-300 mb-2">Code to Review</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste code for audit..."
                    className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
            </div>
            <Button onClick={handleReview} isLoading={loading} disabled={!code.trim()} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500">
                <Search className="w-4 h-4 mr-2" />
                Start Audit
            </Button>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col h-full overflow-hidden">
            <h3 className="font-semibold text-slate-200 mb-4 flex-shrink-0">Review Report</h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {result ? (
                    <MarkdownRenderer content={result} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                        <ShieldCheck size={48} className="mb-4" />
                        <p>Submit code for instant review</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};