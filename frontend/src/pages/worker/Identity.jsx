import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeObject } from '../../utils/safeArray';
import { FiShield, FiGrid, FiCheckCircle } from 'react-icons/fi';

export default function WorkerIdentity() {
  const [identity, setIdentity] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/worker/identity')
      .then((res) => setIdentity(safeObject(res)))
      .catch((err) => {
        console.error(err);
        setIdentity({});
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Digital Identity Card</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Shareable QR credential for instant employer verification.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading digital identity...</div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-2xl mx-auto border border-amber-500/30">
            <FiShield />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{identity?.firstName || 'Worker'} {identity?.lastName || ''}</h2>
            <p className="text-xs font-mono text-amber-500 mt-1">ID: {identity?.digitalId || 'WFC-000'}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl inline-block">
            {identity?.qrCode ? (
              <img src={identity.qrCode} alt="Digital QR" className="w-40 h-40 bg-white p-2 rounded-xl mx-auto" />
            ) : (
              <div className="w-40 h-40 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400">
                <FiGrid className="text-4xl" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-emerald-400 font-semibold">
            <FiCheckCircle />
            <span>Trust Score: {identity?.trustScore ?? 85} / 100</span>
          </div>
        </div>
      )}
    </div>
  );
}
