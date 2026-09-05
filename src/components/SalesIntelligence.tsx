import React from 'react';
import { SalesSummary } from '../types';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Percent, AlertCircle, BarChart3, ExternalLink, Cpu, Radio, Activity, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { SpectraAnalyticsSynthAvatar } from './SpectraAnalyticsSynthAvatar';

interface SalesIntelligenceProps {
  summary: SalesSummary;
  onInvestigateAnomaly: () => void;
}

export const SalesIntelligence: React.FC<SalesIntelligenceProps> = ({
  summary,
  onInvestigateAnomaly
}) => {
  return (
    <div id="sales-intelligence-card" className="bg-[#050b14] border border-cyan-950 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full robotic-panel">
      {/* High-Tech Header with Spectra Analytics Synth Avatar */}
      <div className="px-4 py-3 border-b border-cyan-950/80 bg-gradient-to-r from-[#18092a] via-[#10061d] to-[#040412] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <SpectraAnalyticsSynthAvatar className="w-11 h-11 ring-1 ring-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-purple-400 border border-slate-950 animate-ping" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-purple-400 border border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs font-cyber font-bold tracking-wider text-purple-200 uppercase flex items-center gap-1.5">
                SPECTRA-09 <span className="text-[10px] font-tech text-purple-400 bg-purple-950/90 px-1.5 py-0.5 rounded border border-purple-500/30">REVENUE SYNTH</span>
              </h2>
              <span className="text-[10px] font-tech px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                RADAR: 100% ONLINE
              </span>
            </div>
            <p className="text-[11px] font-tech text-slate-400">
              Autonomous run-rate telemetry, sector velocity curves & competitor margin anomalies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-tech text-[10px]">
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-1 rounded border border-purple-900/60 text-purple-300">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>PRICING ENGINE: ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-robotic-grid">
        {/* KPI Mini Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-tech">
          <div className="bg-[#081220]/90 border border-cyan-950 p-3 rounded-lg shadow-sm">
            <span className="text-[10px] text-cyan-400/80 uppercase tracking-wider block mb-0.5 font-cyber">
              GROSS REVENUE
            </span>
            <div className="text-lg font-bold text-cyan-100 font-cyber">
              ${summary.grossSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-emerald-400">
              +8.4% vs 7d loop
            </span>
          </div>

          <div className="bg-[#081220]/90 border border-cyan-950 p-3 rounded-lg shadow-sm">
            <span className="text-[10px] text-cyan-400/80 uppercase tracking-wider block mb-0.5 font-cyber">
              TRANSACTION FLOW
            </span>
            <div className="text-lg font-bold text-cyan-100 font-cyber">
              {summary.orderCount} UNITS
            </div>
            <span className="text-[10px] text-slate-400">
              Avg 11.5 orders/hr
            </span>
          </div>

          <div className="bg-[#081220]/90 border border-cyan-950 p-3 rounded-lg shadow-sm">
            <span className="text-[10px] text-cyan-400/80 uppercase tracking-wider block mb-0.5 font-cyber">
              AOV CALIBRATION
            </span>
            <div className="text-lg font-bold text-cyan-100 font-cyber">
              ${summary.aov.toFixed(2)}
            </div>
            <span className="text-[10px] text-emerald-400">
              +8.7% ABOVE TARGET
            </span>
          </div>

          <div className="bg-[#081220]/90 border border-cyan-950 p-3 rounded-lg shadow-sm">
            <span className="text-[10px] text-cyan-400/80 uppercase tracking-wider block mb-0.5 font-cyber">
              CONVERSION INDEX
            </span>
            <div className="text-lg font-bold text-cyan-100 font-cyber">
              {summary.conversionRate}%
            </div>
            <span className="text-[10px] text-slate-400">
              4,035 sessions logged
            </span>
          </div>
        </div>

        {/* Top Performer & Lagging Sector Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-tech">
          {/* Top Performer */}
          <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-cyber font-bold text-emerald-300 flex items-center gap-1.5 uppercase">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                PEAK PERFORMER SENSOR
              </span>
              <span className="text-xs text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-500/30">
                {summary.topPerformer.sku}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-100 mb-1 font-sans">
              {summary.topPerformer.name}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span>UNITS: <strong className="text-emerald-300">{summary.topPerformer.unitsSold}</strong></span>
              <span>GROSS: <strong className="text-emerald-300">${summary.topPerformer.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
            </div>
          </div>

          {/* Lagging Sector */}
          <div className="p-3.5 rounded-lg border border-red-500/30 bg-red-950/20 shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-cyber font-bold text-red-300 flex items-center gap-1.5 uppercase">
                <TrendingDown className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                LAGGING ANOMALY DETECTED
              </span>
              <span className="text-xs text-red-300 font-bold bg-red-950 px-1.5 py-0.2 rounded border border-red-500/40 animate-pulse">
                {summary.laggingSector.changePctVs7Day}% vs 7d avg
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-100 mb-1 font-sans">
              {summary.laggingSector.category}
            </div>
            <p className="text-xs text-slate-400 leading-snug mb-2 font-sans">
              {summary.laggingSector.note}
            </p>
            <button
              onClick={onInvestigateAnomaly}
              className="text-[11px] text-red-300 hover:text-red-200 flex items-center gap-1 underline underline-offset-2 font-tech"
            >
              [EXECUTE DEEP DIVE ON PRICE PARITY & SOURCING] →
            </button>
          </div>
        </div>

        {/* Hourly Velocity Chart */}
        <div className="p-3.5 rounded-lg border border-cyan-950 bg-[#081220]/90 font-tech">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-cyber uppercase tracking-wider text-cyan-200 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              HOURLY REVENUE RUN-RATE TELEMETRY ($)
            </span>
            <span className="text-[11px] text-cyan-400/80">
              Peak: 10:00 ($2,420 / 23 units)
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.hourlySales} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#0891b2" fontSize={10} tickLine={false} />
                <YAxis stroke="#0891b2" fontSize={10} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#050b14', borderColor: '#0891b2', borderRadius: '8px', fontSize: '11px', fontFamily: 'Share Tech Mono' }}
                  formatter={(value: any) => [`$${value}`, 'Gross Output']}
                />
                <Area type="monotone" dataKey="sales" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="p-3.5 rounded-lg border border-cyan-950 bg-[#081220]/90 font-tech">
          <span className="text-xs font-cyber uppercase tracking-wider text-cyan-200 font-bold block mb-2.5">
            CATEGORY SECTOR MATRIX & EXPANSION DELTAS
          </span>
          <div className="space-y-2">
            {summary.categoryBreakdown.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between text-xs py-1 border-b border-cyan-950/60 last:border-0">
                <span className="text-slate-300 font-sans">{cat.category}</span>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400">{cat.unitsSold} units</span>
                  <span className="text-cyan-200 font-bold">${cat.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <span className={`w-14 text-right font-bold ${cat.growthPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {cat.growthPct >= 0 ? `+${cat.growthPct}%` : `${cat.growthPct}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

