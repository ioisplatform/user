import React, { useState } from 'react';
import { IOIS_COURSES } from '../data/storyClips';
import { 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Laptop, 
  Users, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Code,
  Compass,
  Award,
  Zap,
  Globe,
  Share2,
  Heart
} from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const InteractiveIOISPortal: React.FC<Props> = ({ compact = false }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'homemakers' | 'roadmaps'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likes, setLikes] = useState(1420);
  const [hasLiked, setHasLiked] = useState(false);

  const filteredCourses = IOIS_COURSES.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'students') return c.category === 'Student';
    if (activeTab === 'homemakers') return c.category === 'Housewife';
    if (activeTab === 'roadmaps') return true;
    return true;
  });

  if (compact) {
    // Ultra-compact miniature version rendered cleanly inside the presenter's laptop screen
    return (
      <div className="w-full h-full bg-slate-950 text-white font-sans overflow-hidden select-none flex flex-col p-2 text-xs">
        {/* Browser Top bar */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-1.5">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-amber-400 font-semibold ml-1.5 flex items-center gap-1">
              🔥 ioisplatform.github.io/iois
            </span>
          </div>
          <div className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-bold border border-amber-500/30">
            IOIS Live
          </div>
        </div>

        {/* Mini Hero */}
        <div className="bg-gradient-to-r from-blue-950/80 to-indigo-950/90 p-2 rounded border border-amber-500/30 flex items-center justify-between mb-2">
          <div>
            <div className="text-[11px] font-black text-white leading-tight flex items-center gap-1">
              <span>🌟 IOIS Platform</span>
              <span className="bg-amber-400 text-slate-950 text-[8px] font-bold px-1 rounded">100% FREE</span>
            </div>
            <div className="text-[9px] text-slate-300 mt-0.5">
              Empowering Students & Homemakers with Modern Skills
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-slate-950 font-black text-[10px] shadow-lg shadow-amber-500/50">
            IOIS
          </div>
        </div>

        {/* Mini Cards Grid */}
        <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden">
          {filteredCourses.slice(0, 2).map((course) => (
            <div key={course.id} className="bg-slate-900/90 p-1.5 rounded border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[8px] px-1 py-0.2 bg-blue-500/20 text-blue-300 rounded font-semibold">
                  {course.category}
                </span>
                <p className="text-[9px] font-bold text-slate-100 line-clamp-2 mt-1 leading-snug">
                  {course.title}
                </p>
              </div>
              <div className="flex items-center justify-between mt-1 text-[8px] text-amber-400">
                <span>⭐ {course.rating}</span>
                <span className="text-emerald-400 font-medium">Free Access</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Ticker */}
        <div className="mt-1.5 pt-1 border-t border-slate-800 text-[8px] text-slate-400 flex items-center justify-between">
          <span className="text-amber-400">⚡ 45,000+ Active Learners</span>
          <span className="text-slate-300">Open in Browser →</span>
        </div>
      </div>
    );
  }

  // Full High-Resolution Interactive Portal Explorer
  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Header bar */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-amber-500/30">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-wide">IOIS Platform</span>
              <span className="bg-amber-400/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-amber-400/30">
                Official Portal
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ioisplatform.github.io/iois &bull; Complete Tech & Career Learning Ecosystem
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setLikes(prev => hasLiked ? prev - 1 : prev + 1);
              setHasLiked(!hasLiked);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              hasLiked 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>{likes.toLocaleString()}</span>
          </button>

          <a
            href="https://ioisplatform.github.io/iois"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Hero Banner inside portal */}
      <div className="relative bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-6 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Education For Every Indian Student & Homemaker</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            Learn In-Demand Tech & Digital Skills with Zero Confusion
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Free structured roadmaps, interactive coding labs, AI study buddies, and career guidance tailored for college students, job seekers, and ambitious homemakers.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Free Practice Notes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Hindi & English Friendly</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Step-by-Step Roadmaps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            All Tracks ({IOIS_COURSES.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'students'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            For College Students
          </button>
          <button
            onClick={() => setActiveTab('homemakers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'homemakers'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            For Homemakers & Freelancers
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, python, AI..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
          />
        </div>
      </div>

      {/* Courses & Resources Grid */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 transition-all duration-300 flex flex-col justify-between group shadow-lg shadow-black/40"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  {course.badge}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  ⭐ <strong className="text-slate-200">{course.rating}</strong> ({course.enrolled})
                </span>
              </div>

              <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {course.description}
              </p>

              {/* Modules pill tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {course.modules.map((m, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800/80"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Free Open Resource
              </span>
              <a
                href="https://ioisplatform.github.io/iois"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>Website URL: <strong>https://ioisplatform.github.io/iois</strong></span>
        </div>
        <div className="text-slate-400">
          Created for Students, Learners & Creators across India
        </div>
      </div>
    </div>
  );
};
