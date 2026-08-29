import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';

export default function EmployerApplications() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApps = () => {
        setLoading(true);
        api.get('/employer/applications')
            .then((res) => setApps(safeArray(res)))
            .catch((err) => {
                console.error(err);
                setApps([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchApps();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Company Applications Overview</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">View real-time applicant submissions. Sourcing, shortlisting, interviewing, and hiring actions are managed directly by your HR Recruiters in the Recruiter Dashboard.</p>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-400">Loading candidate applications...</div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Candidate</th>
                                <th className="px-4 py-3">Job Applied</th>
                                <th className="px-4 py-3">Trust Score</th>
                                <th className="px-4 py-3">Date Applied</th>
                                <th className="px-4 py-3 text-right">Recruitment Stage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {safeArray(apps).length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-400">No applications received yet.</td>
                                </tr>
                            ) : (
                                safeArray(apps).map((a) => (
                                    <tr key={a?.id || Math.random()} className="hover:bg-slate-800/30">
                                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                            {a?.Worker?.firstName || 'Candidate'} {a?.Worker?.lastName || ''}
                                        </td>
                                        <td className="px-4 py-3 text-amber-400 font-semibold">{a?.Job?.title || 'Job Posting'}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                                {a?.Worker?.trustScore ?? 85} / 100
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-400">
                                            {a?.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Recent'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${
                                                a?.status === 'joined'
                                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                    : a?.status === 'offer_sent'
                                                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                    : a?.status === 'shortlisted'
                                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                            }`}>
                                                {a?.status?.replace('_', ' ') || 'applied'}
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
