import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';
import { FiPlus, FiX, FiUserPlus, FiCopy, FiCheck } from 'react-icons/fi';

export default function EmployerRecruiters() {
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [invitedResult, setInvitedResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        designation: 'Senior Talent Scout',
    });

    const fetchRecruiters = () => {
        setLoading(true);
        api.get('/employer/recruiters')
            .then((res) => setRecruiters(safeArray(res)))
            .catch((err) => {
                console.error(err);
                setRecruiters([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRecruiters();
    }, []);

    const handleInvite = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setInvitedResult(null);
        try {
            const res = await api.post('/employer/recruiters/invite', formData);
            setInvitedResult(res);
            setFormData({
                fullName: '',
                email: '',
                password: '',
                phone: '',
                designation: 'Senior Talent Scout',
            });
            fetchRecruiters();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to create recruiter account.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'deactivated' ? 'active' : 'deactivated';
        try {
            await api.patch(`/employer/recruiters/${id}`, { status: nextStatus });
            fetchRecruiters();
        } catch {
            alert('Failed to update recruiter status.');
        }
    };

    const copyTempPassword = () => {
        if (invitedResult?.temporaryPassword) {
            navigator.clipboard.writeText(invitedResult.temporaryPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Enterprise Recruiter Team</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage internal HR recruiters assigned to sourcing and screening candidates.</p>
                </div>
                <button
                    onClick={() => {
                        setInvitedResult(null);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-all"
                >
                    <FiPlus className="text-lg" /> Create Recruiter
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-400">Loading recruiter team...</div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Recruiter Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Designation</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {safeArray(recruiters).length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-400">No recruiters added yet. Click "Create Recruiter" above to add one.</td>
                                </tr>
                            ) : (
                                safeArray(recruiters).map((r) => (
                                    <tr key={r?.id || Math.random()} className="hover:bg-slate-800/30">
                                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{r?.fullName || r?.name || 'HR Recruiter'}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-amber-400">{r?.User?.email || r?.email || 'N/A'}</td>
                                        <td className="px-4 py-3 text-slate-400">{r?.designation || 'Recruiter'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                                                r?.status === 'deactivated'
                                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            }`}>
                                                {r?.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleStatusToggle(r?.id, r?.status)}
                                                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                                                    r?.status === 'deactivated'
                                                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                        : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                                                }`}
                                            >
                                                {r?.status === 'deactivated' ? 'Activate' : 'Deactivate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Recruiter Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <FiUserPlus className="text-emerald-400" /> Create Recruiter Account
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        {invitedResult ? (
                            <div className="space-y-4 text-center py-2">
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2">
                                    <p className="font-bold text-base">Recruiter Account Created!</p>
                                    <p className="text-xs text-slate-300">The recruiter can log in immediately with these credentials:</p>
                                </div>
                                <div className="p-3 bg-slate-950 rounded-xl text-left border border-slate-800 space-y-2 font-mono text-xs">
                                    <p><span className="text-slate-500">Email:</span> <span className="text-amber-400 font-bold">{invitedResult.user?.email}</span></p>
                                    <div className="flex items-center justify-between">
                                        <p><span className="text-slate-500">Password:</span> <span className="text-emerald-400 font-bold">{invitedResult.temporaryPassword}</span></p>
                                        <button onClick={copyTempPassword} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                                            {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setInvitedResult(null)}
                                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs"
                                >
                                    Create Another Recruiter
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleInvite} className="space-y-4 text-sm text-slate-300">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="e.g. Ramesh Kumar"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="recruiter@company.com"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Account Password (Optional - defaults to Recruiter@123)</label>
                                    <input
                                        type="text"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="e.g. Pass123!"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 9876543210"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Designation</label>
                                    <input
                                        type="text"
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        placeholder="e.g. HR Recruiter, Lead Hiring Specialist"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                                    >
                                        {submitting ? 'Creating...' : 'Create Recruiter Account'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

