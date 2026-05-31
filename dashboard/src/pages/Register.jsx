import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', terms: false });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms) return setError("Please accept the Terms of Service");
    
    try {
      await api.post('/auth/register', formData);
      navigate('/login'); // Redirect to login after successful signup
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
        <p className="text-slate-500 mb-8 text-sm font-medium">Start generating PDFs in minutes.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
            <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
            <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
            <input type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          
          <div className="flex items-center gap-2">
            <input type="checkbox" id="terms" checked={formData.terms} onChange={(e) => setFormData({...formData, terms: e.target.checked})} />
            <label htmlFor="terms" className="text-sm text-slate-600">I agree to the <span className="text-blue-600">Terms of Service</span></label>
          </div>

          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">Create Account</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="text-blue-600 font-bold">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Register;