import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';

export default function WorkerApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/worker/applications')
      .then((res) => setApps(safeArray(res)))
      .catch((err) => {
        console.error(err);
        setApps([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Job Applications</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track real-time status updates on submitted job applications.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading submitted applications...</div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Job Applied</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Date Applied</th>
                <th className="px-4 py-3">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {safeArray(apps).length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-400">You have not submitted any job applications yet.</td>
                </tr>
              ) : (
                safeArray(apps).map((a) => (
                  <tr key={a?.id || Math.random()} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{a?.Job?.title || 'Job Posting'}</td>
                    <td className="px-4 py-3 text-slate-400">{a?.Job?.Company?.name || 'Company'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                      {a?.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20 capitalize">
                        {a?.status || 'applied'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
