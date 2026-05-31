import React from 'react';
// Ensure ALL these are imported from lucide-react
import { Zap, ShieldCheck, BarChart3, Clock, ArrowUpRight, PlayCircle } from 'lucide-react';

const DashboardHome = () => {
  // Mock data for display
  const stats = [
    { name: 'API Calls', value: '1,284', change: '+12%', icon: <Zap className="text-amber-500" size={20} /> },
    { name: 'Success Rate', value: '99.8%', change: 'Stable', icon: <ShieldCheck className="text-emerald-500" size={20} /> },
    { name: 'Quota Used', value: '42%', change: 'Monthly', icon: <BarChart3 className="text-blue-500" size={20} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome back! 👋</h1>
        <p className="text-slate-500">Here is your PDF generation overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-slate-50 rounded-xl">{stat.icon}</div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-slate-500 text-sm font-medium">{stat.name}</h3>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
        <h3 className="text-2xl font-bold mb-2">Ready to integrate?</h3>
        <p className="text-blue-100 mb-4">Check the API keys section to get started.</p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
          <PlayCircle size={18} /> View Docs
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;