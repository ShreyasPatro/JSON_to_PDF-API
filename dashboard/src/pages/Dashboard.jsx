import { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, Layout } from 'lucide-react';
import api from '../api/client';
import StatsChart from '../components/StatsChart'; 

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs'); 
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
        <p className="text-sm text-gray-500">Welcome back to your workspace</p>
      </div>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FileText /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Generated</p>
            <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Successful</p>
            <p className="text-2xl font-bold text-gray-900">{jobs.filter(j => j.status === 'completed').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Clock /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Pending/Active</p>
            <p className="text-2xl font-bold text-gray-900">{jobs.filter(j => j.status === 'pending').length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table - Spans 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 font-bold text-gray-800 flex items-center gap-2">
            <Layout size={18} className="text-blue-600" /> Recent Generations
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">Job ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobs.length > 0 ? jobs.slice(0, 8).map(job => (
                  <tr key={job.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-blue-600">#{job.id.slice(0, 8)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        job.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">No generations yet. Create your first PDF to see data!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Side - Spans 1 column */}
        <div className="lg:col-span-1">
          <StatsChart jobs={jobs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;