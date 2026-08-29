import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray, safeObject } from '../../utils/safeArray';
import { FiSearch, FiMapPin, FiAward, FiCheckCircle, FiStar, FiFilter } from 'react-icons/fi';

export default function EmployerTalents() {
    const [talents, setTalents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ q: '', city: '', skill: '', minExp: '', verified: false });
    const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 });

    const fetchTalents = (newPage = 1) => {
        setLoading(true);
        const query = new URLSearchParams({
            q: filters.q || '',
            city: filters.city || '',
            skill: filters.skill || '',
            minExp: filters.minExp || '',
            verified: filters.verified ? 'true' : '',
            page: newPage,
            limit: pagination.limit,
        });

        api.get(`/public/workers?${query}`)
            .then((res) => {
                const data = safeObject(res);
                setTalents(safeArray(data.rows || []));
                setPagination(prev => ({
                    ...prev,
                    page: newPage,
                    total: data.count || 0,
                }));
            })
            .catch((err) => {
                console.error(err);
                setTalents([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTalents(1);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTalents(1);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Talent Search & Discovery</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Search and discover qualified workers across your platform. Browse profiles, skills, and experience to source top talent for your open positions.</p>
            </div>

            {/* Search & Filter Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <form onSubmit={handleSearch} className="space-y-4">
                    {/* Search Bar */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <FiSearch className="inline mr-2 mb-0.5" /> Search by Name or ID
                        </label>
                        <input
                            type="text"
                            placeholder="Enter worker name, email, or ID..."
                            value={filters.q}
                            onChange={(e) => handleFilterChange('q', e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filters Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                <FiMapPin className="inline mr-2 mb-0.5" /> City
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., New York, London..."
                                value={filters.city}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                <FiAward className="inline mr-2 mb-0.5" /> Skill
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., React, Python..."
                                value={filters.skill}
                                onChange={(e) => handleFilterChange('skill', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Min Experience (Years)
                            </label>
                            <select
                                value={filters.minExp}
                                onChange={(e) => handleFilterChange('minExp', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="">Any</option>
                                <option value="0">Fresher</option>
                                <option value="1">1+ years</option>
                                <option value="3">3+ years</option>
                                <option value="5">5+ years</option>
                                <option value="10">10+ years</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 flex-1">
                                <input
                                    type="checkbox"
                                    checked={filters.verified}
                                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                                    className="w-4 h-4 rounded cursor-pointer"
                                />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                    <FiCheckCircle className="mb-0.5" /> Verified Only
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                        >
                            {loading ? 'Searching...' : 'Search Talents'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFilters({ q: '', city: '', skill: '', minExp: '', verified: false });
                                fetchTalents(1);
                            }}
                            className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Found <span className="font-bold text-slate-900 dark:text-white">{pagination.total}</span> talented workers
                </p>
                {pagination.total > 0 && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Page <span className="font-bold">{pagination.page}</span> of <span className="font-bold">{totalPages}</span>
                    </p>
                )}
            </div>

            {/* Talent Cards Grid */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="inline-block">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-4">Searching for talented workers...</p>
                </div>
            ) : talents.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
                    <FiFilter className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 text-lg">No workers found matching your filters.</p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Try adjusting your search criteria or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {talents.map((worker) => (
                        <div
                            key={worker?.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                                        {worker?.firstName} {worker?.lastName}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{worker?.jobTitle || 'Professional'}</p>
                                </div>
                                {worker?.isVerified && (
                                    <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-xs font-semibold flex items-center gap-1">
                                        <FiCheckCircle className="inline" /> Verified
                                    </span>
                                )}
                            </div>

                            {/* Location & Experience */}
                            <div className="space-y-1.5 mb-3 text-sm">
                                <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <FiMapPin className="text-rose-500 flex-shrink-0" /> {worker?.city || 'Location not specified'}
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <FiAward className="text-amber-500 flex-shrink-0" /> {worker?.yearsExperience || 0} years experience
                                </p>
                                {worker?.trustScore !== null && (
                                    <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                        <FiStar className="text-yellow-500 flex-shrink-0" /> Trust Score: {worker?.trustScore}/100
                                    </p>
                                )}
                            </div>

                            {/* Skills */}
                            {worker?.Skills && worker.Skills.length > 0 && (
                                <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Top Skills</p>
                                    <div className="flex flex-wrap gap-1">
                                        {worker.Skills.slice(0, 3).map((skill) => (
                                            <span
                                                key={skill?.id}
                                                className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold"
                                            >
                                                {skill?.name}
                                            </span>
                                        ))}
                                        {worker.Skills.length > 3 && (
                                            <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-semibold">
                                                +{worker.Skills.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Ratings */}
                            {worker?.Ratings && worker.Ratings.length > 0 && (
                                <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Average Rating: {(worker.Ratings.reduce((sum, r) => sum + r.rating, 0) / worker.Ratings.length).toFixed(1)}/5
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-500">From {worker.Ratings.length} review(s)</p>
                                </div>
                            )}

                            {/* CTA Button */}
                            <a
                                href={`/public/worker/${worker?.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full block text-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-sm"
                            >
                                View Full Profile
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => fetchTalents(Math.max(1, pagination.page - 1))}
                        disabled={pagination.page === 1 || loading}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
                    >
                        Previous
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => fetchTalents(page)}
                                disabled={loading}
                                className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                                    pagination.page === page
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => fetchTalents(Math.min(totalPages, pagination.page + 1))}
                        disabled={pagination.page === totalPages || loading}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
