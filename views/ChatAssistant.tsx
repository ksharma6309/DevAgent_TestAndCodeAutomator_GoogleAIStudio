import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage, View } from '../types';
import { getChatHistoryFromDB, saveHistoryItem, clearChatHistoryFromDB } from '../utils/storage';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { Bot, User, Sparkles, Terminal, Code2, Cpu, Trash2, ArrowUp, MessageSquare, Dna } from 'lucide-react';

export const ChatAssistant: React.FC = () => {
  // Initialize state from the main database
  const [messages, setMessages] = useState<ChatMessage[]>(() => getChatHistoryFromDB());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for API
      const apiHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendChatMessage(apiHistory, userMsg.text);

      const aiMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);

      // Save the Q&A pair to the main database under "AI Architect" (CHAT_ASSISTANT)
      saveHistoryItem({
        type: View.CHAT_ASSISTANT,
        input: userMsg.text,
        output: aiMsg.text
      });

    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        role: 'model',
        text: 'Sorry, I encountered an error connecting to the neural network. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
      setMessages([]);
      clearChatHistoryFromDB();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    { icon: <Terminal size={16} />, label: "Explain TDD", prompt: "Explain Test-Driven Development (TDD) and its benefits." },
    { icon: <Code2 size={16} />, label: "Clean Code Tips", prompt: "What are the key principles of Clean Code for TypeScript?" },
    { icon: <Cpu size={16} />, label: "CI/CD Pipeline", prompt: "Describe a standard CI/CD pipeline for a React application." },
    { icon: <Sparkles size={16} />, label: "Refactoring Patterns", prompt: "What are common refactoring patterns to reduce technical debt?" },
    { icon: <Dna size={16} />, label: "Helix Capabilities", prompt: "What can you help me with as Helix AI?" },
    { icon: <MessageSquare size={16} />, label: "Mock Interview", prompt: "Ask me a technical interview question about React hooks." },
  ];

  return (
    <div className="h-full flex flex-col max-h-[calc(100vh-4rem)] relative">
      {/* Header */}
      <header className="flex-shrink-0 flex justify-between items-center mb-6 px-2">
        <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="p-2 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-xl text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <Dna className="w-6 h-6" />
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-100">Helix Architect</span>
            </h2>
            <p className="text-cyan-400/60 text-sm mt-1 ml-1 font-mono">:: Neural Interface Active ::</p>
        </div>
        {messages.length > 0 && (
            <button 
                onClick={handleClear} 
                className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                title="Clear Conversation"
            >
                <Trash2 size={18} />
            </button>
        )}
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 bg-[#030712]/60 rounded-3xl border border-white/5 flex flex-col overflow-hidden relative shadow-2xl backdrop-blur-md">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar scroll-smooth">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] relative">
                         <div className="absolute inset-0 border border-cyan-400/20 rounded-full animate-pulse-slow"></div>
                        <Bot size={48} className="text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Systems Online.</h3>
                    <p className="text-slate-400 text-center max-w-md mb-8">
                        I am Helix. Ready to assist with architecture, code logic, and deployment strategies.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                        {suggestions.map((s, i) => (
                            <button 
                                key={i}
                                onClick={() => handleSend(s.prompt)}
                                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/40 rounded-xl transition-all group text-left backdrop-blur-sm"
                            >
                                <span className="p-2 bg-slate-900 rounded-lg text-cyan-400 group-hover:text-white group-hover:bg-cyan-500 transition-colors">
                                    {s.icon}
                                </span>
                                <span className="text-slate-300 group-hover:text-white font-medium text-sm">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                messages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 fade-in duration-300`}
                    >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                            msg.role === 'user' 
                                ? 'bg-gradient-to-br from-indigo-600 to-violet-600 ring-2 ring-indigo-500/30' 
                                : 'bg-slate-900 border border-cyan-500/30 ring-2 ring-cyan-500/10'
                        }`}>
                            {msg.role === 'user' ? <User size={20} className="text-white" /> : <Dna size={20} className="text-cyan-400" />}
                        </div>

                        <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`rounded-2xl px-6 py-4 shadow-xl ${
                                msg.role === 'user' 
                                    ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-br-none border border-indigo-400/20' 
                                    : 'bg-slate-900/90 border border-white/10 text-slate-200 rounded-bl-none backdrop-blur-xl'
                            }`}>
                                {msg.role === 'user' ? (
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                ) : (
                                    <div className="markdown-content text-sm">
                                        <MarkdownRenderer content={msg.text} />
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] text-slate-500 mt-2 px-1 font-medium uppercase tracking-wider opacity-60">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))
            )}
            
            {loading && (
                <div className="flex gap-4 animate-pulse">
                     <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 border border-cyan-500/30 flex items-center justify-center">
                        <Dna size={20} className="text-cyan-400" />
                     </div>
                     <div className="bg-slate-900/50 border border-white/10 rounded-2xl rounded-bl-none px-6 py-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                     </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#030712]/80 border-t border-white/5 backdrop-blur-xl">
            <div className="relative max-w-4xl mx-auto group">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Command Helix..."
                    className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-2xl pl-5 pr-14 py-4 resize-none h-[60px] focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 focus:outline-none custom-scrollbar shadow-inner transition-all placeholder:text-slate-600 focus:bg-slate-900"
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-xl hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                >
                    <ArrowUp size={20} strokeWidth={3} />
                </button>
            </div>
            <div className="text-center mt-2">
                <p className="text-[10px] text-slate-600">
                    <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-slate-500 border border-slate-800">Return</span> to send
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};