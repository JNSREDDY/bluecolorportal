import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { safeObject, safeArray } from '../../utils/safeArray';
import StatCard from '../../components/StatCard';
import { FiBriefcase, FiUsers, FiFileText, FiCheckCircle, FiPlus } from 'react-icons/fi';

export default function EmployerHome() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/employer/dashboard')
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

    const openJobs = data?.openJobs ?? data?.activeJobs ?? data?.totalJobs ?? 0;
    const applications = data?.applications ?? data?.totalApplications ?? 0;
    const recruiters = data?.recruiters ?? data?.totalRecruiters ?? 0;
    const employees = data?.employees ?? data?.shortlistedCount ?? 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employer Hiring Control Center</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage job postings, applicant pipelines, and HR recruiters.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/employer/recruiters"
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 font-bold rounded-xl text-xs transition-all"
                    >
                        <FiPlus /> Add Recruiter
                    </Link>
                    <Link
                        to="/employer/jobs"
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                    >
                        <FiPlus /> Post New Job
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Active Vacancies" value={openJobs} icon={FiBriefcase} color="amber" />
                <StatCard title="Total Applications" value={applications} icon={FiFileText} color="blue" />
                <StatCard title="Team Recruiters" value={recruiters} icon={FiUsers} color="emerald" />
                <StatCard title="Hired Employees" value={employees} icon={FiCheckCircle} color="rose" />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Recent Applications</h2>
                {safeArray(data?.recentApplications).length === 0 ? (
                    <p className="text-sm text-slate-500 py-4">No recent applications found.</p>
                ) : (
                    <div className="space-y-3">
                        {safeArray(data?.recentApplications).map((app) => (
                            <div key={app?.id || Math.random()} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">{app?.Worker?.firstName || 'Worker'} {app?.Worker?.lastName || ''}</p>
                                    <p className="text-xs text-slate-500">{app?.Job?.title || 'Job'}</p>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">
                                    {app?.status || 'applied'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
