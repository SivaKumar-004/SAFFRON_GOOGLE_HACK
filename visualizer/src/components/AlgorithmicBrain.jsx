import { BrainCircuit, CheckCircle2, Navigation, Clock } from 'lucide-react';

export default function AlgorithmicBrain({ logs }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col h-[420px] overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-50 p-2 rounded-lg">
            <BrainCircuit className="text-indigo-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="text-gray-900 font-bold text-base flex items-center gap-2">
              Decision Engine Log
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Live tracking of AI-driven optimal vendor dispatch routes.
            </p>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-4">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Clock className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-sm font-medium">Awaiting failure reports or maintenance triggers...</p>
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow relative">
              <div className="flex items-start">
                <div className="bg-green-50 p-2 rounded-full mr-4 shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-gray-900 font-semibold text-sm">
                      Dispatch Assigned for Asset <span className="text-blue-600">#{log.assetId}</span>
                    </h4>
                    <span className="text-[11px] font-medium text-gray-400 px-2 py-0.5 bg-gray-100 rounded-md">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-1.5 font-medium mt-2">
                    <Navigation className="w-4 h-4 text-gray-400" />
                    Matched with <strong className="text-gray-900 font-bold">{log.finalSelection}</strong>
                  </p>
                  <div className="mt-3 bg-gray-50 border border-gray-100 rounded-lg p-3">
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      <span className="text-gray-700 font-semibold border-b border-gray-200 pb-0.5">Reasoning:</span> {log.reason}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-wider">
                      Vendors Evaluated: <span className="text-gray-600">{log.candidatesEvaluated} candidates</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
