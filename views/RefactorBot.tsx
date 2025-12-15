import React, { useState, useEffect } from 'react';
import { refactorCode } from '../services/geminiService';
import { saveHistoryItem } from '../utils/storage';
import { View } from '../types';
import { Button } from '../components/Button';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { Wrench, GitMerge } from 'lucide-react';

interface RefactorBotProps {
    initialCode?: string;
}

export const RefactorBot: React.FC<RefactorBotProps> = ({ initialCode = '' }) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialCode) {
        setCode(initialCode);
    }
  }, [initialCode]);

  const handleRefactor = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const refactored = await refactorCode(code);
      setResult(refactored);

       // Save to History
      saveHistoryItem({
          type: View.REFACTOR_BOT,
          input: code,
          output: refactored
      });
    } catch (error) {
      console.error(error);
      setResult('Error refactoring code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 max-h-[calc(100vh-4rem)]">
      <header className="flex-shrink-0">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                <Wrench className="w-5 h-5" />
            </span>
            AI Refactoring Bot
        </h2>
        <p className="text-slate-400 mt-1">Improve code quality, maintainability, and scalability.</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col space-y-4 h-full">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1 flex flex-col">
                <label className="text-sm font-medium text-slate-300 mb-2">Legacy / Messy Code</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste code to refactor..."
                    className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
            </div>
            <Button onClick={handleRefactor} isLoading={loading} disabled={!code.trim()} className="w-full py-3 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500">
                <GitMerge className="w-4 h-4 mr-2" />
                Refactor & Optimize
            </Button>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col h-full overflow-hidden">
            <h3 className="font-semibold text-slate-200 mb-4 flex-shrink-0">Refactored Output</h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {result ? (
                    <MarkdownRenderer content={result} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                        <Wrench size={48} className="mb-4" />
                        <p>Submit code to modernize it</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};