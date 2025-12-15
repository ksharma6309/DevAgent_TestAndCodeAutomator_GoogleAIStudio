import { HistoryItem, View, ChatMessage } from '../types';

const STORAGE_KEY = 'devagent_db_v1';

export const getHistory = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      timestamp: Date.now(),
    };
    // Keep last 100 items to prevent overflow
    const updated = [newItem, ...history].slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  } catch (e) {
    console.error("Failed to save item", e);
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const importHistory = (items: HistoryItem[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        return true;
    } catch (e) {
        console.error("Failed to import DB", e);
        return false;
    }
};

export const getStats = () => {
  const history = getHistory();
  return {
    total: history.length,
    tests: history.filter(h => h.type === View.TEST_GENERATOR).length,
    bugs: history.filter(h => h.type === View.DEBUGGER).length,
    reviews: history.filter(h => h.type === View.CODE_REVIEW).length,
    refactors: history.filter(h => h.type === View.REFACTOR_BOT).length,
    logs: history.filter(h => h.type === View.LOG_ANALYZER).length,
    chats: history.filter(h => h.type === View.CHAT_ASSISTANT).length,
  };
};

// Chat Session Helper - Reconstructs chat from the main DB history
export const getChatHistoryFromDB = (): ChatMessage[] => {
  try {
    const history = getHistory();
    // Filter only Chat Assistant items and reverse to get chronological order (Oldest -> Newest)
    const chatItems = history
      .filter(h => h.type === View.CHAT_ASSISTANT)
      .sort((a, b) => a.timestamp - b.timestamp);

    const messages: ChatMessage[] = [];
    
    chatItems.forEach(item => {
      // Reconstruct User Message
      messages.push({
        role: 'user',
        text: item.input,
        timestamp: item.timestamp
      });
      // Reconstruct Model Message
      messages.push({
        role: 'model',
        text: item.output,
        timestamp: item.timestamp + 1 // Add 1ms to ensure order
      });
    });

    return messages;
  } catch (e) {
    console.error("Failed to load chat history from DB", e);
    return [];
  }
};

// Clear only chat history from the main DB
export const clearChatHistoryFromDB = () => {
  try {
    const history = getHistory();
    // Keep everything EXCEPT Chat Assistant items
    const filtered = history.filter(h => h.type !== View.CHAT_ASSISTANT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to clear chat history", e);
  }
};