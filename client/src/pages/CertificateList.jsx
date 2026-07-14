import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MoreVertical, FileText, XCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CertificateList() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCertificates = async () => {
    try {
      const res = await api.get(`/certificates?search=${search}`);
      setCertificates(res.data.data);
    } catch (error) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCertificates();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleRevoke = async (id) => {
    if (window.confirm('Are you sure you want to revoke this certificate?')) {
      try {
        await api.post(`/certificates/${id}/revoke`);
        toast.success('Certificate revoked');
        fetchCertificates();
      } catch (error) {
        toast.error('Failed to revoke');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Certificates</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage all generated internship certificates</p>
        </div>
        <Link 
          to="/admin/certificates/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-primary-500/30"
        >
          <Plus size={20} /> Generate New
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, ID or college..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium border-b border-slate-200 dark:border-slate-700">Certificate ID</th>
                <th className="px-6 py-4 font-medium border-b border-slate-200 dark:border-slate-700">Student Name</th>
                <th className="px-6 py-4 font-medium border-b border-slate-200 dark:border-slate-700">College</th>
                <th className="px-6 py-4 font-medium border-b border-slate-200 dark:border-slate-700">Status</th>
                <th className="px-6 py-4 font-medium border-b border-slate-200 dark:border-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">Loading certificates...</td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">No certificates found.</td>
                </tr>
              ) : (
                certificates.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-slate-700 dark:text-slate-300">{cert.certificateId}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{cert.studentName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{cert.college}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cert.status === 'Verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        cert.status === 'Revoked' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <a href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/${cert.pdfPath}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="View PDF">
                          <FileText size={20} />
                        </a>
                        {cert.status === 'Verified' && (
                          <button onClick={() => handleRevoke(cert._id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Revoke">
                            <XCircle size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
