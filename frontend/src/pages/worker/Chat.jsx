import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';

export default function WorkerChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/worker/dashboard')
      .then((res) => setMessages(safeArray(res?.data?.messages)))
      .catch((err) => {
        console.error(err);
        setMessages([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages & Recruiter Chat</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Direct communication with enterprise HR recruiters.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm min-h-[300px] flex flex-col justify-between">
        {safeArray(messages).length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No active conversation threads.</div>
        ) : (
          <div className="space-y-3">
            {safeArray(messages).map((m) => (
              <div key={m?.id || Math.random()} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm">
                <p className="font-semibold text-amber-500">{m?.sender || 'Recruiter'}</p>
                <p className="text-slate-300 mt-1">{m?.text || m?.message || ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
