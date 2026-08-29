import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';
import { FiCalendar, FiSend, FiX, FiCheckCircle } from 'react-icons/fi';

export default function RecruiterPipeline() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Interview Modal state
    const [interviewApp, setInterviewApp] = useState(null);
    const [interviewData, setInterviewData] = useState({
        scheduledAt: '',
        mode: 'in_person',
        location: '',
        notes: '',
    });
    const [scheduling, setScheduling] = useState(false);

    // Offer Modal state
    const [offerApp, setOfferApp] = useState(null);
    const [offerData, setOfferData] = useState({
        salary: '',
        joiningDate: '',
        terms: '',
    });
    const [sendingOffer, setSendingOffer] = useState(false);

    const fetchApps = () => {
        setLoading(true);
        api.get('/recruiter/applications')
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

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/recruiter/applications/${id}/status`, { status });
            fetchApps();
        } catch {
            alert('Failed to update candidate application status.');
        }
    };

    const handleScheduleInterview = async (e) => {
        e.preventDefault();
        if (!interviewApp) return;
        setScheduling(true);
        try {
            await api.post(`/recruiter/applications/${interviewApp.id}/interview`, interviewData);
            setInterviewApp(null);
            alert('Interview scheduled successfully!');
            fetchApps();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to schedule interview.');
        } finally {
            setScheduling(false);
        }
    };

    const handleSendOffer = async (e) => {
        e.preventDefault();
        if (!offerApp) return;
        setSendingOffer(true);
        try {
            await api.post(`/recruiter/applications/${offerApp.id}/offer`, {
                ...offerData,
                salary: Number(offerData.salary),
            });
            setOfferApp(null);
            alert('Job offer letter issued successfully!');
            fetchApps();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to issue offer letter.');
        } finally {
            setSendingOffer(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recruiter Candidate Pipeline</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Track candidate progression, schedule interviews, and issue official job offers ("Take Worker").</p>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-400">Loading pipeline data...</div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Candidate</th>
                                <th className="px-4 py-3">Job Title</th>
                                <th className="px-4 py-3">Stage</th>
                                <th className="px-4 py-3">Job Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {safeArray(apps).length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-slate-400">No active applications in pipeline.</td>
                                </tr>
                            ) : (
                                safeArray(apps).map((a) => (
                                    <tr key={a?.id || Math.random()} className="hover:bg-slate-800/30">
                                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                            {a?.Worker?.firstName || 'Candidate'} {a?.Worker?.lastName || ''}
                                        </td>
                                        <td className="px-4 py-3 text-amber-400 font-semibold">{a?.Job?.title || 'Job Posting'}</td>
                                        <td className="px-4 py-3 capitalize font-semibold text-slate-300">
                                            <span className={`px-2.5 py-1 rounded-full text-xs border ${
                                                a?.status === 'joined'
                                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                    : a?.status === 'offer_sent'
                                                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                                {a?.status?.replace('_', ' ') || 'applied'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <div className="space-y-1">
                                                <span className={`block font-semibold ${
                                                    a?.Job?.status === 'closed' ? 'text-rose-400' : 'text-amber-400'
                                                }`}>
                                                    {a?.Job?.status === 'closed' ? 'FILLED' : 'Open'}
                                                </span>
                                                <span className="block text-slate-400">{a?.Job?.vacancies || 1} Total Positions</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <button onClick={() => updateStatus(a?.id, 'shortlisted')} className="px-2.5 py-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded text-xs font-semibold">
                                                Shortlist
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setInterviewApp(a);
                                                    setInterviewData({
                                                        scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
                                                        mode: 'in_person',
                                                        location: a?.Job?.city ? `${a.Job.city} Office / Factory` : 'Main Workplace',
                                                        notes: 'Bring Aadhaar card and skill certificates.',
                                                    });
                                                }}
                                                className="px-2.5 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs font-semibold"
                                            >
                                                Interview
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setOfferApp(a);
                                                    setOfferData({
                                                        salary: a?.Job?.salaryMin || 20000,
                                                        joiningDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
                                                        terms: 'Standard shift terms apply.',
                                                    });
                                                }}
                                                className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded text-xs font-semibold"
                                            >
                                                Take Worker / Offer
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Schedule Interview Modal */}
            {interviewApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <FiCalendar className="text-blue-400" /> Schedule Interview
                            </h2>
                            <button onClick={() => setInterviewApp(null)} className="text-slate-400 hover:text-white">
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        <p className="text-xs text-slate-400">
                            Candidate: <span className="text-white font-bold">{interviewApp.Worker?.firstName} {interviewApp.Worker?.lastName}</span> ({interviewApp.Job?.title})
                        </p>
                        <form onSubmit={handleScheduleInterview} className="space-y-4 text-sm text-slate-300">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={interviewData.scheduledAt}
                                    onChange={(e) => setInterviewData({ ...interviewData, scheduledAt: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Mode</label>
                                <select
                                    value={interviewData.mode}
                                    onChange={(e) => setInterviewData({ ...interviewData, mode: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="in_person">In Person / On Site</option>
                                    <option value="phone">Telephonic Call</option>
                                    <option value="video">Video Conference</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Location / Meeting Link</label>
                                <input
                                    type="text"
                                    value={interviewData.location}
                                    onChange={(e) => setInterviewData({ ...interviewData, location: e.target.value })}
                                    placeholder="e.g. Gate 3, MIDC Industrial Area, Pune"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Notes / Instructions</label>
                                <textarea
                                    rows={2}
                                    value={interviewData.notes}
                                    onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })}
                                    placeholder="Documents to bring, contact person..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setInterviewApp(null)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={scheduling}
                                    className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                                >
                                    {scheduling ? 'Scheduling...' : 'Confirm Interview'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Issue Offer Letter Modal */}
            {offerApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <FiSend className="text-emerald-400" /> Issue Offer Letter (Hire Worker)
                            </h2>
                            <button onClick={() => setOfferApp(null)} className="text-slate-400 hover:text-white">
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        <p className="text-xs text-slate-400">
                            Issuing offer to: <span className="text-white font-bold">{offerApp.Worker?.firstName} {offerApp.Worker?.lastName}</span> for position <span className="text-amber-400 font-bold">{offerApp.Job?.title}</span>
                        </p>
                        <form onSubmit={handleSendOffer} className="space-y-4 text-sm text-slate-300">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Salary (INR ₹) *</label>
                                <input
                                    type="number"
                                    required
                                    value={offerData.salary}
                                    onChange={(e) => setOfferData({ ...offerData, salary: e.target.value })}
                                    placeholder="22000"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Joining Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={offerData.joiningDate}
                                    onChange={(e) => setOfferData({ ...offerData, joiningDate: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Offer Terms & Benefits</label>
                                <textarea
                                    rows={3}
                                    value={offerData.terms}
                                    onChange={(e) => setOfferData({ ...offerData, terms: e.target.value })}
                                    placeholder="Probation period, housing allowance, overtime details..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setOfferApp(null)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingOffer}
                                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                                >
                                    {sendingOffer ? 'Issuing...' : 'Issue Offer Letter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

