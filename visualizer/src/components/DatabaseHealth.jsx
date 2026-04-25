import { Building2, Laptop, Users } from 'lucide-react';

export default function DatabaseHealth({ telemetry }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      
      {/* Card 1: Facilities */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">Facilities</p>
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{telemetry.facilities ?? '--'}</h3>
          </div>
          <div className="p-4 bg-blue-50/80 rounded-2xl">
            <Building2 className="text-blue-600 w-8 h-8" strokeWidth={1.5} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4 font-medium flex items-center">
           Total physical hubs connected and monitored
        </p>
      </div>

      {/* Card 2: Tracked Assets */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">Tracked Assets</p>
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{telemetry.assets ?? '--'}</h3>
          </div>
          <div className="p-4 bg-emerald-50/80 rounded-2xl">
            <Laptop className="text-emerald-600 w-8 h-8" strokeWidth={1.5} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4 font-medium flex items-center">
           Active hardware systems indexed in database
        </p>
      </div>

      {/* Card 3: Registered Vendors */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">Registered Vendors</p>
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{telemetry.vendors ?? '--'}</h3>
          </div>
          <div className="p-4 bg-indigo-50/80 rounded-2xl">
            <Users className="text-indigo-600 w-8 h-8" strokeWidth={1.5} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4 font-medium flex items-center">
           Technicians evaluated for emergency dispatch
        </p>
      </div>

    </div>
  );
}
