import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../../api/client';
import { safeObject, safeArray } from '../../utils/safeArray';
import { FiUser, FiFileText, FiPrinter, FiUpload, FiAward, FiCheckCircle, FiShield, FiBriefcase, FiDownload } from 'react-icons/fi';

export default function WorkerProfile() {
  const { data: rawData, refetch } = useQuery({
    queryKey: ['wprofile'],
    queryFn: async () => {
      try {
        const res = await api.get('/worker/profile');
        return safeObject(res);
      } catch {
        return {};
      }
    },
  });

  const data = rawData || {};
  const { register, handleSubmit } = useForm();
  const [activeTab, setActiveTab] = useState('details');

  const save = useMutation({
    mutationFn: (v) =>
      api.put('/worker/profile', {
        ...v,
        expectedSalary: Number(v.expectedSalary),
        yearsExperience: Number(v.yearsExperience),
      }),
    onSuccess: () => refetch(),
  });

  const handlePrintResume = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            {data?.firstName || 'Worker'} {data?.lastName || 'Profile'}
            {data?.isVerified && <FiCheckCircle className="text-emerald-500 text-lg ml-2" />}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Digital Identity ID: <span className="font-mono text-amber-500">{data?.digitalId || 'WFC-000'}</span> • Trust Score: <span className="font-bold text-emerald-500">{data?.trustScore ?? 85}/100</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'details' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center ${activeTab === 'resume' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            <FiFileText className="mr-1.5" /> Resume Generator
          </button>
        </div>
      </div>

      {activeTab === 'details' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal & Work Information</h2>
            <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full font-bold">
              {data?.profileCompletion ?? 85}% Profile Completed
            </span>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit((v) => save.mutate(v))}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">First Name</label>
                <input className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm" placeholder="First Name" defaultValue={data?.firstName || ''} {...register('firstName')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Last Name</label>
                <input className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm" placeholder="Last Name" defaultValue={data?.lastName || ''} {...register('lastName')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
                <input className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm" placeholder="Phone" defaultValue={data?.phone || ''} {...register('phone')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">City</label>
                <input className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm" placeholder="City" defaultValue={data?.city || ''} {...register('city')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">State</label>
                <input className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm" placeholder="State" defaultValue={data?.state || ''} {...register('state')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Education Level</label>
                <input className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm" placeholder="Education (e.g. ITI, 10th Pass)" defaultValue={data?.education || ''} {...register('education')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Expected Salary (₹/month)</label>
                <input className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm" type="number" placeholder="Expected salary" defaultValue={data?.expectedSalary || 18000} {...register('expectedSalary')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Years of Experience</label>
                <input className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm" type="number" placeholder="Years experience" defaultValue={data?.yearsExperience || 3} {...register('yearsExperience')} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Worker Bio</label>
              <textarea className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm" rows="3" placeholder="Summary of skills..." defaultValue={data?.bio || ''} {...register('bio')} />
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm">
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handlePrintResume}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg flex items-center text-sm transition-all"
            >
              <FiPrinter className="mr-2" /> Download / Print Resume PDF
            </button>
          </div>

          <div id="printable-resume" className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 space-y-6">
            <div className="border-b-2 border-amber-500 pb-4 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">{data?.firstName || 'Worker'} {data?.lastName || ''}</h1>
                <p className="text-sm text-slate-600 font-semibold mt-1">Verified Skilled Worker • Digital ID: {data?.digitalId || 'WFC-000'}</p>
                <p className="text-xs text-slate-500 mt-1">{data?.city || 'India'}, {data?.state || ''} | {data?.phone || ''}</p>
              </div>
              {data?.qrCode && (
                <img src={data.qrCode} alt="Worker Digital QR" className="w-24 h-24 bg-white p-1 border rounded-lg" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-amber-600 border-b pb-1 uppercase tracking-wider">Professional Summary</h2>
              <p className="text-sm text-slate-700 mt-2">{data?.bio || 'Hardworking blue-collar worker with strong technical skills and reliable work history.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-bold text-amber-600 border-b pb-1 uppercase tracking-wider">Education & Credentials</h2>
                <p className="text-sm text-slate-800 font-semibold mt-2">{data?.education || 'Secondary Education'}</p>
                <p className="text-xs text-slate-600">Verified Trust Score: {data?.trustScore ?? 85}/100</p>
              </div>
              <div>
                <h2 className="text-sm font-bold text-amber-600 border-b pb-1 uppercase tracking-wider">Experience & Salary</h2>
                <p className="text-sm text-slate-800 font-semibold mt-2">{data?.yearsExperience ?? 3} Years Industry Experience</p>
                <p className="text-xs text-slate-600">Expected Salary: ₹{data?.expectedSalary ? data.expectedSalary.toLocaleString() : '18,000'}/mo</p>
              </div>
            </div>

            {safeArray(data?.Certificates).length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-amber-600 border-b pb-1 uppercase tracking-wider">Certificates & Training</h2>
                <ul className="text-xs text-slate-700 mt-2 space-y-1">
                  {safeArray(data.Certificates).map((cert) => (
                    <li key={cert?.id || Math.random()} className="flex items-center">
                      <FiCheckCircle className="text-emerald-600 mr-2" />
                      <span className="font-semibold">{cert?.name || cert?.title || 'Certificate'}</span> — {cert?.issuer || cert?.issuingAuthority || 'Govt ITI'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
