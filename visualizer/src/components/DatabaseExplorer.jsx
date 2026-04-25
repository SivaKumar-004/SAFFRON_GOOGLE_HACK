import { useState, useEffect } from 'react';
import { Database, Plus, RefreshCw, Wand2, ShieldAlert } from 'lucide-react';

export default function DatabaseExplorer() {
  const [assets, setAssets] = useState([]);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [isFetching, setIsFetching] = useState(true);

  const fetchAssets = async () => {
    setIsFetching(true);
    try {
      const res = await fetch('/api/assets');
      if (res.ok) {
        setAssets(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch assets", err);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const triggerDiagnostic = async (assetId) => {
    // Optimistic UI loading
    setLoadingIds(prev => new Set(prev).add(assetId));

    try {
      await fetch('/api/assets/report-failure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId })
      });
      // You could refresh assets here if the status changes, but the hackathon 
      // MVP routing engine simply logs the decision right now.
      setTimeout(fetchAssets, 1500); // refresh visually
    } catch (err) {
      console.error("Diagnostic trigger failed", err);
    }

    setLoadingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(assetId);
      return newSet;
    });
  };

  const statusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'text-green-600 bg-green-50 border-green-200';
      case 'WARNING': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'FAILED': return 'text-red-600 bg-red-50 border-red-200';
      case 'MAINTENANCE': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mt-8 overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Database className="text-blue-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="text-gray-900 font-bold text-base">Asset Management Grid</h2>
            <p className="text-xs text-gray-500 font-medium">Live SQLite synchronization. Trigger interactive AI diagnostics.</p>
          </div>
        </div>
        <button 
          onClick={fetchAssets}
          disabled={isFetching}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Asset ID</th>
              <th className="px-6 py-4">Hardware Type</th>
              <th className="px-6 py-4">Facility Location</th>
              <th className="px-6 py-4">Wear Factor</th>
              <th className="px-6 py-4">Live Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assets.length === 0 && !isFetching ? (
              <tr><td colSpan="6" className="text-center py-8 text-gray-400">No assets tracked.</td></tr>
            ) : null}
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-5 font-bold text-gray-900">#{asset.id}</td>
                <td className="px-6 py-5 font-semibold text-gray-700">{asset.type}</td>
                <td className="px-6 py-5 text-gray-500 font-medium">{asset.facility_name}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${asset.usage_pattern_factor > 0.8 ? 'bg-red-500' : 'bg-blue-500'}`} 
                        style={{ width: `${Math.min(100, asset.usage_pattern_factor * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{(asset.usage_pattern_factor * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-widest border ${statusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => triggerDiagnostic(asset.id)}
                    disabled={loadingIds.has(asset.id)}
                    className="inline-flex items-center space-x-1.5 bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loadingIds.has(asset.id) ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    ) : asset.status === 'FAILED' ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5 text-indigo-500" />
                    )}
                    <span>{asset.status === 'FAILED' ? 'Dispatch Emergency' : 'Run Diagnostics'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
