import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';

export default function WorkerSaved() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/worker/saved')
      .then((res) => setJobs(safeArray(res)))
      .catch((err) => {
        console.error(err);
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Job Listings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Bookmarked vacancies saved for later application.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading saved jobs...</div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          {safeArray(jobs).length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No saved jobs found.</p>
          ) : (
            <div className="space-y-3">
              {safeArray(jobs).map((j) => (
                <div key={j?.id || Math.random()} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{j?.title || 'Job Listing'}</h3>
                    <p className="text-xs text-slate-500">{j?.Company?.name || 'Company'} • {j?.city || 'India'}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-500">
                    ₹{j?.salaryMin ? j.salaryMin.toLocaleString() : 'Competitive'} / mo
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
