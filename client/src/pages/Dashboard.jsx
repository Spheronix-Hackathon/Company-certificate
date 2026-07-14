import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Award, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>)}
      </div>
    </div>;
  }

  const statCards = [
    { title: 'Total Certificates', value: stats?.totalCertificates || 0, icon: Award, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Verified', value: stats?.verifiedCount || 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Revoked', value: stats?.revokedCount || 0, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'Generated Today', value: stats?.todayGenerated || 0, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg} ${card.color}`}>
              <card.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Top Colleges</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.topColleges || []}>
                <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {(stats?.topColleges || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981'][index % 3]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Recent Verifications</h3>
          <div className="space-y-4">
            {stats?.recentVerifications?.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">{log.certificateId}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  log.result === 'Verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  log.result === 'Not Found' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {log.result}
                </span>
              </div>
            ))}
            {stats?.recentVerifications?.length === 0 && (
              <p className="text-center text-slate-500 py-4">No recent verifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
