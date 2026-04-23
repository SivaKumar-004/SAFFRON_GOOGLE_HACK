import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import DatabaseHealth from './components/DatabaseHealth';
import AlgorithmicBrain from './components/AlgorithmicBrain';
import DatabaseExplorer from './components/DatabaseExplorer';

function App() {
  const [telemetry, setTelemetry] = useState({});
  const [routingLogs, setRoutingLogs] = useState([]);

  useEffect(() => {
    // Polling function
    const fetchTelemetry = async () => {
      try {
        // Since we proxy `/api` via Vite to port 3001, we just call it directly!
        const dbRes = await fetch('/api/telemetry/database');
        if(dbRes.ok) setTelemetry(await dbRes.json());
      } catch (err) {
        console.error("Failed to fetch database telemetry:", err);
      }

      try {
        const logRes = await fetch('/api/telemetry/routing');
        if(logRes.ok) setRoutingLogs(await logRes.json());
      } catch (err) {
        console.error("Failed to fetch routing logs:", err);
      }
    };

    // Fallback Mock Data generation just in case backend isn't patched yet during hackathon
    // To prove out the UI
    const runFallback = () => {
      setTelemetry({ facilities: 2, assets: 4, vendors: 4 });
      setRoutingLogs([
        {
          timestamp: new Date().toISOString(),
          assetId: 1,
          candidatesEvaluated: 2,
          finalSelection: "FixIt Corp",
          reason: "Highest reliability (0.88) + Proximity fusion score."
        }
      ]);
    }

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000); // Poll every 3 seconds
    
    // Clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto selection:bg-neon-blue/30 relative">
      
      {/* Ghost Grids Background via pure tailwind utilities (modern aesthetic) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Mainframe Header */}
      <header className="mb-10 flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-neon-blue blur-md opacity-40 rounded-full"></div>
            <div className="p-3 bg-slate-900 border border-neon-blue/50 rounded-xl relative">
              <Layers className="text-neon-blue w-6 h-6" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
              Device 1 
              <span className="text-xs px-2 py-1 bg-neon-blue/10 text-neon-blue rounded font-mono font-bold tracking-widest">ACTIVE</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Orchestration Core & Database Hub</p>
            <p className="text-slate-500 text-xs mt-2 font-mono max-w-xl">
              [WHAT YOU ARE SEEING]: This dashboard visualizes the CLEAR-3 headless microservice. It actively intercepts incoming IoT device failure reports and utilizes an autonomous algorithm to evaluate SQLite data, mapping the optimal repair vendor based on proximity and reliability. 
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-mono text-neon-green text-sm flex justify-end items-center mb-1">
            <div className="w-2 h-2 rounded-full bg-neon-green mr-2 animate-pulse"></div>
            SYSTEM SECURE
          </div>
          <p className="text-xs text-slate-500 font-mono">Last Sync: {new Date().toLocaleTimeString()}</p>
        </div>
      </header>

      {/* Grid Layout Row */}
      <DatabaseHealth telemetry={telemetry} />

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <AlgorithmicBrain logs={routingLogs} />
      </div>

      {/* SQLite Matrix Mock */}
      <DatabaseExplorer />

    </div>
  )
}

export default App;
