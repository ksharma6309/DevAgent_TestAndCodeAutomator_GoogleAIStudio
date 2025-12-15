import React, { useState, useEffect } from 'react';
import { debugCode } from '../services/geminiService';
import { saveHistoryItem } from '../utils/storage';
import { View } from '../types';
import { Button } from '../components/Button';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { Bug, Sparkles } from 'lucide-react';

interface DebuggerProps {
    initialCode?: string;
}

export const Debugger: React.FC<DebuggerProps> = ({ initialCode = '' }) => {
  const [code, setCode] = useState(initialCode);
  const [errorLog, setErrorLog] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialCode) {
        setCode(initialCode);
    }
  }, [initialCode]);

  const handleDebug = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const diagnosis = await debugCode(code, errorLog);
      setResult(diagnosis);

      // Save to History
      saveHistoryItem({
          type: View.DEBUGGER,
          input: code,
          output: diagnosis,
          metadata: { errorLog }
      });
    } catch (error) {
      console.error(error);
      setResult('Error analyzing code. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 max-h-[calc(100vh-4rem)]">
      <header className="flex-shrink-0">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="p-2 bg-rose-500/20 rounded-lg text-rose-400">
                <Bug className="w-5 h-5" />
            </span>
            AI Debugging Assistant
        </h2>
        <p className="text-slate-400 mt-1">Identify, explain, and fix bugs automatically.</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col space-y-4 h-full overflow-y-auto pr-1">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col h-1/2 min-h-[300px]">
                <label className="text-sm font-medium text-slate-300 mb-2">Buggy Code</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste the problematic code here..."
                    className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                />
            </div>
            
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col h-1/3 min-h-[200px]">
                <label className="text-sm font-medium text-slate-300 mb-2">Error Log / Context (Optional)</label>
                <textarea
                    value={errorLog}
                    onChange={(e) => setErrorLog(e.target.value)}
                    placeholder="Paste error stack trace or describe the expected behavior..."
                    className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                />
            </div>

            <Button onClick={handleDebug} isLoading={loading} disabled={!code.trim()} variant="danger" className="w-full py-3">
                <Sparkles className="w-4 h-4 mr-2" />
                Diagnose & Fix
            </Button>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col h-full overflow-hidden">
            <h3 className="font-semibold text-slate-200 mb-4 flex-shrink-0">Diagnosis & Fix</h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {result ? (
                    <MarkdownRenderer content={result} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                        <Bug size={48} className="mb-4" />
                        <p>Waiting for code to analyze</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};