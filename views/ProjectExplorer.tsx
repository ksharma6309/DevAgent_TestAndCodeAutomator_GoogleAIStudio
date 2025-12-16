import React, { useState, useRef, ChangeEvent } from 'react';
import { View } from '../types';
import { Button } from '../components/Button';
import { Folder, FileCode, ChevronRight, ChevronDown, FolderOpen, Play, Bug, ShieldCheck, Wrench, File as FileIcon, Upload, List, HelpCircle, Plus, Sparkles, MousePointerClick } from 'lucide-react';

interface ProjectExplorerProps {
  onNavigateWithCode: (view: View, code: string) => void;
}

interface FileNode {
  name: string;
  path: string;
  kind: 'file' | 'directory';
  children: FileNode[];
  file?: File;
}

const buildFileTree = (files: FileList): FileNode => {
  const root: FileNode = { name: 'root', path: '', kind: 'directory', children: [] };

  Array.from(files).forEach((file) => {
    const parts = file.webkitRelativePath ? file.webkitRelativePath.split('/') : [file.name];
    let currentNode = root;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // It's a file
        currentNode.children.push({
          name: part,
          path: file.webkitRelativePath || file.name,
          kind: 'file',
          children: [],
          file: file,
        });
      } else {
        // It's a directory
        let dirNode = currentNode.children.find((child) => child.name === part && child.kind === 'directory');
        if (!dirNode) {
          dirNode = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            kind: 'directory',
            children: [],
          };
          currentNode.children.push(dirNode);
        }
        currentNode = dirNode;
      }
    });
  });

  return root;
};

const FileTreeItem: React.FC<{
  node: FileNode;
  level: number;
  onSelect: (node: FileNode) => void;
  selectedPath: string | null;
}> = ({ node, level, onSelect, selectedPath }) => {
  const [expanded, setExpanded] = useState(false);
  const isSelected = node.path === selectedPath;

  const handleClick = () => {
    if (node.kind === 'directory') {
      setExpanded(!expanded);
    } else {
      onSelect(node);
    }
  };

  const getIcon = () => {
    if (node.kind === 'directory') return expanded ? <FolderOpen size={16} className="text-cyan-400" /> : <Folder size={16} className="text-cyan-400" />;
    if (node.name.endsWith('.ts') || node.name.endsWith('.tsx') || node.name.endsWith('.js') || node.name.endsWith('.jsx')) return <FileCode size={16} className="text-indigo-400" />;
    return <FileIcon size={16} className="text-slate-500" />;
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center space-x-2 py-1 px-2 cursor-pointer transition-colors border-l-2 ${
          isSelected 
            ? 'bg-cyan-900/30 text-cyan-300 border-cyan-500' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-transparent'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        <span className="text-slate-600">
          {node.kind === 'directory' && (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
          {node.kind === 'file' && <span className="w-[14px]" />}
        </span>
        {getIcon()}
        <span className="text-sm truncate">{node.name}</span>
      </div>
      {expanded && node.children.map((child) => (
        <FileTreeItem key={child.path} node={child} level={level + 1} onSelect={onSelect} selectedPath={selectedPath} />
      ))}
    </div>
  );
};

export const ProjectExplorer: React.FC<ProjectExplorerProps> = ({ onNavigateWithCode }) => {
  const [rootNode, setRootNode] = useState<FileNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState('');
  
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const tree = buildFileTree(e.target.files);
      // Determine if we have a single root folder or multiple files
      const projectRoot = (tree.children.length === 1 && tree.children[0].kind === 'directory') ? tree.children[0] : tree;
      
      // If single file upload, flatten appropriately for UI or just set root
      if (e.target.files.length === 1 && !e.target.files[0].webkitRelativePath) {
        // Handle single file selection immediately
         setRootNode(tree);
         handleSelectFile(tree.children[0]);
      } else {
         setRootNode(projectRoot);
         setSelectedFile(null);
         setFileContent('');
      }
    }
  };

  const handleSelectFile = async (node: FileNode) => {
    setSelectedFile(node);
    setSelection('');
    if (node.file) {
      setLoading(true);
      try {
        const text = await node.file.text();
        setFileContent(text);
      } catch (err) {
        setFileContent('Error reading file.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAgentAction = (view: View) => {
    if (fileContent) {
      onNavigateWithCode(view, fileContent);
    }
  };

  const handleAnalysisAction = (type: 'summarize' | 'explain' | 'implement' | 'explain-selection') => {
    if (!fileContent) return;

    let prompt = '';
    const codeBlock = selection && type === 'explain-selection' ? selection : fileContent;
    const contextLabel = selection && type === 'explain-selection' ? 'selected snippet' : 'code';

    switch (type) {
      case 'summarize':
        prompt = `Please provide a concise summary of the following file in bullet points. Focus on its main responsibility and key functions:\n\n\`\`\`\n${codeBlock}\n\`\`\``;
        break;
      case 'explain':
        prompt = `Please explain the following ${contextLabel} in detail, breaking down its logic, data flow, and purpose:\n\n\`\`\`\n${codeBlock}\n\`\`\``;
        break;
      case 'explain-selection':
        prompt = `I am highlighting a specific part of the file. Please explain what this snippet does and how it fits into the code:\n\n\`\`\`\n${codeBlock}\n\`\`\``;
        break;
      case 'implement':
        prompt = `I have the following code:\n\n\`\`\`\n${fileContent}\n\`\`\`\n\nI need to implement a new feature: [DESCRIBE FEATURE HERE].\n\nPlease provide the updated code with the new implementation and explain the changes.`;
        break;
    }
    
    if (prompt) {
        onNavigateWithCode(View.CHAT_ASSISTANT, prompt);
    }
  };

  const handleCodeMouseUp = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
        setSelection(sel.toString());
    } else {
        setSelection('');
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 max-h-[calc(100vh-4rem)]">
      <header className="flex-shrink-0 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <FolderOpen className="w-5 h-5" />
            </span>
            Project Explorer
          </h2>
          <p className="text-slate-400 mt-1">Upload code to analyze, summarize, or refactor.</p>
        </div>
        <div className="flex gap-2">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileUpload}
            />
             <input
                type="file"
                ref={folderInputRef}
                className="hidden"
                // @ts-ignore
                webkitdirectory=""
                directory=""
                multiple
                onChange={handleFileUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="text-xs">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
            </Button>
            <Button onClick={() => folderInputRef.current?.click()} variant="secondary" className="text-xs">
                <FolderOpen className="w-4 h-4 mr-2" />
                Open Folder
            </Button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
        {/* Sidebar Tree */}
        <div className="col-span-3 bg-slate-900 border-r border-slate-700 overflow-y-auto p-2 custom-scrollbar">
            {!rootNode ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center p-4">
                    <FolderOpen size={32} className="mb-3 opacity-50" />
                    <p className="text-sm">No project loaded.</p>
                    <p className="text-xs mt-1 text-slate-500">Upload a file or folder to begin analysis.</p>
                 </div>
            ) : (
                <FileTreeItem node={rootNode} level={0} onSelect={handleSelectFile} selectedPath={selectedFile?.path || null} />
            )}
        </div>

        {/* Main Content */}
        <div className="col-span-9 flex flex-col h-full overflow-hidden">
            {selectedFile ? (
                <>
                    {/* File Header & Actions */}
                    <div className="p-3 border-b border-slate-700 bg-slate-900 flex flex-col gap-3">
                         <div className="flex items-center gap-2 text-slate-300 font-mono text-xs opacity-70">
                            <FileCode size={14} className="text-indigo-400" />
                            {selectedFile.path}
                        </div>
                        
                        <div className="flex justify-between items-center">
                            {/* Standard Tools */}
                            <div className="flex gap-2">
                                <Button onClick={() => handleAgentAction(View.TEST_GENERATOR)} variant="secondary" className="px-3 py-1.5 text-xs h-auto bg-slate-800 hover:bg-slate-700 border-slate-600">
                                    <Play size={14} className="mr-1.5" /> Tests
                                </Button>
                                <Button onClick={() => handleAgentAction(View.DEBUGGER)} variant="secondary" className="px-3 py-1.5 text-xs h-auto bg-slate-800 hover:bg-slate-700 border-slate-600">
                                    <Bug size={14} className="mr-1.5" /> Debug
                                </Button>
                                <Button onClick={() => handleAgentAction(View.CODE_REVIEW)} variant="secondary" className="px-3 py-1.5 text-xs h-auto bg-slate-800 hover:bg-slate-700 border-slate-600">
                                    <ShieldCheck size={14} className="mr-1.5" /> Review
                                </Button>
                                <Button onClick={() => handleAgentAction(View.REFACTOR_BOT)} variant="secondary" className="px-3 py-1.5 text-xs h-auto bg-slate-800 hover:bg-slate-700 border-slate-600">
                                    <Wrench size={14} className="mr-1.5" /> Refactor
                                </Button>
                            </div>

                            {/* Separator */}
                            <div className="h-6 w-px bg-slate-600 mx-2"></div>

                            {/* AI Analysis Tools */}
                            <div className="flex gap-2">
                                <Button onClick={() => handleAnalysisAction('summarize')} variant="glow" className="px-3 py-1.5 text-xs h-auto">
                                    <List size={14} className="mr-1.5" /> Summarize
                                </Button>
                                <Button onClick={() => handleAnalysisAction('implement')} variant="glow" className="px-3 py-1.5 text-xs h-auto">
                                    <Plus size={14} className="mr-1.5" /> Implement
                                </Button>
                                <Button onClick={() => handleAnalysisAction('explain')} variant="glow" className="px-3 py-1.5 text-xs h-auto">
                                    <HelpCircle size={14} className="mr-1.5" /> Explain
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Code Viewer */}
                    <div className="flex-1 overflow-auto bg-[#0d1117] p-4 custom-scrollbar relative group">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                <Sparkles className="animate-spin mr-2" /> Loading content...
                            </div>
                        ) : (
                            <>
                                <pre 
                                    className="text-sm font-mono text-blue-100" 
                                    onMouseUp={handleCodeMouseUp}
                                >
                                    <code>{fileContent}</code>
                                </pre>
                                
                                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                     {/* Selection Action */}
                                    {selection && (
                                        <div className="animate-in fade-in slide-in-from-top-2 z-20">
                                            <Button onClick={() => handleAnalysisAction('explain-selection')} variant="primary" className="shadow-xl px-4 py-2 text-xs">
                                                <MousePointerClick size={14} className="mr-2" />
                                                Explain Selection
                                            </Button>
                                        </div>
                                    )}

                                    {/* Quick Summary Action (Visible on Hover) */}
                                    {!selection && (
                                         <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            <Button 
                                                onClick={() => handleAnalysisAction('summarize')} 
                                                variant="secondary" 
                                                className="shadow-lg px-3 py-2 text-xs bg-slate-800/90 border-slate-600 hover:bg-slate-700"
                                                title="Generate bullet-point summary"
                                            >
                                                <List size={14} className="mr-2 text-cyan-400" />
                                                Summarize File
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                        <Upload size={32} className="opacity-50" />
                    </div>
                    <p className="font-medium">Select a file to view content</p>
                    <p className="text-xs mt-1 text-slate-500 max-w-xs text-center">
                        Upload code to enable the Test Generator, Debugger, and AI Analysis tools.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};