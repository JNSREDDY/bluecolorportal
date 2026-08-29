import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeObject } from '../../utils/safeArray';

export default function EmployerCompany() {
    const [company, setCompany] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/employer/company')
            .then((res) => setCompany(safeObject(res)))
            .catch((err) => {
                console.error(err);
                setCompany({});
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Company Profile & Verification Settings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage enterprise profile, GST/PAN compliance, and workplace locations.</p>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-400">Loading company profile...</div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 max-w-2xl shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-extrabold text-2xl border border-amber-500/30">
                            {company?.name ? company.name.charAt(0) : 'C'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{company?.name || 'Enterprise Company'}</h2>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                                {company?.verificationStatus || 'Verified Partner'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-200 dark:border-slate-800">
                        <div>
                            <span className="text-xs text-slate-500 block">Industry Sector</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{company?.industry || 'Manufacturing / Engineering'}</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">Headquarters</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{company?.city || 'Mumbai'}, {company?.state || 'Maharashtra'}</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">GST Number</span>
                            <span className="font-mono text-xs text-amber-400">{company?.gst || '27AAAAA0000A1Z5'}</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">PAN Number</span>
                            <span className="font-mono text-xs text-amber-400">{company?.pan || 'AAAAA0000A'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
