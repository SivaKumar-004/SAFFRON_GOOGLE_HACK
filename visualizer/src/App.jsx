import { useState, useEffect } from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
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

    // Fallback Mock Data generation just in case backend isn't available
    const runFallback = () => {
      if (!telemetry.facilities) {
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
    }

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000); // Poll every 3 seconds
    
    // Clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto selection:bg-blue-100 relative">
      
      {/* Soft background glow */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.4] z-[-1]" 
           style={{ background: 'radial-gradient(circle at 50% 0%, #dbeafe 0%, transparent 50%)' }}>
      </div>

      {/* Modern Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-gray-200">
        <div className="flex items-start space-x-5">
          <div className="p-3.5 bg-white border border-gray-100 shadow-sm rounded-2xl relative mt-1">
            <Activity className="text-blue-600 w-7 h-7" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
              AssetSphere AI
              <span className="text-[10px] px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-bold tracking-widest border border-green-200 uppercase">
                Active System
              </span>
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Smart Asset Intelligence & Lifecycle Management
            </p>
            <p className="text-gray-400 text-sm mt-3 max-w-2xl leading-relaxed">
              This dashboard visualizes the core orchestration engine. It actively monitors incoming IoT device reports, tracks infrastructure health, and intelligently routes maintenance tasks.
            </p>
          </div>
        </div>
        
        <div className="text-right mt-6 md:mt-0 flex flex-col items-end">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
             <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-gray-700 text-sm font-semibold">Engine Online</span>
          </div>
          <p className="text-xs text-gray-400 font-medium mt-3">Last synced: {new Date().toLocaleTimeString()}</p>
        </div>
      </header>

      {/* Grid Layout Row */}
      <DatabaseHealth telemetry={telemetry} />

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
        <AlgorithmicBrain logs={routingLogs} />
      </div>

      {/* SQLite Matrix Mock */}
      <DatabaseExplorer />

    </div>
  )
}

export default App;
