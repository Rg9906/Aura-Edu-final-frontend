import { useAura } from '../../application/AuraContext';
import { Sliders, Power, Target, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const SystemControlScreen = () => {
  const { status, toggleSystem, setSensitivity } = useAura();

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-12 flex flex-col gap-10">
      <section className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-on-surface">System Control</h1>
        <p className="text-on-surface-variant text-sm max-w-sm mx-auto">Interface parameters for neural stream synchronization.</p>
      </section>

      <div className="space-y-6">
        {/* Device Status Card */}
        <div className="neo-card p-6 carved flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-surface-high flex items-center justify-center">
              <Cpu className="text-primary" size={24} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.1em] mb-0.5">Device Status</div>
              <h2 className="text-lg font-medium text-on-surface flex items-center gap-2">
                Connected
                <span className="text-primary text-[10px] px-2 py-0.5 bg-primary/10 rounded-full font-bold">ACTIVE</span>
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Model</p>
            <p className="text-xs font-mono text-on-surface">AE-X1 NeuroLink</p>
          </div>
        </div>

        {/* Start/Stop Control */}
        <div className="neo-card p-10 carved flex flex-col items-center justify-center gap-8 text-center">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-on-surface uppercase tracking-widest">Neural Stream</h3>
            <p className="text-xs text-on-surface-variant">Initialize biometric data processing session</p>
          </div>
          <button 
            onClick={toggleSystem}
            className="group relative flex items-center justify-center"
          >
            <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${status.isStreaming ? 'bg-tertiary/20' : 'bg-primary/20'}`} />
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center transition-colors duration-300 shadow-xl ${status.isStreaming ? 'bg-tertiary text-background' : 'bg-primary text-background'}`}
            >
              <Power size={48} className="mb-1" />
              <span className="font-bold text-xs tracking-widest">{status.isStreaming ? 'STOP' : 'START'}</span>
            </motion.div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calibration Card */}
          <div className="neo-card p-6 carved flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.1em] mb-1">Hardware Sync</div>
              <h3 className="text-base font-semibold text-on-surface">Calibration</h3>
            </div>
            <button className="w-full py-3 bg-surface-high rounded-lg border border-outline-variant hover:bg-surface-bright transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
              <Target size={18} className="text-primary" />
              <span className="font-bold text-[11px] tracking-widest uppercase">Sync Interface</span>
            </button>
          </div>

          {/* Sensitivity Slider Card */}
          <div className="neo-card p-6 carved flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.1em] mb-1">Input Gain</div>
                <h3 className="text-base font-semibold text-on-surface">Sensitivity</h3>
              </div>
              <span className="text-primary font-mono text-sm font-bold bg-primary/10 px-2 py-0.5 rounded">{status.sensitivity}%</span>
            </div>
            <div className="relative w-full pt-4 pb-2">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={status.sensitivity}
                onChange={(e) => setSensitivity(parseInt(e.target.value))}
                className="w-full h-1 bg-surface-high rounded-full appearance-none cursor-pointer accent-primary" 
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">
              <span>Standard</span>
              <span>High Precision</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
