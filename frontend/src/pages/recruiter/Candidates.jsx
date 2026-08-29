import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';

export default function RecruiterCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/recruiter/candidates')
            .then((res) => setCandidates(safeArray(res)))
            .catch((err) => {
                console.error(err);
                setCandidates([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Candidate Search & Discovery</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Discover verified blue-collar talent, filter by trade, location, and trust score.</p>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-400">Searching candidate directory...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {safeArray(candidates).length === 0 ? (
                        <div className="col-span-full text-center py-8 text-slate-400">No candidates found in directory.</div>
                    ) : (
                        safeArray(candidates).map((c) => (
                            <div key={c?.id || Math.random()} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{c?.firstName || 'Worker'} {c?.lastName || ''}</h3>
                                    <span className="text-xs font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                        {c?.trustScore ?? 85} / 100
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400">{c?.city || 'India'} • {c?.yearsExperience ?? 2} yrs exp</p>
                                <div className="flex flex-wrap gap-1 pt-2">
                                    {safeArray(c?.Skills).map((s) => (
                                        <span key={s?.id || Math.random()} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                            {s?.name || 'Skill'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
