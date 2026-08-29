import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';

export default function AdminJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = () => {
        setLoading(true);
        api.get('/admin/jobs')
            .then((res) => setJobs(safeArray(res)))
            .catch((err) => {
                console.error(err);
                setJobs([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleCloseJob = async (id) => {
        try {
            await api.delete(`/admin/jobs/${id}`);
            fetchJobs();
        } catch {
            alert('Failed to remove job posting.');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Job Catalog Moderation</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Monitor all published vacancy listings across the platform.</p>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-400">Loading job postings...</div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Job Title</th>
                                <th className="px-4 py-3">Company</th>
                                <th className="px-4 py-3">Location</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {safeArray(jobs).length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-400">No jobs found in catalog.</td>
                                </tr>
                            ) : (
                                safeArray(jobs).map((j) => (
                                    <tr key={j?.id || Math.random()} className="hover:bg-slate-800/30">
                                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{j?.title || 'Untitled Job'}</td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{j?.Company?.name || j?.companyName || 'Company'}</td>
                                        <td className="px-4 py-3 text-slate-500">{j?.city || 'India'}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                                                {j?.status || 'published'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleCloseJob(j?.id)} className="px-2.5 py-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded text-xs font-semibold">
                                                Delete Listing
                                            </button>
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
