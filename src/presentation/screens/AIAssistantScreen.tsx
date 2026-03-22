import { useAura } from '../../application/AuraContext';
import { Brain, Send, Paperclip, Mic, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export const AIAssistantScreen = () => {
  const { messages, sendMessage } = useAura();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    
    const text = input.trim();
    setInput('');
    setIsSending(true);
    try {
      await sendMessage(text);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 pt-12 pb-40 min-h-screen flex flex-col">
      <div className="mb-12 text-center space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-on-surface">How can I assist your focus today?</h2>
        <p className="text-on-surface-variant text-sm max-w-sm mx-auto opacity-80">Calibrating to your current neural baseline for optimal cognitive support.</p>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 space-y-10 mb-8 px-2 overflow-y-auto scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-surface-high' : 'bg-surface-mid'}`}>
                {msg.role === 'ai' ? (
                  <Brain className="text-primary" size={20} />
                ) : (
                  <div className="w-5 h-5 bg-on-surface-variant/20 rounded-full" />
                )}
              </div>
              <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`p-5 rounded-2xl border border-outline-variant/5 ${
                  msg.role === 'user' 
                    ? 'bg-primary/90 text-background rounded-tr-none font-medium' 
                    : 'bg-surface-mid rounded-tl-none text-on-surface'
                }`}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest px-1">
                  {msg.role === 'ai' ? 'Aura Core' : 'YOU'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isSending && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-4"
          >
            <div className="w-9 h-9 rounded-lg bg-surface-mid flex items-center justify-center flex-shrink-0">
              <Brain className="text-primary animate-pulse" size={20} />
            </div>
            <div className="bg-surface-mid p-4 rounded-2xl rounded-tl-none border border-outline-variant/5">
              <Loader2 className="animate-spin text-primary" size={16} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 md:bottom-12">
        <div className="relative flex items-center bg-surface-low border border-outline-variant/20 rounded-[28px] p-2 shadow-xl">
          <button className="w-12 h-12 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 text-[15px] px-2" 
            placeholder="Message Aura Core..." 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isSending}
          />
          <button 
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-background hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="flex justify-center mt-4 gap-8">
          <button className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1.5">
            <Mic size={14} /> Voice
          </button>
          <button className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} /> Creative
          </button>
        </div>
      </div>
    </main>
  );
};
