import { useEffect, useState } from 'react';
import { useParams } from 'react';
import api from '../../api/client';
import { safeObject } from '../../utils/safeArray';

export default function WorkerJobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/worker/jobs/${id}`)
      .then((res) => setJob(safeObject(res)))
      .catch((err) => {
        console.error(err);
        setJob({});
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading vacancy details...</div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{job?.title || 'Job Vacancy'}</h1>
          <p className="text-sm font-semibold text-slate-500">{job?.Company?.name || job?.companyName || 'Enterprise Partner'}</p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-300 space-y-2">
            <p><strong>Location:</strong> {job?.city || 'India'}, {job?.state || ''}</p>
            <p><strong>Salary Range:</strong> ₹{job?.salaryMin ? job.salaryMin.toLocaleString() : 'Competitive'} - ₹{job?.salaryMax ? job.salaryMax.toLocaleString() : ''} / month</p>
            <p><strong>Vacancies:</strong> {job?.vacancies ?? 1} Openings</p>
          </div>
          <p className="text-sm text-slate-400">{job?.description || 'No detailed description provided.'}</p>
        </div>
      )}
    </div>
  );
}
