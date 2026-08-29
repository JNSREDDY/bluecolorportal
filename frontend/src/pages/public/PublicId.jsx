import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { safeObject } from '../../utils/safeArray';
import { FiCheckCircle, FiShield, FiMapPin, FiAward, FiArrowLeft, FiBriefcase } from 'react-icons/fi';

export default function PublicId() {
    const { digitalId } = useParams();
    const [worker, setWorker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!digitalId) return;
        api.get(`/public/worker/${digitalId}`)
            .then((res) => {
                const data = safeObject(res);
                if (data && Object.keys(data).length > 0) {
                    setWorker(data);
                } else {
                    setError('Worker digital profile not found or unavailable.');
                }
            })
            .catch(() => setError('Worker digital profile not found or unavailable.'))
            .finally(() => setLoading(false));
    }, [digitalId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
            </div>
        );
    }

    if (error || !worker) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
                <FiShield className="text-6xl text-rose-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
                <p className="text-slate-400 max-w-md mb-6">{error || 'Worker profile could not be located.'}</p>
                <Link to="/" className="px-6 py-2 bg-amber-400 text-slate-900 font-semibold rounded-lg hover:bg-amber-300">
                    Back to WorkForce Connect
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-extrabold text-amber-400">WorkForce</span>
                        <span className="text-2xl font-extrabold text-white">Connect</span>
                    </div>
                    <span className="text-xs bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full border border-amber-400/20 font-semibold tracking-wide">
                        VERIFIED ID
                    </span>
                </div>

                <div className="text-center mb-6">
                    <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-1 mx-auto shadow-lg">
                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl font-extrabold text-amber-400">
                                {worker?.firstName?.[0] || 'W'}{worker?.lastName?.[0] || ''}
                            </div>
                        </div>
                        {worker?.isVerified && (
                            <FiCheckCircle className="absolute bottom-1 right-1 text-emerald-400 bg-slate-900 rounded-full text-2xl" />
                        )}
                    </div>
                    <h1 className="text-2xl font-bold mt-3 text-white">
                        {worker?.firstName || 'Worker'} {worker?.lastName || ''}
                    </h1>
                    <p className="text-xs font-mono text-slate-400 mt-1">{worker?.digitalId || 'WFC-000'}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 text-center">
                    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Trust Score</p>
                        <p className="text-2xl font-extrabold text-amber-400 mt-1">{worker?.trustScore ?? 85} / 100</p>
                    </div>
                    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Experience</p>
                        <p className="text-2xl font-extrabold text-blue-400 mt-1">{worker?.yearsExperience ?? 3} Yrs</p>
                    </div>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-center text-slate-300">
                        <FiMapPin className="text-amber-400 mr-3 text-lg shrink-0" />
                        <span>{worker?.city || 'India'}, {worker?.state || ''}</span>
                    </div>
                    <div className="flex items-center text-slate-300">
                        <FiBriefcase className="text-amber-400 mr-3 text-lg shrink-0" />
                        <span>{worker?.education || 'Skilled Blue-Collar Professional'}</span>
                    </div>
                </div>

                {worker?.qrCode && (
                    <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-slate-800 mb-6">
                        <img src={worker.qrCode} alt="Worker Digital QR" className="w-36 h-36 bg-white p-2 rounded-xl" />
                        <p className="text-xs text-slate-400 mt-2 font-mono">Scan to verify digital identity</p>
                    </div>
                )}

                <div className="pt-2 text-center">
                    <Link to="/" className="inline-flex items-center text-sm font-semibold text-amber-400 hover:text-amber-300">
                        <FiArrowLeft className="mr-2" /> Powered by WorkForce Connect Platform
                    </Link>
                </div>
            </div>
        </div>
    );
}
