import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardHome from './pages/DashboardHome';
import DashboardLayout from './components/DashboardLayout';
import TemplateEditor from './pages/TemplateEditor';

// 1. ProtectedRoute: For internal pages
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

// 2. PublicRoute: Redirects logged-in users away from Login/Register
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes - Wrapped in PublicRoute to prevent re-login */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        } />
        
        <Route path="/templates" element={
          <ProtectedRoute>
            <TemplateEditor />
          </ProtectedRoute>
        } />

        {/* Catch-all: Redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;