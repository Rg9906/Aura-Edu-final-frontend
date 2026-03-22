import { useAura } from '../../application/AuraContext';
import { Calendar, ChevronRight, Download, Clock, CheckCircle2, AlertCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_SESSIONS = [
  { id: '1', date: 'OCT 24, 2023', duration: '42:15', success: 128, failure: 14, avgResponse: 240, accuracy: 92 },
  { id: '2', date: 'OCT 22, 2023', duration: '60:00', success: 204, failure: 3, avgResponse: 210, accuracy: 96 },
  { id: '3', date: 'OCT 19, 2023', duration: '15:20', success: 45, failure: 32, avgResponse: 310, accuracy: 78 },
];

export const SessionHistoryScreen = () => {
  const { sessions } = useAura();

  return (
    <main className="max-w-4xl mx-auto px-6 pt-10 pb-32">
      <section className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 uppercase">Session History</h1>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Synaptic Audit Log</span>
          <div className="h-px flex-grow bg-white/5"></div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">v2.4.0 Live</span>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="neo-card p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-surface-high flex items-center justify-center mx-auto text-on-surface-variant/20">
              <Calendar size={32} />
            </div>
            <p className="text-on-surface-variant text-sm font-medium">No sessions recorded yet.</p>
          </div>
        ) : (
          sessions.map((session, i) => (
            <motion.div 
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="neo-card overflow-hidden border border-white/5 shadow-xl transition-all hover:bg-surface-high cursor-pointer"
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-4 items-center">
                  <div className="h-11 w-11 rounded-lg bg-background border border-white/5 flex items-center justify-center text-primary">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Session Date</p>
                    <p className="text-base font-bold text-on-surface">
                      {new Date(session.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6 flex-grow max-w-lg">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Start Time</p>
                    <p className="text-sm font-semibold text-on-surface">
                      {new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">SENS-ED</p>
                    <p className="text-sm font-semibold text-primary">{(session.sensEdScore || 0).toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Success</p>
                    <p className="text-sm font-semibold text-secondary">{(session.successRate ? session.successRate * 100 : 0).toFixed(0)}%</p>
                  </div>
                </div>

                <button className="h-10 w-10 rounded-full bg-surface-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-12 p-8 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center bg-surface-low/30 backdrop-blur-sm">
        <div className="h-14 w-14 rounded-2xl bg-surface-high flex items-center justify-center text-on-surface-variant mb-5">
          <Download size={24} />
        </div>
        <h3 className="text-on-surface font-bold text-base mb-2">Comprehensive Data Export</h3>
        <p className="text-on-surface-variant text-xs leading-relaxed max-w-[280px]">Secure archive of all raw neural telemetry and event logs in encrypted CSV format.</p>
        <button className="mt-6 px-10 py-3.5 bg-surface-high hover:bg-surface-bright border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all">
          Generate Archive
        </button>
      </div>
    </main>
  );
};
