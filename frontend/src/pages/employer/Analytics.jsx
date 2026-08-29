import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeObject, safeArray } from '../../utils/safeArray';
import StatCard from '../../components/StatCard';
import { FiBriefcase, FiFileText, FiCheckCircle, FiUsers, FiTrendingUp, FiAward } from 'react-icons/fi';

export default function EmployerAnalytics() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/employer/dashboard')
            .then((res) => {
                const raw = safeObject(res);
                setData(raw);
            })
            .catch((err) => {
                console.error(err);
                setData({});
            })
            .finally(() => setLoading(false));
    }, []);

    const stats = data?.stats || {};
    const pipeline = safeArray(data?.pipeline || []);

    const openJobs = stats.openJobs ?? 0;
    const totalApplications = stats.applications ?? 0;
    const hired = stats.employees ?? 0;
    const recruiters = stats.recruiters ?? 0;

    // Calculate pipeline breakdown
    const pipelineMap = {};
    pipeline.forEach((p) => {
      pipelineMap[p.status] = parseInt(p.count) || 0;
    });

    const applied = pipelineMap['applied'] ?? 0;
    const shortlisted = pipelineMap['shortlisted'] ?? 0;
    const interviewed = pipelineMap['interview_scheduled'] ?? pipelineMap['interview_completed'] ?? 0;
    const offerSent = pipelineMap['offer_sent'] ?? 0;
    const joined = pipelineMap['joined'] ?? hired;

    // Calculate rates
    const conversionRate = totalApplications > 0 ? ((hired / totalApplications) * 100).toFixed(1) : 0;
    const interviewRate = totalApplications > 0 ? ((interviewed / totalApplications) * 100).toFixed(1) : 0;
    const offerAcceptRate = offerSent > 0 ? ((hired / offerSent) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Recruitment Performance & Analytics</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track hiring velocity, conversion rates, and applicant funnel metrics in real-time.</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Open Job Vacancies" value={openJobs} icon={FiBriefcase} color="amber" />
                <StatCard title="Total Applications" value={totalApplications} icon={FiFileText} color="blue" />
                <StatCard title="Hired Employees" value={hired} icon={FiCheckCircle} color="emerald" />
                <StatCard title="Active Recruiters" value={recruiters} icon={FiUsers} color="rose" />
                <StatCard title="Overall Conversion Rate" value={`${conversionRate}%`} icon={FiTrendingUp} color="amber" hint="Hired / Total Apps" />
                <StatCard title="Interview Rate" value={`${interviewRate}%`} icon={FiAward} color="blue" hint="Interviewed / Total Apps" />
            </div>

            {/* Pipeline Funnel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Applicant Funnel Breakdown</h2>
                <div className="space-y-4">
                    {/* Applied */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">1. Applications Submitted</span>
                            <span className="text-sm font-bold text-amber-500">{applied} applicants</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    </div>

                    {/* Shortlisted */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">2. Shortlisted Candidates</span>
                            <span className="text-sm font-bold text-blue-500">{shortlisted} applicants {totalApplications > 0 ? `(${((shortlisted / applied) * 100).toFixed(0)}%)` : ''}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${applied > 0 ? (shortlisted / applied) * 100 : 0}%` }}></div>
                        </div>
                    </div>

                    {/* Interviewed */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">3. Interviewed Candidates</span>
                            <span className="text-sm font-bold text-purple-500">{interviewed} applicants {totalApplications > 0 ? `(${interviewRate}%)` : ''}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${interviewed > 0 ? (interviewed / applied) * 100 : 0}%` }}></div>
                        </div>
                    </div>

                    {/* Offers Sent */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">4. Offers Extended</span>
                            <span className="text-sm font-bold text-emerald-500">{offerSent} applicants {totalApplications > 0 ? `(${((offerSent / applied) * 100).toFixed(0)}%)` : ''}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${offerSent > 0 ? (offerSent / applied) * 100 : 0}%` }}></div>
                        </div>
                    </div>

                    {/* Hired */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">5. Hired & Joined</span>
                            <span className="text-sm font-bold text-rose-500">{hired} employees {totalApplications > 0 ? `(${conversionRate}%)` : ''}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                            <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${hired > 0 ? (hired / applied) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conversion Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase text-slate-500 mb-2">Interview to Hire Rate</p>
                    <p className="text-3xl font-bold text-purple-500">{interviewed > 0 ? `${((hired / interviewed) * 100).toFixed(1)}%` : '0%'}</p>
                    <p className="text-xs text-slate-400 mt-2">{hired} hired from {interviewed} interviews</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase text-slate-500 mb-2">Offer Acceptance Rate</p>
                    <p className="text-3xl font-bold text-emerald-500">{offerAcceptRate}%</p>
                    <p className="text-xs text-slate-400 mt-2">{hired} accepted from {offerSent} offers</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase text-slate-500 mb-2">Applications per Job</p>
                    <p className="text-3xl font-bold text-blue-500">{openJobs > 0 ? (totalApplications / openJobs).toFixed(1) : 0}</p>
                    <p className="text-xs text-slate-400 mt-2">Avg applications per opening</p>
                </div>
            </div>

            {/* Status Summary Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 text-right">Count</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 text-right">% of Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {pipeline.length > 0 ? (
                            pipeline.map((p) => {
                                const count = parseInt(p.count) || 0;
                                const percent = totalApplications > 0 ? ((count / totalApplications) * 100).toFixed(1) : 0;
                                return (
                                    <tr key={p.status} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-3 font-medium text-slate-900 dark:text-white capitalize">{p.status.replace(/_/g, ' ')}</td>
                                        <td className="px-6 py-3 text-right text-slate-600 dark:text-slate-300 font-semibold">{count}</td>
                                        <td className="px-6 py-3 text-right text-slate-600 dark:text-slate-300">{percent}%</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center text-slate-500">No applications data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
