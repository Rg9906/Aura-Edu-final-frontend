import React, { useState } from 'react';
import { useAura } from './application/AuraContext';
import { LiveAwarenessScreen } from './presentation/screens/LiveAwarenessScreen';
import { AnalyticsScreen } from './presentation/screens/AnalyticsScreen';
import { SystemControlScreen } from './presentation/screens/SystemControlScreen';
import { SessionHistoryScreen } from './presentation/screens/SessionHistoryScreen';
import { AIAssistantScreen } from './presentation/screens/AIAssistantScreen';
import { ProfileScreen } from './presentation/screens/ProfileScreen';
import { Radio, TrendingUp, History, Sliders, Brain, UserCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'live', label: 'Live', icon: Radio },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'history', label: 'History', icon: History },
  { id: 'system', label: 'System', icon: Sliders },
  { id: 'assistant', label: 'Assistant', icon: Brain },
  { id: 'profile', label: 'Profile', icon: UserCircle },
];

export default function App() {
  const { user, login, logout, status, isAuthReady } = useAura();
  const [activeTab, setActiveTab] = useState('live');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-primary font-bold tracking-widest text-xs uppercase">Initializing Aura...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md neo-card p-8 carved space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-2">
              <Brain className="text-primary" size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-primary">AURA-EDU</h1>
            <p className="text-on-surface-variant text-sm">Neuroadaptive Rehabilitation System</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">User Name</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-surface-low border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter user name"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-surface-low border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-tertiary text-xs text-center bg-tertiary/10 p-2 rounded-lg">{error}</p>}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isLoading ? 'PROCESSING...' : 'INITIALIZE SYSTEM'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Brain className="text-primary" size={24} />
            <h1 className="font-bold text-primary text-xl tracking-tight">AURA-EDU</h1>
          </div>
          <div className="flex items-center gap-3 bg-surface-low px-4 py-1.5 rounded-full border border-outline-variant">
            <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Battery</span>
            <div className="flex items-center gap-2">
              <span className="text-primary font-mono font-bold text-sm">{status.batteryLevel}%</span>
              <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,228,117,0.5)]" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'live' && (
            <motion.div 
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LiveAwarenessScreen />
            </motion.div>
          )}
          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnalyticsScreen />
            </motion.div>
          )}
          {activeTab === 'system' && (
            <motion.div 
              key="system"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SystemControlScreen />
            </motion.div>
          )}
          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SessionHistoryScreen />
            </motion.div>
          )}
          {activeTab === 'assistant' && (
            <motion.div 
              key="assistant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AIAssistantScreen />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProfileScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 bg-background/90 backdrop-blur-xl border-t border-outline-variant">
        <div className="flex justify-around items-center px-4 pb-8 pt-4 max-w-lg mx-auto">
          {NAV_ITEMS.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-primary' : 'text-on-surface-variant opacity-50 hover:opacity-100'}`}
            >
              <item.icon size={24} />
              <span className="uppercase tracking-widest text-[8px] font-bold">{item.label}</span>
            </button>
          ))}
          <button 
            onClick={logout}
            className="flex flex-col items-center gap-1 text-tertiary opacity-50 hover:opacity-100 transition-all"
          >
            <LogOut size={24} />
            <span className="uppercase tracking-widest text-[8px] font-bold">Exit</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
