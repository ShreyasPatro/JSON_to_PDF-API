import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      
      // Use window.location instead of navigate
      window.location.href = '/'; 
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Welcome Back</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
            <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <div className="flex justify-between">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
              <Link to="#" className="text-xs text-blue-600 font-bold hover:underline">Forgot password?</Link>
            </div>
            <input type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">Sign In</button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-600">New to PDF API? <Link to="/register" className="text-blue-600 font-bold">Create an account</Link></p>
      </div>
    </div>
  );
};

export default Login;