import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        setLoading(true);
        api.get('/admin/users')
            .then((res) => setUsers(safeArray(res)))
            .catch((err) => {
                console.error(err);
                setUsers([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleActive = async (id, currentActive) => {
        try {
            await api.patch(`/admin/users/${id}`, { isActive: !currentActive });
            fetchUsers();
        } catch {
            alert('Failed to update user account status.');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform User Directory</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">View and manage all platform accounts across roles.</p>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-400">Loading user accounts...</div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {safeArray(users).length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-slate-400">No users found.</td>
                                </tr>
                            ) : (
                                safeArray(users).map((u) => (
                                    <tr key={u?.id || Math.random()} className="hover:bg-slate-800/30">
                                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{u?.email || 'N/A'}</td>
                                        <td className="px-4 py-3 capitalize">
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                                                {u?.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${u?.isActive !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                                }`}>
                                                {u?.isActive !== false ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => toggleActive(u?.id, u?.isActive !== false)}
                                                className={`px-2.5 py-1 rounded text-xs font-semibold ${u?.isActive !== false
                                                        ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                                                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                    }`}
                                            >
                                                {u?.isActive !== false ? 'Disable' : 'Enable'}
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
