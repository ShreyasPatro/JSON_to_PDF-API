import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="text-2xl font-bold text-slate-900">
          PDF<span className="text-blue-600">API</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#pricing" className="hover:text-blue-600">Pricing</a>
          <Link to="/docs" className="hover:text-blue-600">Docs</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-600 font-medium hover:text-slate-900">Sign In</Link>
          <Link to="/login" className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
