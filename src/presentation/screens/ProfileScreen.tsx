import { useAura } from '../../application/AuraContext';
import { User, Bell, Shield, HelpCircle, LogOut, Edit3, Apple, Target, ChevronRight, Brain, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const ProfileScreen = () => {
  const { user, logout } = useAura();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isAppleConnected, setIsAppleConnected] = useState(false);

  const handleUpdateProfile = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    try {
      // Mock update profile
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 pt-10 space-y-10 pb-32">
      <section className="flex flex-col items-center text-center space-y-5">
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-surface-high shadow-2xl bg-surface-mid flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-on-surface-variant" />
            )}
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-1 right-1 bg-primary text-background w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-background active:scale-90 transition-transform"
          >
            <Edit3 size={16} />
          </button>
        </div>
        
        <div className="space-y-1 w-full">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="flex flex-col items-center gap-2"
              >
                <input 
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-surface-high border border-outline-variant rounded-lg px-4 py-2 text-center text-lg font-bold focus:ring-2 focus:ring-primary outline-none w-full max-w-[240px]"
                  placeholder="Enter name"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={isSaving}
                    className="px-4 py-1.5 bg-primary text-background rounded-full text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-1.5 bg-surface-high text-on-surface rounded-full text-xs font-bold uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                  {user?.displayName || user?.email?.split('@')[0] || 'AURA USER'}
                </h2>
                <p className="text-on-surface-variant text-xs font-semibold tracking-widest uppercase">
                  {user?.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="uppercase tracking-[0.1em] text-[11px] font-bold text-on-surface-variant/70 px-1">Neural Baseline</h3>
        <div className="neo-card p-5 carved space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain size={18} className="text-primary" />
              <span className="text-sm font-semibold">Cognitive Load</span>
            </div>
            <span className="text-xs font-mono text-primary">Optimal</span>
          </div>
          <div className="h-20 flex items-end gap-1 px-1">
            {[40, 65, 45, 80, 55, 90, 70, 60, 85, 50, 75, 65].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-primary/20 rounded-t-sm relative group"
                style={{ height: `${h}%` }}
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm" />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-on-surface-variant text-center uppercase tracking-widest">Last 24 Hours Activity</p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="uppercase tracking-[0.1em] text-[11px] font-bold text-on-surface-variant/70 px-1">Daily Preferences</h3>
        <div className="space-y-3">
          <div className="neo-card p-5 carved flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-surface-high flex items-center justify-center text-primary/80">
                <Target size={20} />
              </div>
              <div>
                <p className="font-medium text-on-surface">Deep Focus Mode</p>
                <p className="text-xs text-on-surface-variant/80">Optimize for concentration</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-background rounded-full" />
            </div>
          </div>
          
          <div className="neo-card p-5 carved flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-surface-high flex items-center justify-center text-secondary/80">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-medium text-on-surface">Smart Alerts</p>
                <p className="text-xs text-on-surface-variant/80">Haptic feedback cues</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-surface-high rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-on-surface-variant/40 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="uppercase tracking-[0.1em] text-[11px] font-bold text-on-surface-variant/70 px-1">Health Ecosystem</h3>
        <div className="neo-card p-8 carved flex flex-col items-center text-center space-y-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center p-5 shadow-inner transition-colors ${isAppleConnected ? 'bg-primary/10' : 'bg-surface-low'}`}>
            <Apple size={40} className={isAppleConnected ? 'text-primary' : 'text-on-surface-variant/40'} />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-on-surface text-lg">Apple Health</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed px-4">Sync sleep and activity data to optimize your daily training windows.</p>
          </div>
          <button 
            onClick={() => setIsAppleConnected(!isAppleConnected)}
            className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isAppleConnected 
                ? 'bg-primary/20 text-primary border border-primary/20' 
                : 'bg-surface-high border border-white/5 text-on-surface hover:bg-surface-bright'
            }`}
          >
            {isAppleConnected ? (
              <>
                <Check size={16} />
                Connected
              </>
            ) : (
              'Connect Device'
            )}
          </button>
        </div>
      </section>

      <section className="space-y-3 pb-8">
        <button className="w-full flex items-center justify-between p-4 px-5 bg-surface-low/50 rounded-2xl text-on-surface-variant hover:text-on-surface hover:bg-surface-low transition-all">
          <div className="flex items-center gap-4">
            <Shield size={20} />
            <span className="text-sm font-semibold">Privacy & Security</span>
          </div>
          <ChevronRight size={18} className="opacity-40" />
        </button>
        <button className="w-full flex items-center justify-between p-4 px-5 bg-surface-low/50 rounded-2xl text-on-surface-variant hover:text-on-surface hover:bg-surface-low transition-all">
          <div className="flex items-center gap-4">
            <HelpCircle size={20} />
            <span className="text-sm font-semibold">Support Center</span>
          </div>
          <ChevronRight size={18} className="opacity-40" />
        </button>
        <button 
          onClick={logout}
          className="w-full py-6 text-center text-tertiary font-bold text-xs tracking-widest uppercase hover:opacity-70 transition-opacity"
        >
          Sign Out
        </button>
      </section>
    </main>
  );
};
