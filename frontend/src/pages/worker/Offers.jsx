import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';
import { FiCheck, FiX, FiFileText } from 'react-icons/fi';

export default function WorkerOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = () => {
    setLoading(true);
    api.get('/worker/offers')
      .then((res) => setOffers(safeArray(res)))
      .catch((err) => {
        console.error(err);
        setOffers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleRespond = async (offerId, status) => {
    try {
      await api.post(`/worker/offers/${offerId}/respond`, { status });
      alert(`Offer ${status} successfully!`);
      fetchOffers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to respond to offer.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employment Offer Letters</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Review official job offers issued by verified employers and accept your new job position.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading offer letters...</div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          {safeArray(offers).length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No official offer letters received yet.</p>
          ) : (
            <div className="space-y-4">
              {safeArray(offers).map((o) => (
                <div key={o?.id || Math.random()} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-700/50 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-700/50 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <FiFileText className="text-amber-500" /> {o?.Application?.Job?.title || 'Job Position Offer'}
                      </h3>
                      <p className="text-xs text-slate-400">{o?.Application?.Job?.Company?.name || 'Verified Employer'}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      o?.status === 'accepted'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : o?.status === 'declined'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {o?.status === 'accepted' ? 'Accepted ✓' : o?.status === 'declined' ? 'Declined' : 'Pending Offer Response'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg">
                    <p><strong className="text-slate-400">Offered Monthly Salary:</strong> <span className="text-emerald-400 font-bold">₹{o?.salary ? Number(o.salary).toLocaleString() : 'N/A'} / mo</span></p>
                    <p><strong className="text-slate-400">Joining Date:</strong> <span className="text-amber-400 font-semibold">{o?.joiningDate || 'Immediate'}</span></p>
                    {o?.terms && <p className="col-span-full"><strong className="text-slate-400">Terms:</strong> {o.terms}</p>}
                  </div>

                  {o?.status === 'sent' && (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleRespond(o.id, 'declined')}
                        className="flex items-center gap-1 px-3.5 py-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-xl text-xs font-bold transition-all"
                      >
                        <FiX /> Decline Offer
                      </button>
                      <button
                        onClick={() => handleRespond(o.id, 'accepted')}
                        className="flex items-center gap-1 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all"
                      >
                        <FiCheck /> Accept Offer & Join Company
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

