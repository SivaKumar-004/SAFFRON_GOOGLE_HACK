import { Database } from 'lucide-react';

export default function DatabaseExplorer() {
  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden mt-8">
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center space-x-3">
        <Database className="text-neon-blue w-5 h-5" />
        <h2 className="text-slate-200 font-bold uppercase tracking-wider text-sm">Database Explorer / SQLite Matrix</h2>
      </div>

      <div className="p-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400 font-mono">
          <thead className="bg-slate-800/50 text-slate-300 text-xs uppercase cursor-default">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg border-b border-slate-700">Tbl Space</th>
              <th className="px-4 py-3 border-b border-slate-700">Rows</th>
              <th className="px-4 py-3 border-b border-slate-700">WAL Sync</th>
              <th className="px-4 py-3 rounded-tr-lg rounded-br-lg border-b border-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="px-4 py-3 flex flex-col font-semibold text-slate-200">
                Facilities 
                <span className="text-[10px] text-slate-500 font-sans font-normal uppercase">location_x, location_y</span>
              </td>
              <td className="px-4 py-3">Auto</td>
              <td className="px-4 py-3 text-neon-green">ACTIVE</td>
              <td className="px-4 py-3"><span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700/50">LOCKED</span></td>
            </tr>
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="px-4 py-3 flex flex-col font-semibold text-slate-200">
                Assets
                <span className="text-[10px] text-slate-500 font-sans font-normal uppercase">type, status, usage_pattern...</span>
              </td>
              <td className="px-4 py-3">Auto</td>
              <td className="px-4 py-3 text-neon-green">ACTIVE</td>
              <td className="px-4 py-3"><span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700/50">LOCKED</span></td>
            </tr>
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="px-4 py-3 flex flex-col font-semibold text-slate-200">
                Vendors
                <span className="text-[10px] text-slate-500 font-sans font-normal uppercase">capability, reliability_score..</span>
              </td>
              <td className="px-4 py-3">Auto</td>
              <td className="px-4 py-3 text-neon-green">ACTIVE</td>
              <td className="px-4 py-3"><span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700/50">LOCKED</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
