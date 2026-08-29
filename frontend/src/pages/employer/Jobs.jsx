import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';
import { FiPlus, FiX, FiBriefcase } from 'react-icons/fi';

export default function EmployerJobs() {
    const [jobs, setJobs] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobStats, setJobStats] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        city: '',
        state: '',
        vacancies: 1,
        salaryMin: '',
        salaryMax: '',
        jobType: 'full_time',
        shift: 'day',
        accommodation: false,
        food: false,
        status: 'published',
        recruiterEmail: '',
    });

    const fetchJobs = () => {
        setLoading(true);
        api.get('/employer/jobs')
            .then((res) => {
                const jobsData = safeArray(res);
                setJobs(jobsData);
                // Build stats from response data
                const stats = {};
                jobsData.forEach((job) => {
                    stats[job.id] = {
                        accepted: job.acceptedCount || 0,
                        total: job.vacancies || 1,
                    };
                });
                setJobStats(stats);
            })
            .catch((err) => {
                console.error(err);
                setJobs([]);
            })
            .finally(() => setLoading(false));
    };

    const fetchRecruiters = () => {
        api.get('/employer/recruiters')
            .then((res) => setRecruiters(safeArray(res)))
            .catch((err) => {
                console.error(err);
                setRecruiters([]);
            });
    };

    useEffect(() => {
        fetchJobs();
        fetchRecruiters();
    }, []);

    const handleCreateJob = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                vacancies: Math.max(1, Number(formData.vacancies || 1)),
                salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
                salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
            };
            await api.post('/employer/jobs', payload);
            setShowModal(false);
            setFormData({
                title: '',
                description: '',
                city: '',
                state: '',
                vacancies: 1,
                salaryMin: '',
                salaryMax: '',
                jobType: 'full_time',
                shift: 'day',
                accommodation: false,
                food: false,
                status: 'published',
                recruiterEmail: '',
            });
            fetchJobs();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to post new job.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
        try {
            await api.patch(`/employer/jobs/${id}/status`, { status: nextStatus });
            fetchJobs();
        } catch {
            alert('Failed to update job status.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job listing?')) return;
        try {
            await api.delete(`/employer/jobs/${id}`);
            fetchJobs();
        } catch {
            alert('Failed to remove job posting.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employer Job Vacancies</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Post new blue-collar job listings and manage active recruitment campaigns.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-all"
                >
                    <FiPlus className="text-lg" /> Post New Job
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-400">Loading job postings...</div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Location</th>
                                <th className="px-4 py-3">Vacancy Status</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {safeArray(jobs).length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-400">No jobs posted yet. Click "Post New Job" above to create one.</td>
                                </tr>
                            ) : (
                                safeArray(jobs).map((j) => {
                                    const stats = jobStats[j?.id] || { accepted: 0, total: j?.vacancies ?? 1 };
                                    const remaining = Math.max(0, stats.total - stats.accepted);
                                    const isClosed = remaining === 0 && stats.accepted > 0;
                                    return (
                                        <tr key={j?.id || Math.random()} className="hover:bg-slate-800/30">
                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{j?.title || 'Job Title'}</td>
                                            <td className="px-4 py-3 text-slate-400">{j?.city || 'India'}</td>
                                            <td className="px-4 py-3">
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-amber-500">{remaining} Open</div>
                                                    <div className="text-xs text-slate-400">{stats.accepted} Accepted / {stats.total} Total</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleStatusToggle(j?.id, j?.status)}
                                                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-all ${
                                                        isClosed
                                                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                            : j?.status === 'published'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                                                    }`}
                                                >
                                                    {isClosed ? 'filled (closed)' : (j?.status || 'published') + ' (click to toggle)'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleDelete(j?.id)} className="px-2.5 py-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded text-xs font-semibold">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Post Job Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <FiBriefcase className="text-amber-500" /> Create Job Opening
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateJob} className="space-y-4 text-sm text-slate-300">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Job Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Senior Machine Technician, Warehouse Operator"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Job Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe key responsibilities and requirements..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="e.g. Mumbai, Bengaluru"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">State</label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        placeholder="e.g. Maharashtra"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Recruiter Email (Optional)</label>
                                <select
                                    value={formData.recruiterEmail}
                                    onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                >
                                    <option value="">-- Select a recruiter --</option>
                                    {safeArray(recruiters).map((rec) => (
                                        <option key={rec?.id} value={rec?.User?.email}>
                                            {rec?.fullName} ({rec?.User?.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Vacancies</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.vacancies}
                                        onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Salary Min (₹/mo)</label>
                                    <input
                                        type="number"
                                        placeholder="18000"
                                        value={formData.salaryMin}
                                        onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Salary Max (₹/mo)</label>
                                    <input
                                        type="number"
                                        placeholder="25000"
                                        value={formData.salaryMax}
                                        onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Job Type</label>
                                    <select
                                        value={formData.jobType}
                                        onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                    >
                                        <option value="full_time">Full Time</option>
                                        <option value="contract">Contract</option>
                                        <option value="daily_wage">Daily Wage</option>
                                        <option value="part_time">Part Time</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Shift</label>
                                    <select
                                        value={formData.shift}
                                        onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                    >
                                        <option value="day">Day</option>
                                        <option value="night">Night</option>
                                        <option value="rotational">Rotational</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer text-xs">
                                    <input
                                        type="checkbox"
                                        checked={formData.accommodation}
                                        onChange={(e) => setFormData({ ...formData, accommodation: e.target.checked })}
                                        className="accent-amber-500"
                                    />
                                    Provide Accommodation
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-xs">
                                    <input
                                        type="checkbox"
                                        checked={formData.food}
                                        onChange={(e) => setFormData({ ...formData, food: e.target.checked })}
                                        className="accent-amber-500"
                                    />
                                    Provide Food
                                </label>
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
                                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                                >
                                    {submitting ? 'Posting...' : 'Publish Job Listing'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

