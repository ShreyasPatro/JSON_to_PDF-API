import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileCode, Key, BookOpen, 
  BarChart3, Settings, LogOut, User, Bell, Menu, X 
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Templates', icon: <FileCode size={20} />, path: '/templates' },
    { name: 'API Keys', icon: <Key size={20} />, path: '/api-keys' },
    { name: 'Documentation', icon: <BookOpen size={20} />, path: '/docs' },
    { name: 'Usage', icon: <BarChart3 size={20} />, path: '/usage' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          
          {isSidebarOpen && <span className="ml-3 font-bold text-xl text-slate-800">PDFAPI</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-3 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:bg-slate-100 p-2 rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">Shrey</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Pro Plan</p>
              </div>
              <div className="h-10 w-10 bg-slate-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-slate-500">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;