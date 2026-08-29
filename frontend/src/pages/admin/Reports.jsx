import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';

export default function AdminReports() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/audit-logs')
            .then((res) => setLogs(safeArray(res)))
            .catch((err) => {
                console.error(err);
                setLogs([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit & Security Reports</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Track critical actions, administrative changes, and security events.</p>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-400">Loading audit logs...</div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Timestamp</th>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Entity</th>
                                <th className="px-4 py-3">User ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {safeArray(logs).length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-slate-400">No security audit logs found.</td>
                                </tr>
                            ) : (
                                safeArray(logs).map((l) => (
                                    <tr key={l?.id || Math.random()} className="hover:bg-slate-800/30">
                                        <td className="px-4 py-3 text-xs font-mono text-slate-400">
                                            {l?.createdAt ? new Date(l.createdAt).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-amber-400">{l?.action || 'EVENT'}</td>
                                        <td className="px-4 py-3 text-slate-300">{l?.entityType || 'SYSTEM'} #{l?.entityId || ''}</td>
                                        <td className="px-4 py-3 text-xs font-mono text-slate-400">{l?.userId || 'System'}</td>
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
