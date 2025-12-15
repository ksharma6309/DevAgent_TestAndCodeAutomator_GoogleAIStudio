import React, { useState, useEffect } from 'react';
import { generateTests } from '../services/geminiService';
import { saveHistoryItem } from '../utils/storage';
import { View } from '../types';
import { Button } from '../components/Button';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { Play, Copy, Check } from 'lucide-react';

interface TestGeneratorProps {
    initialCode?: string;
}

export const TestGenerator: React.FC<TestGeneratorProps> = ({ initialCode = '' }) => {
  const [code, setCode] = useState(initialCode);
  const [framework, setFramework] = useState('Jest');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialCode) {
        setCode(initialCode);
    }
  }, [initialCode]);

  const handleGenerate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const tests = await generateTests(code, framework);
      setResult(tests);
      
      // Save to History
      saveHistoryItem({
          type: View.TEST_GENERATOR,
          input: code,
          output: tests,
          metadata: { framework }
      });

    } catch (error) {
      console.error(error);
      setResult('Error generating tests. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-4 max-h-[calc(100vh-4rem)]">
      <header className="flex-shrink-0">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Play className="w-5 h-5" />
            </span>
            Automated Test Generator
        </h2>
        <p className="text-slate-400 mt-1">Generate robust test cases for your code instantly.</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Input Section */}
        <div className="flex flex-col space-y-4 h-full">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-medium text-slate-300">Source Code</label>
                    <select 
                        value={framework} 
                        onChange={(e) => setFramework(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
                    >
                        <option value="Jest">Jest (JavaScript/TS)</option>
                        <option value="PyTest">PyTest (Python)</option>
                        <option value="JUnit">JUnit (Java)</option>
                        <option value="Go Test">Go Test</option>
                        <option value="RSpec">RSpec (Ruby)</option>
                    </select>
                </div>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your function or class here..."
                    className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
            </div>
            <Button onClick={handleGenerate} isLoading={loading} disabled={!code.trim()} className="w-full py-3">
                Generate Tests
            </Button>
        </div>

        {/* Output Section */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col h-full overflow-hidden">
             <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 className="font-semibold text-slate-200">Generated Test Suite</h3>
                {result && (
                    <button 
                        onClick={handleCopy}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-sm transition-colors"
                    >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {result ? (
                    <MarkdownRenderer content={result} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                        <Play size={48} className="mb-4" />
                        <p>Ready to generate tests</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};