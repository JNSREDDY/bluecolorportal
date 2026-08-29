import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCheckCircle, FiShield, FiSearch, FiUsers, FiBriefcase, FiStar, FiChevronDown,
} from 'react-icons/fi';
import { useState } from 'react';

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

const faqs = [
  ['Is this only for white-collar jobs?', 'No. WorkForce Connect is built for electricians, drivers, welders, masons, delivery staff and other skilled trades.'],
  ['How does the digital identity work?', 'Each worker gets a WFC ID, QR card, trust score, verified certificates and employment history.'],
  ['How are companies verified?', 'Platform admins review GST, PAN and company documents before employers can hire at scale.'],
  ['Do recruiters register themselves?', 'No. Only a company owner can invite recruiters by email.'],
  ['Is there a fee for workers?', 'Worker registration and job applications are free on the platform.'],
];

export default function Landing() {
  const [open, setOpen] = useState(0);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-flame-500 via-brand-500 to-brand-800" />
            <span className="font-display font-extrabold">WorkForce Connect</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#stories">Stories</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="flex gap-2">
            <Link to="/login" className="btn-ghost py-2">Login</Link>
            <Link to="/register" className="btn-primary py-2">Get started</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-700 to-ink" />
        <div className="absolute -top-24 -right-16 h-96 w-96 rounded-full bg-flame-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center text-white">
          <motion.div initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5 }}>
            <p className="uppercase tracking-[0.2em] text-xs text-brand-100 mb-3">India’s blue-collar hiring OS</p>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight">
              Trusted digital identities for India’s skilled workforce
            </h1>
            <p className="mt-5 text-brand-50/90 text-lg">
              Discover, verify and hire electricians, drivers, welders and technicians — with QR identity cards, trust scores and a full hiring pipeline.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary from-flame-500 to-flame-600">I’m a worker</Link>
              <Link to="/register?role=employer" className="btn-ghost border-white/30 text-white hover:bg-white/10">I’m hiring</Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              {[
                ['1L+', 'Worker identities'],
                ['2.4k', 'Verified companies'],
                ['48h', 'Median time-to-hire'],
              ].map(([n, l]) => (
                <div key={l} className="glass p-3 rounded-2xl">
                  <p className="text-2xl font-display font-bold">{n}</p>
                  <p className="text-xs text-white/80">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <div className="glass rounded-3xl p-6 rotate-2">
              <p className="text-xs uppercase tracking-widest text-brand-100">Digital Identity</p>
              <p className="text-3xl font-display font-bold mt-2">WFC-00000001</p>
              <p className="mt-1">Ramesh Kumar · Electrician</p>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-sm text-white/70">Trust score</p>
                  <p className="text-4xl font-bold text-flame-400">92</p>
                </div>
                <div className="h-24 w-24 rounded-xl bg-white p-1">
                  <div className="h-full w-full bg-[repeating-linear-gradient(90deg,#0B3B4A_0,#0B3B4A_2px,transparent_2px,transparent_4px)]" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 glass rounded-2xl p-4 -rotate-3">
              <p className="text-sm">ITI Electrical · NSDC verified</p>
              <p className="text-xs text-white/70">Certificate approved by admin</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl font-bold text-center">A complete hiring ecosystem</h2>
        <p className="text-center text-slate-500 mt-2">Not a job board — identity, verification, pipeline and payroll-ready records.</p>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {[
            [FiShield, 'Digital ID + QR', 'Every worker carries a portable, verifiable identity card.'],
            [FiStar, 'Trust score', 'Ratings, certificates and history compose a living score.'],
            [FiSearch, 'Skill-first search', 'Filter by trade, city, salary, shift, food and stay.'],
            [FiBriefcase, 'Job-to-join pipeline', 'Apply → shortlist → interview → offer → joined.'],
            [FiUsers, 'Recruiter workspace', 'Owners invite HR. Recruiters never self-register.'],
            [FiCheckCircle, 'Admin control tower', 'Approve companies, certificates, fraud and complaints.'],
          ].map(([Icon, t, d]) => (
            <div key={t} className="card hover:-translate-y-1 transition">
              <Icon className="text-brand-600 text-2xl" />
              <h3 className="font-display font-bold mt-3">{t}</h3>
              <p className="text-sm text-slate-500 mt-1">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="bg-brand-50/60 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center">How it works</h2>
          <div className="grid md:grid-cols-4 gap-6 mt-10">
            {['Create identity', 'Get verified', 'Match & apply', 'Interview & join'].map((s, i) => (
              <div key={s} className="card text-center">
                <div className="mx-auto h-10 w-10 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold">{i + 1}</div>
                <p className="mt-3 font-semibold">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold text-center">Trusted companies</h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
          {['Tata Steel', 'L&T', 'Ashok Leyland', 'Mahindra Logistics', 'UltraTech', 'JSW Steel', 'BHEL', 'Apollo', 'Amazon Logistics', 'Flipkart'].map((c) => (
            <div key={c} className="card py-6 text-center text-sm font-semibold">{c}</div>
          ))}
        </div>
      </section>

      <section id="stories" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-display text-3xl font-bold text-center">Worker success stories</h2>
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {[
            ['Priya Yadav', 'Welder · JSW Steel', 'Moved from daily wage to a PF job in 11 days.'],
            ['Imran Khan', 'Driver · Amazon Logistics', 'Verified licence + trust score unlocked hub routes.'],
            ['Kavita Nair', 'Technician · Apollo', 'Certificate approval lifted her score from 61 to 88.'],
          ].map(([n, r, s]) => (
            <div key={n} className="card">
              <p className="font-display font-bold">{n}</p>
              <p className="text-xs text-brand-600">{r}</p>
              <p className="mt-3 text-sm text-slate-600">{s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-display text-3xl font-bold text-center">Testimonials</h2>
        <div className="grid md:grid-cols-2 gap-5 mt-8">
          <div className="card">“We filled 40 mason roles in Pune without WhatsApp chaos.” — HR, L&T Construction</div>
          <div className="card">“The QR card on the gate cut fake walk-ins overnight.” — Plant HR, Tata Steel</div>
        </div>
      </section>

      <section id="faq" className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold text-center">FAQs</h2>
        <div className="mt-8 space-y-2">
          {faqs.map(([q, a], i) => (
            <button key={q} className="card w-full text-left" onClick={() => setOpen(i)}>
              <div className="flex justify-between items-center font-semibold">{q} <FiChevronDown /></div>
              {open === i && <p className="text-sm text-slate-500 mt-2">{a}</p>}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-3xl p-10 text-white text-center bg-gradient-to-r from-brand-800 via-brand-600 to-flame-500">
          <h2 className="font-display text-3xl font-bold">Hire with proof. Work with dignity.</h2>
          <p className="mt-2 text-white/80">Join WorkForce Connect as a worker or a verified employer today.</p>
          <Link to="/register" className="btn-primary mt-6 bg-white text-brand-800 from-white to-white">Create your account</Link>
        </div>
      </section>

      <footer className="bg-ink text-slate-300 py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <p className="text-white font-display font-bold">WorkForce Connect</p>
            <p className="mt-2">Enterprise recruitment for India’s blue-collar workforce.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-2">Product</p>
            <p>Workers</p><p>Employers</p><p>Recruiters</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-2">Trust</p>
            <p>Verification</p><p>Complaints</p><p>Privacy</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-2">Contact</p>
            <p>support@workforceconnect.com</p>
            <p>Google login is architected, not enabled yet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
