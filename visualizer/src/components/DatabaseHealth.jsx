import { Server, Activity, Users } from 'lucide-react';

export default function DatabaseHealth({ telemetry }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-[0_0_15px_rgba(0,128,255,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 bg-neon-blue/10 w-24 h-24 rounded-full blur-2xl -mr-8 -mt-8 transition-opacity opacity-50 group-hover:opacity-100"></div>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-neon-blue/10 rounded-lg">
            <Server className="text-neon-blue w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold tracking-wider font-mono">FACILITIES</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">{telemetry.facilities ?? '--'}</h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Total physical hubs connected via SQLite</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-[0_0_15px_rgba(0,255,102,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 bg-neon-green/10 w-24 h-24 rounded-full blur-2xl -mr-8 -mt-8 transition-opacity opacity-50 group-hover:opacity-100"></div>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-neon-green/10 rounded-lg">
            <Activity className="text-neon-green w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold tracking-wider font-mono">TRACKED ASSETS</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">{telemetry.assets ?? '--'}</h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Active IoT hardware systems monitored</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-[0_0_15px_rgba(255,0,255,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 bg-fuchsia-500/10 w-24 h-24 rounded-full blur-2xl -mr-8 -mt-8 transition-opacity opacity-50 group-hover:opacity-100"></div>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-fuchsia-500/10 rounded-lg">
            <Users className="text-fuchsia-400 w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold tracking-wider font-mono">REGISTERED VENDORS</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">{telemetry.vendors ?? '--'}</h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Techs evaluated for emergency dispatch</p>
          </div>
        </div>
      </div>

    </div>
  );
}
