import { motion } from 'framer-motion';
import { useAura } from '../../application/AuraContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { Lightbulb, TrendingUp, Target, Brain } from 'lucide-react';

const MOCK_GRAPH_DATA = [
  { day: 'MON', phaseA: 40, phaseB: 60 },
  { day: 'TUE', phaseA: 30, phaseB: 80 },
  { day: 'WED', phaseA: 50, phaseB: 40 },
  { day: 'THU', phaseA: 45, phaseB: 90 },
  { day: 'FRI', phaseA: 60, phaseB: 20 },
];

export const AnalyticsScreen = () => {
  const { metrics, sessions } = useAura();

  const graphData = sessions.slice(0, 7).reverse().map(session => ({
    day: new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    score: session.sensEdScore || 0,
    accuracy: (session.successRate || 0) * 100
  }));

  return (
    <div className="max-w-5xl mx-auto px-6 pt-8 pb-32 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="font-label uppercase tracking-[0.1em] text-[10px] font-semibold text-on-surface-variant">Performance Summary</p>
          <h2 className="text-3xl font-bold tracking-tight mt-1 text-on-surface">Biometric Data</h2>
        </div>
        <div className="bg-surface-mid px-4 py-1.5 rounded-full border border-outline-variant flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-medium">Session Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* SENS-ED Score */}
        <div className="md:col-span-4 neo-card p-8 carved flex flex-col justify-between min-h-[280px]">
          <div>
            <h3 className="font-label uppercase tracking-[0.1em] text-[10px] font-semibold text-on-surface-variant mb-4">SENS-ED SCORE</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-7xl font-bold tracking-tighter text-on-surface">{metrics.sensEdScore.toFixed(1)}</span>
              <span className="text-xl font-medium text-on-surface-variant">/100</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Efficiency is currently stable and within optimal parameters for deep learning integration.
            </p>
          </div>
        </div>

        {/* Success Probability Graph */}
        <div className="md:col-span-8 neo-card p-6 carved">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-label uppercase tracking-[0.1em] text-[10px] font-semibold text-on-surface-variant">SESSION PERFORMANCE (%)</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant font-medium">SENS-ED</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant font-medium">Accuracy</span>
              </div>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData.length > 0 ? graphData : [{ day: 'N/A', score: 0, accuracy: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(205, 196, 204, 0.05)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#cdc4cc', fontSize: 9 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#16091b', border: '1px solid rgba(75, 69, 76, 0.15)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '10px' }}
                />
                <Line type="monotone" dataKey="score" stroke="#00e475" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="accuracy" stroke="#feb300" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Integration Metrics */}
        <div className="md:col-span-6 neo-card p-6 carved flex flex-col">
          <h3 className="font-label uppercase tracking-[0.1em] text-[10px] font-semibold text-on-surface-variant mb-6">INTEGRATION METRICS</h3>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-medium text-primary">SUCCESSFUL TRIALS</span>
                <span className="text-lg font-bold">1,240</span>
              </div>
              <div className="h-2 w-full bg-surface-mid rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[75%] rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-medium text-on-surface-variant">INCOMPLETE TRIALS</span>
                <span className="text-lg font-bold">412</span>
              </div>
              <div className="h-2 w-full bg-surface-mid rounded-full overflow-hidden">
                <div className="h-full bg-on-surface-variant/20 w-[25%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="md:col-span-6 neo-card p-6 carved flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Lightbulb size={20} className="text-primary" />
            <h3 className="font-label uppercase tracking-[0.1em] text-[10px] font-semibold text-on-surface-variant">SESSIONS INSIGHTS</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-mid border border-outline-variant">
              <div className="w-1 h-12 bg-primary rounded-full shrink-0" />
              <p className="text-sm text-on-surface leading-relaxed">
                Session efficiency peaks during midday cycles. Consistency remains high.
              </p>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-mid border border-outline-variant">
              <div className="w-1 h-12 bg-secondary rounded-full shrink-0" />
              <p className="text-sm text-on-surface leading-relaxed">
                Current data suggests optimal learning occurs in 18-minute focused intervals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
