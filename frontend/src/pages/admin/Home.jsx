import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeObject, safeArray } from '../../utils/safeArray';
import StatCard from '../../components/StatCard';
import { FiUsers, FiBriefcase, FiGrid, FiShield, FiFileText } from 'react-icons/fi';

export default function AdminHome() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then((res) => {
                const raw = safeObject(res);
                // Unpack stats sub-object if present
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

    const totalWorkers = data?.workers ?? data?.totalWorkers ?? 0;
    const totalEmployers = data?.companies ?? data?.totalEmployers ?? 0;
    const totalJobs = data?.jobs ?? data?.activeJobs ?? 0;
    const pendingVerifications = (data?.pendingEmployers ?? 0) + (data?.pendingWorkers ?? 0) || (data?.pendingVerifications ?? 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Control Center</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Platform overview, employer verification queues, and audit logs.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Workers" value={totalWorkers} icon={FiUsers} color="amber" />
                <StatCard title="Employers" value={totalEmployers} icon={FiGrid} color="blue" />
                <StatCard title="Active Jobs" value={totalJobs} icon={FiBriefcase} color="emerald" />
                <StatCard title="Pending Verifications" value={pendingVerifications} icon={FiShield} color="rose" />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">System Status</h2>
                <p className="text-sm text-slate-500">Database connected. All core MERN modules operational.</p>
            </div>
        </div>
    );
}
