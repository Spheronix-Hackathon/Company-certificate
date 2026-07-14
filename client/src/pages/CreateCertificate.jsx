import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CreateCertificate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    regdNo: '',
    email: '',
    phone: '',
    college: '',
    internshipType: 'Short-term',
    programName: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // In a full implementation, you might show a preview step here first
    
    try {
      await api.post('/certificates', formData);
      toast.success('Certificate generated successfully!');
      navigate('/admin/certificates');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Generate Certificate</h1>
          <p className="text-slate-500 dark:text-slate-400">Fill details to generate a verified internship certificate</p>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student Name *</label>
              <input type="text" name="studentName" required value={formData.studentName} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Registration Number *</label>
              <input type="text" name="regdNo" required placeholder="e.g. 23FH1A3220" value={formData.regdNo} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">College/University *</label>
              <input type="text" name="college" required value={formData.college} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Internship Type *</label>
              <input type="text" name="internshipType" required placeholder="e.g. Short-term" value={formData.internshipType} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Program Name *</label>
              <input type="text" name="programName" required placeholder="e.g. AI-INTEGRATED FULL STACK DEVELOPMENT" value={formData.programName} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date *</label>
              <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date *</label>
              <input type="date" name="endDate" required value={formData.endDate} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-colors disabled:opacity-70">
              <Save size={20} />
              {loading ? 'Generating...' : 'Generate Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
