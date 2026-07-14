import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CertificateList from './pages/CertificateList';
import CreateCertificate from './pages/CreateCertificate';
import VerificationPage from './pages/VerificationPage';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        className: 'dark:bg-slate-800 dark:text-white',
        style: {
          borderRadius: '12px',
          background: '#fff',
          color: '#333',
        }
      }} />
      <Routes>
        {/* Public Routes */}
        <Route path="/verify/:id" element={<VerificationPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="certificates" element={<CertificateList />} />
          <Route path="certificates/new" element={<CreateCertificate />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Redirect Root */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <h1 className="text-6xl font-bold text-slate-800 dark:text-white mb-4">404</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Page Not Found</p>
            <a href="/" className="px-6 py-3 bg-primary-600 text-white rounded-xl">Go Home</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
