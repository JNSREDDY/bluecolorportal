import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';
import { FiCheck, FiX, FiShield, FiBriefcase } from 'react-icons/fi';

export default function AdminCompanies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompanies = () => {
        setLoading(true);
        api.get('/admin/companies')
            .then((res) => setCompanies(safeArray(res)))
            .catch((err) => {
                console.error(err);
                setCompanies([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        // Optimistically update UI so change is immediate and crisp
        setCompanies((prev) =>
            safeArray(prev).map((c) => (c.id === id ? { ...c, verificationStatus: newStatus } : c))
        );

        try {
            await api.put(`/admin/companies/${id}/status`, { status: newStatus, verificationStatus: newStatus });
            fetchCompanies();
        } catch (err) {
            console.error(err);
            alert('Failed to update company verification status');
            fetchCompanies();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employer Company Moderation</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Review GST/PAN registrations, approve trusted enterprise accounts, or suspend fraudulent profiles.</p>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-400">Loading company listings...</div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                                <tr>
                                    <th className="px-4 py-3.5">Company Name</th>
                                    <th className="px-4 py-3.5">Industry</th>
                                    <th className="px-4 py-3.5">GST / PAN</th>
                                    <th className="px-4 py-3.5">Verification Status</th>
                                    <th className="px-4 py-3.5 text-right">Moderation Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {safeArray(companies).length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-slate-400">No company accounts found.</td>
                                    </tr>
                                ) : (
                                    safeArray(companies).map((c) => {
                                        const status = (c?.verificationStatus || 'pending').toLowerCase();
                                        const isApproved = status === 'approved';
                                        const isSuspended = status === 'suspended';

                                        return (
                                            <tr key={c?.id || Math.random()} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-4 py-3.5">
                                                    <div className="font-bold text-slate-900 dark:text-white text-base">{c?.name || 'Company'}</div>
                                                    <div className="text-xs text-slate-500">{c?.city || 'N/A'}, {c?.state || ''}</div>
                                                </td>
                                                <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 font-medium">{c?.industry || 'General Industry'}</td>
                                                <td className="px-4 py-3.5 font-mono text-xs text-amber-400 font-semibold">{c?.gst || c?.pan || 'N/A'}</td>
                                                <td className="px-4 py-3.5">
                                                    <span
                                                        className={`text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-wider shadow-sm inline-flex items-center gap-1 ${isApproved
                                                                ? 'bg-emerald-600 text-white border border-emerald-400'
                                                                : isSuspended
                                                                    ? 'bg-rose-600 text-white border border-rose-400'
                                                                    : 'bg-amber-500 text-slate-950 border border-amber-300'
                                                            }`}
                                                    >
                                                        {isApproved && <FiCheck className="stroke-[3]" />}
                                                        {isSuspended && <FiX className="stroke-[3]" />}
                                                        {status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <div className="inline-flex items-center gap-2 justify-end">
                                                        <button
                                                            onClick={() => handleUpdateStatus(c?.id, 'approved')}
                                                            disabled={isApproved}
                                                            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all inline-flex items-center gap-1 shadow-md ${isApproved
                                                                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 cursor-default opacity-80'
                                                                    : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white'
                                                                }`}
                                                        >
                                                            <FiCheck className="text-sm stroke-[3]" />
                                                            {isApproved ? 'Approved ✓' : 'Approve'}
                                                        </button>

                                                        <button
                                                            onClick={() => handleUpdateStatus(c?.id, 'suspended')}
                                                            disabled={isSuspended}
                                                            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all inline-flex items-center gap-1 shadow-md ${isSuspended
                                                                    ? 'bg-rose-600/30 text-rose-300 border border-rose-500/50 cursor-default opacity-80'
                                                                    : 'bg-rose-600 hover:bg-rose-500 active:scale-95 text-white'
                                                                }`}
                                                        >
                                                            <FiX className="text-sm stroke-[3]" />
                                                            {isSuspended ? 'Suspended ✕' : 'Suspend'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
