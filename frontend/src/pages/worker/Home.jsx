import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeObject, safeArray } from '../../utils/safeArray';
import StatCard from '../../components/StatCard';
import { FiBriefcase, FiFileText, FiCheckCircle, FiShield } from 'react-icons/fi';

export default function WorkerHome() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/worker/dashboard')
      .then((res) => {
        const raw = safeObject(res);
        const statsObj = raw.stats || raw;
        setData({
          ...raw,
          ...statsObj,
        });
      })
      .catch((err) => {
        console.error(err);
        setData({});
      })
      .finally(() => setLoading(false));
  }, []);

  const appliedCount = data?.applications ?? data?.appliedCount ?? 0;
  const interviewsCount = safeArray(data?.interviews).length || (data?.interviewsCount ?? 0);
  const trustScore = data?.trustScore ?? data?.worker?.trustScore ?? 85;
  const savedCount = data?.saved ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Worker Digital Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track job applications, digital identity score, and interview schedules.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Applied Jobs" value={appliedCount} icon={FiFileText} color="amber" />
        <StatCard title="Interviews" value={interviewsCount} icon={FiCheckCircle} color="blue" />
        <StatCard title="Saved Jobs" value={savedCount} icon={FiBriefcase} color="emerald" />
        <StatCard title="Trust Score" value={`${trustScore}/100`} icon={FiShield} color="rose" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Recommended Jobs for Your Trade</h2>
        {safeArray(data?.recommendedJobs).length === 0 ? (
          <p className="text-sm text-slate-500 py-4">No recommended jobs available right now.</p>
        ) : (
          <div className="space-y-3">
            {safeArray(data?.recommendedJobs).map((job) => (
              <div key={job?.id || Math.random()} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{job?.title || 'Job Posting'}</p>
                  <p className="text-xs text-slate-500">{job?.Company?.name || job?.companyName || 'Company'} • {job?.city || 'India'}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  ₹{job?.salaryMin ? `${job.salaryMin.toLocaleString()} - ₹${job.salaryMax ? job.salaryMax.toLocaleString() : ''}` : 'Competitive'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
