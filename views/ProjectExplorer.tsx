import React, { useState, useRef, ChangeEvent } from 'react';
import { View } from '../types';
import { Button } from '../components/Button';
import { Folder, FileCode, ChevronRight, ChevronDown, FolderOpen, Play, Bug, ShieldCheck, Wrench, File as FileIcon } from 'lucide-react';

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
    const parts = file.webkitRelativePath.split('/');
    let currentNode = root;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // It's a file
        currentNode.children.push({
          name: part,
          path: file.webkitRelativePath,
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
    if (node.kind === 'directory') return expanded ? <FolderOpen size={16} className="text-indigo-400" /> : <Folder size={16} className="text-indigo-400" />;
    if (node.name.endsWith('.ts') || node.name.endsWith('.tsx') || node.name.endsWith('.js') || node.name.endsWith('.jsx')) return <FileCode size={16} className="text-blue-400" />;
    return <FileIcon size={16} className="text-slate-500" />;
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center space-x-2 py-1 px-2 cursor-pointer transition-colors ${
          isSelected ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const tree = buildFileTree(e.target.files);
      // Determine the actual root folder (usually the first child of our dummy root)
      const projectRoot = tree.children.length === 1 && tree.children[0].kind === 'directory' ? tree.children[0] : tree;
      setRootNode(projectRoot);
      setSelectedFile(null);
      setFileContent('');
    }
  };

  const handleSelectFile = async (node: FileNode) => {
    setSelectedFile(node);
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
          <p className="text-slate-400 mt-1">Visualize project structure and select files for AI processing.</p>
        </div>
        <div className="flex gap-2">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                // @ts-ignore - webkitdirectory is non-standard but supported in modern browsers
                webkitdirectory=""
                directory=""
                multiple
                onChange={handleFileUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="secondary">
                <FolderOpen className="w-4 h-4 mr-2" />
                Open Project Folder
            </Button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden backdrop-blur-sm">
        {/* Sidebar Tree */}
        <div className="col-span-3 bg-slate-900/50 border-r border-slate-700 overflow-y-auto p-2 custom-scrollbar">
            {!rootNode ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center p-4">
                    <FolderOpen size={32} className="mb-3 opacity-50" />
                    <p className="text-sm">No folder opened.</p>
                    <p className="text-xs mt-1">Click "Open Project Folder" to start.</p>
                 </div>
            ) : (
                <FileTreeItem node={rootNode} level={0} onSelect={handleSelectFile} selectedPath={selectedFile?.path || null} />
            )}
        </div>

        {/* Main Content */}
        <div className="col-span-9 flex flex-col h-full overflow-hidden">
            {selectedFile ? (
                <>
                    <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-300 font-mono text-sm">
                            <FileCode size={16} className="text-blue-400" />
                            {selectedFile.path}
                        </div>
                        <div className="flex gap-2">
                             <Button onClick={() => handleAgentAction(View.TEST_GENERATOR)} variant="primary" className="px-3 py-1 text-xs h-8">
                                <Play size={14} className="mr-1.5" /> Generate Tests
                             </Button>
                             <Button onClick={() => handleAgentAction(View.DEBUGGER)} variant="primary" className="bg-rose-600 hover:bg-rose-700 px-3 py-1 text-xs h-8">
                                <Bug size={14} className="mr-1.5" /> Debug
                             </Button>
                             <Button onClick={() => handleAgentAction(View.CODE_REVIEW)} variant="primary" className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 text-xs h-8">
                                <ShieldCheck size={14} className="mr-1.5" /> Review
                             </Button>
                             <Button onClick={() => handleAgentAction(View.REFACTOR_BOT)} variant="primary" className="bg-purple-600 hover:bg-purple-700 px-3 py-1 text-xs h-8">
                                <Wrench size={14} className="mr-1.5" /> Refactor
                             </Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-[#0d1117] p-4 custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>
                        ) : (
                            <pre className="text-sm font-mono text-blue-100">
                                <code>{fileContent}</code>
                            </pre>
                        )}
                    </div>
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                    <FileCode size={48} className="mb-4 opacity-50" />
                    <p>Select a file from the tree to view content and actions.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};