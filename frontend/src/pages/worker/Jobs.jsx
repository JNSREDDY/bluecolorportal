import { useEffect, useState } from 'react';
import api from '../../api/client';
import { safeArray } from '../../utils/safeArray';
import { FiSearch, FiMapPin, FiBriefcase, FiCheck, FiX, FiDollarSign } from 'react-icons/fi';

export default function WorkerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);

  const loadJobsAndApps = () => {
    setLoading(true);
    Promise.all([
      api.get('/worker/jobs').catch(() => api.get('/jobs')),
      api.get('/worker/applications').catch(() => []),
    ])
      .then(([jobsRes, appsRes]) => {
        const rawJobs = jobsRes?.rows || jobsRes || [];
        const normalizedJobs = safeArray(rawJobs).filter((job) => {
          const vacancyCount = Number(job?.vacancies ?? 1);
          return vacancyCount > 0 && (job?.status === 'published' || !job?.status);
        });
        setJobs(normalizedJobs);

        const map = {};
        safeArray(appsRes).forEach((app) => {
          if (app?.jobId) {
            map[app.jobId] = app.status || 'applied';
          }
        });
        setAppliedJobs(map);
      })
      .catch((err) => {
        console.error(err);
        setJobs([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobsAndApps();
  }, []);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    setApplying(true);
    try {
      await api.post(`/worker/jobs/${selectedJob.id}/apply`, { coverNote });
      setAppliedJobs((prev) => ({ ...prev, [selectedJob.id]: 'applied' }));
      setSelectedJob(null);
      setCoverNote('');
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit job application.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Search Job Vacancies</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Discover verified skill-matched job openings across India.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading job postings...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeArray(jobs).length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400 space-y-2">
              <p className="text-base font-semibold">No Open Job Vacancies Available</p>
              <p className="text-sm">All posted positions have been filled or are currently closed. Check back later for new opportunities!</p>
            </div>
          ) : (
            safeArray(jobs).map((j) => {
              const isApplied = !!appliedJobs[j?.id];
              return (
                <div key={j?.id || Math.random()} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{j?.title || 'Job Listing'}</h3>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                        {j?.jobType?.replace('_', ' ') || 'Full time'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">{j?.Company?.name || j?.companyName || 'Verified Enterprise'}</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{j?.description || 'No job summary provided.'}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400 pt-2">
                      <span className="flex items-center gap-1"><FiMapPin /> {j?.city || 'India'}</span>
                      <span className="flex items-center gap-1"><FiBriefcase /> {j?.vacancies ?? 1} Openings</span>
                    </div>
                  </div>
                  <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-bold text-amber-500">
                      ₹{j?.salaryMin ? Number(j.salaryMin).toLocaleString() : 'Competitive'} / mo
                    </span>
                    <button
                      onClick={() => {
                        if (!isApplied) {
                          setSelectedJob(j);
                          setCoverNote('');
                        }
                      }}
                      disabled={isApplied}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isApplied
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md'
                      }`}
                    >
                      {isApplied ? `Applied (${appliedJobs[j?.id]}) ✓` : 'Apply Now'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white">Apply for {selectedJob.title}</h2>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white">
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl text-xs text-slate-300 space-y-1">
              <p><strong className="text-slate-400">Company:</strong> {selectedJob.Company?.name || 'Verified Employer'}</p>
              <p><strong className="text-slate-400">Location:</strong> {selectedJob.city || 'India'}, {selectedJob.state || ''}</p>
              <p><strong className="text-slate-400">Salary:</strong> ₹{selectedJob.salaryMin ? Number(selectedJob.salaryMin).toLocaleString() : 'Negotiable'} / month</p>
            </div>
            <form onSubmit={handleApplySubmit} className="space-y-4 text-sm text-slate-300">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Cover Note / Message to Recruiter</label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Introduce yourself and explain why you're a good fit for this role..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                >
                  {applying ? 'Submitting...' : 'Confirm Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

