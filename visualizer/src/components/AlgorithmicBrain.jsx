import { Cpu, Terminal } from 'lucide-react';

export default function AlgorithmicBrain({ logs }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl shadow-slate-950 flex flex-col h-[400px]">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Cpu className="text-fuchsia-400 w-5 h-5" />
          <div>
            <h2 className="text-slate-200 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              Algorithmic Brain Console 
              <span className="relative flex h-2 w-2 ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 tracking-wide mt-1">Live autonomous decision engine polling. Watch as IoT failures trigger optimal vendor pair-matching via Fastify core rules.</p>
          </div>
        </div>
        <Terminal className="text-slate-500 w-4 h-4 cursor-pointer hover:text-slate-300 transition-colors" />
      </div>

      {/* Terminal Feed */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#0a0f1d] font-mono text-sm space-y-3">
        {logs.length === 0 ? (
          <div className="text-slate-500 italic mt-4 flex items-center gap-2 opacity-50">
            {'>_'} Waiting for route calculation dispatches from port 3001...
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-slate-300 flex items-start tracking-tight">
                <span className="text-neon-blue/70 mr-3 shrinking-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span>
                  <span className="text-neon-blue font-bold">Asset A-{log.assetId}</span> 
                  <span className="text-slate-400 mx-2">-></span> 
                  Matched with <span className="text-neon-green font-bold">{log.finalSelection}</span>.
                </span>
              </div>
              <div className="text-slate-500 pl-24 text-xs mt-1 border-l-2 border-slate-800 ml-[86px]">
                Reason: {log.reason} [Evaluated Candidates: {log.candidatesEvaluated}]
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
