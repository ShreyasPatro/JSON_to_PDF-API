import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { format, subDays, eachDayOfInterval, startOfDay, isSameDay } from 'date-fns';

const StatsChart = ({ jobs = [] }) => {
  // 1. Create an array for the last 7 days
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  }).map(date => ({
    date: startOfDay(date),
    name: format(date, 'EEE'), // "Mon", "Tue", etc.
    count: 0
  }));

  // 2. Count jobs for each day
  const chartData = last7Days.map(day => {
    const dayCount = jobs.filter(job => 
      isSameDay(new Date(job.createdAt), day.date)
    ).length;
    
    return { ...day, count: dayCount };
  });

  return (
    <div className="h-full bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 tracking-widest">
        7-Day Activity
      </h3>
      
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 11}}
              dy={10}
            />
            <YAxis 
              hide={true} // Cleaner look for sidebars
            />
            <Tooltip 
              cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCount)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
        <span className="text-xs text-gray-400">Total this week</span>
        <span className="text-lg font-bold text-gray-800">
          {chartData.reduce((acc, curr) => acc + curr.count, 0)}
        </span>
      </div>
    </div>
  );
};

export default StatsChart;