import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeObject, safeArray } from '../../utils/safeArray';
import StatCard from '../../components/StatCard';
import { FiBriefcase, FiUsers, FiFileText, FiCheckCircle } from 'react-icons/fi';

export default function RecruiterHome() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/recruiter/dashboard')
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

    const assignedJobs = data?.assignedJobs ?? data?.totalJobs ?? 0;
    const totalCandidates = data?.totalCandidates ?? data?.applications ?? 0;
    const activePipeline = data?.interviews ?? data?.activePipeline ?? 0;
    const offersCount = data?.offersCount ?? 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recruiter Sourcing Dashboard</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Assigned vacancies, active pipelines, and candidate recommendations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Assigned Jobs" value={assignedJobs} icon={FiBriefcase} color="amber" />
                <StatCard title="Total Applicants" value={totalCandidates} icon={FiUsers} color="blue" />
                <StatCard title="Scheduled Interviews" value={activePipeline} icon={FiFileText} color="emerald" />
                <StatCard title="Offers Issued" value={offersCount} icon={FiCheckCircle} color="rose" />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Active Candidates</h2>
                {safeArray(data?.recentCandidates).length === 0 ? (
                    <p className="text-sm text-slate-500 py-4">No recent candidates found.</p>
                ) : (
                    <div className="space-y-3">
                        {safeArray(data?.recentCandidates).map((c) => (
                            <div key={c?.id || Math.random()} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">{c?.firstName || 'Candidate'} {c?.lastName || ''}</p>
                                    <p className="text-xs text-slate-500">{c?.city || 'India'}</p>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">
                                    Score: {c?.trustScore ?? 80}/100
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
