import React, { useState, useEffect } from 'react';
import { getHistory, clearHistory, importHistory } from '../utils/storage';
import { HistoryItem, View } from '../types';
import { Button } from '../components/Button';
import { Database, Download, Upload, Trash2, FileText, Calendar } from 'lucide-react';

export const DatabaseManager: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `devagent_db_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        if (Array.isArray(parsedData)) {
            importHistory(parsedData);
            setItems(getHistory());
            setFileError('');
        } else {
            setFileError('Invalid file format. Expected an array of history items.');
        }
      } catch (error) {
        setFileError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to permanently delete all local data? This cannot be undone.')) {
        clearHistory();
        setItems([]);
    }
  };

  // Helper to format the type for display
  const formatType = (type: View) => {
    if (type === View.CHAT_ASSISTANT) return "AI ARCHITECT";
    return type.replace('_', ' ');
  };

  return (
    <div className="h-full flex flex-col space-y-4 max-h-[calc(100vh-4rem)]">
      <header className="flex-shrink-0">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="p-2 bg-slate-700/50 rounded-lg text-slate-300">
                <Database className="w-5 h-5" />
            </span>
            Database Manager
        </h2>
        <p className="text-slate-400 mt-1">Manage your local data. Export to file for backup or import to restore.</p>
      </header>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col space-y-6">
        
        {/* Actions */}
        <div className="flex flex-wrap gap-4 p-4 bg-slate-900 rounded-lg border border-slate-700 items-center justify-between">
            <div className="flex gap-4">
                 <Button onClick={handleDownload} variant="primary">
                    <Download className="w-4 h-4 mr-2" />
                    Download Database File (.json)
                </Button>
                
                <div className="relative">
                    <input 
                        type="file" 
                        accept=".json"
                        onChange={handleUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="secondary">
                        <Upload className="w-4 h-4 mr-2" />
                        Import DB File
                    </Button>
                </div>
            </div>

            <Button onClick={handleClear} variant="danger" disabled={items.length === 0}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Database
            </Button>
        </div>

        {fileError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                {fileError}
            </div>
        )}

        {/* Data Table */}
        <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                Stored Records 
                <span className="text-xs font-normal text-slate-500 px-2 py-0.5 bg-slate-900 rounded-full">{items.length} items</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 custom-scrollbar">
                {items.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <Database size={48} className="mb-4 opacity-50" />
                        <p>No records found in database.</p>
                     </div>
                ) : (
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-800 text-slate-200 sticky top-0">
                            <tr>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Input Snippet</th>
                                <th className="p-4 font-medium">Output Size</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-800/50">
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${
                                            item.type === View.CHAT_ASSISTANT 
                                            ? 'bg-indigo-900/30 text-indigo-300 border-indigo-700/50'
                                            : 'bg-slate-800 text-slate-400 border-slate-700'
                                        }`}>
                                            {formatType(item.type)}
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="p-4 font-mono text-xs text-slate-500 truncate max-w-xs">
                                        {item.input.substring(0, 50)}...
                                    </td>
                                    <td className="p-4 flex items-center gap-2">
                                        <FileText size={14} />
                                        {item.output.length} chars
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};