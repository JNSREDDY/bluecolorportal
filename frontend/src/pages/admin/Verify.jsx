import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';

export default function AdminVerify() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = () => {
        setLoading(true);
        api.get('/admin/verification-requests')
            .then((res) => setRequests(safeArray(res)))
            .catch((err) => {
                console.error(err);
                setRequests([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleVerify = async (id, verified) => {
        try {
            await api.put(`/admin/verification-requests/${id}`, { verified });
            fetchRequests();
        } catch {
            alert('Failed to update certificate verification status.');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Certificate Verification Queue</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Review submitted trade certificates and credentials for blue-collar workers.</p>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-400">Loading certificate requests...</div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Worker Name</th>
                                <th className="px-4 py-3">Certificate Title</th>
                                <th className="px-4 py-3">Issuing Org</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {safeArray(requests).length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-slate-400">No pending certificate verification requests.</td>
                                </tr>
                            ) : (
                                safeArray(requests).map((r) => (
                                    <tr key={r?.id || Math.random()} className="hover:bg-slate-800/30">
                                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                                            {r?.Worker?.firstName || 'Worker'} {r?.Worker?.lastName || ''}
                                        </td>
                                        <td className="px-4 py-3 text-amber-400 font-semibold">{r?.title || 'Certificate'}</td>
                                        <td className="px-4 py-3 text-slate-400">{r?.issuingAuthority || 'Govt/ITI'}</td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <button onClick={() => handleVerify(r?.id, true)} className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded text-xs font-semibold">
                                                Approve
                                            </button>
                                            <button onClick={() => handleVerify(r?.id, false)} className="px-2.5 py-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded text-xs font-semibold">
                                                Reject
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
