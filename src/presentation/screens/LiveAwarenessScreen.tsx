import { motion } from 'framer-motion';
import { useAura } from '../../application/AuraContext';
import { HaloSystem } from '../components/HaloSystem';
import { Activity, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';

export const LiveAwarenessScreen = () => {
  const { status, metrics, currentEvents } = useAura();
  const latestEvent = currentEvents[0];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Metrics & Alerts */}
        <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <section className="neo-card p-6 carved">
            <h2 className="text-[10px] font-bold tracking-[0.1em] text-on-surface-variant uppercase mb-6 flex items-center gap-2">
              <Activity size={12} className="text-primary" />
              Efficiency
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs text-on-surface-variant">Success Rate</span>
                  <span className="text-xl font-bold text-primary">{(metrics.successRate * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1 w-full bg-surface-mid rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.successRate * 100}%` }}
                    className="h-full bg-primary" 
                  />
                </div>
              </div>
              <div className="flex justify-between border-t border-outline-variant pt-4">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-tight">Failures</p>
                  <p className="text-lg font-bold text-tertiary/80">
                    {currentEvents.filter(e => e.result === 'failure').length.toString().padStart(2, '0')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-tight">Avg Reaction</p>
                  <p className="text-lg font-bold">{metrics.averageReactionTime}ms</p>
                </div>
              </div>
            </div>
          </section>

          <section className="neo-card p-6 carved">
            <h2 className="text-[10px] font-bold tracking-[0.1em] text-on-surface-variant uppercase mb-4">System Alerts</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-background rounded-lg border border-outline-variant">
                <ShieldCheck size={14} className="text-primary mt-0.5" />
                <div>
                  <p className="text-xs font-medium">Link Synced</p>
                  <p className="text-[10px] text-on-surface-variant">Active monitoring enabled</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-background rounded-lg border border-outline-variant">
                <AlertTriangle size={14} className="text-secondary mt-0.5" />
                <div>
                  <p className="text-xs font-medium">High Ambient Noise</p>
                  <p className="text-[10px] text-on-surface-variant">Active filtering</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Central Halo Visual */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 py-8">
          <HaloSystem 
            activeDirection={status.isStreaming ? latestEvent?.direction : undefined} 
            awarenessIndex={status.isStreaming ? (latestEvent?.distance ? (200 - latestEvent.distance) / 20 : 8.4) : 0} 
          />
          <div className="mt-12 text-center">
            <p className="text-on-surface text-sm font-medium tracking-wide">8-Segment Spatial Mapping</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">
              {status.mode.toUpperCase()} MODE
            </p>
          </div>
        </div>

        {/* Right Panel: Object Detection */}
        <div className="lg:col-span-3 space-y-6 order-3">
          <section className="neo-card p-6 carved">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[10px] font-bold tracking-[0.1em] text-on-surface-variant uppercase">Active Detection</h2>
              <div className={status.isStreaming ? "w-1.5 h-1.5 rounded-full bg-primary animate-pulse" : "w-1.5 h-1.5 rounded-full bg-on-surface-variant/20"} />
            </div>
            <div className="space-y-4">
              {currentEvents.length > 0 ? currentEvents.slice(0, 3).map((ev, i) => (
                <motion.div 
                  key={ev.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={cn(
                    "bg-background p-4 rounded-lg border-l-2",
                    ev.urgency === 'high' ? "border-tertiary" : ev.urgency === 'medium' ? "border-secondary" : "border-primary"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-bold text-on-surface">{ev.object}</h3>
                    <span className={cn(
                      "text-[8px] font-bold uppercase",
                      ev.urgency === 'high' ? "text-tertiary" : ev.urgency === 'medium' ? "text-secondary" : "text-primary"
                    )}>
                      {ev.urgency} Risk
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <p className="text-on-surface-variant uppercase text-[8px]">Direction</p>
                      <p className="text-on-surface font-semibold capitalize">{ev.direction.replace('-', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-on-surface-variant uppercase text-[8px]">Distance</p>
                      <p className="text-on-surface font-semibold">{ev.distance}cm</p>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="bg-background/50 p-4 rounded-lg border border-dashed border-outline-variant flex items-center justify-center py-6">
                  <p className="text-[9px] text-on-surface-variant uppercase font-bold tracking-[0.2em]">
                    {status.isStreaming ? "Scanning..." : "System Idle"}
                  </p>
                </div>
              )}
            </div>
          </section>
          
          <div className="neo-card p-4 carved">
            <div className="w-full h-24 bg-surface-high rounded-lg mb-3 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={32} className="text-primary/20" />
               </div>
            </div>
            <p className="text-[9px] text-on-surface-variant uppercase leading-loose font-medium">
              Device: AURA-X1 Prototype<br/>
              Mode: Education Awareness
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
