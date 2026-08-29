import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';

export default function WorkerInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/worker/interviews')
      .then((res) => setInterviews(safeArray(res)))
      .catch((err) => {
        console.error(err);
        setInterviews([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Scheduled Job Interviews</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">View upcoming in-person or virtual interview details.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading interview schedules...</div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          {safeArray(interviews).length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No interviews scheduled at this time.</p>
          ) : (
            <div className="space-y-3">
              {safeArray(interviews).map((i) => (
                <div key={i?.id || Math.random()} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{i?.Application?.Job?.title || 'Job Interview'}</h3>
                    <p className="text-xs text-slate-500">{i?.location || 'Virtual / Work Site'}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                    {i?.scheduledAt ? new Date(i.scheduledAt).toLocaleString() : 'Scheduled'}
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
