'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Sparkles,
  RefreshCw,
  Download,
  ChevronRight,
  Wand2,
  Clock,
} from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Sidebar from '@/components/Sidebar';
import BlueprintTable from '@/components/BlueprintTable';
import InsightCards from '@/components/InsightCards';
import Charts from '@/components/Charts';

export default function DashboardPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const toastId = toast.loading('Generating predicted paper...', {
      description: 'AI is crafting questions based on blueprint patterns.',
    });
    await new Promise((r) => setTimeout(r, 2800));
    toast.dismiss(toastId);
    toast.success('Paper generated!', { description: 'Your predicted exam paper is ready.' });
    setIsGenerating(false);
    router.push('/paper');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main content — offset for sidebar */}
      <main className="flex-1 ml-16 min-w-0">
        {/* Animated Header Banner */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-r from-slate-900 via-primary-900 to-slate-900">
          <AnimatedBackground />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-primary-900/50 to-slate-900/60 backdrop-blur-[1px]" />

          <div className="relative z-10 h-full flex items-end px-8 pb-5">
            <div className="flex items-end justify-between w-full">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={13} className="text-primary-300" />
                  <span className="text-xs font-semibold text-primary-300 uppercase tracking-widest">
                    AI Analysis Complete
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Exam Blueprint Analysis
                </h1>
                <p className="text-sm text-slate-300 mt-1">
                  Computer Science Fundamentals · CSE-301 · 5th Semester
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">
                  <Clock size={12} className="text-slate-300" />
                  <span className="text-xs text-slate-300 font-medium">April 2026</span>
                </div>
                <button
                  onClick={() => toast.info('Re-analyzing paper...')}
                  className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={() => toast.success('Report exported!')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors text-xs font-medium"
                >
                  <Download size={12} />
                  Export
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Dashboard body */}
        <div className="p-6 space-y-6 max-w-[1200px]">
          {/* Insight cards */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Key Insights
              </h2>
              <button className="flex items-center gap-1 text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                View all <ChevronRight size={12} />
              </button>
            </div>
            <InsightCards isLoading={isLoading} />
          </section>

          {/* Blueprint Table */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Blueprint Table
              </h2>
            </div>
            <BlueprintTable isLoading={isLoading} />
          </section>

          {/* Charts */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Visual Analytics
              </h2>
            </div>
            <Charts isLoading={isLoading} />
          </section>

          {/* Generate CTA */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.45 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-secondary p-[1px] shadow-xl shadow-primary-200">
              <div className="relative rounded-2xl bg-gradient-to-r from-primary-600/95 via-primary-700/95 to-secondary/95 p-7 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute -right-16 -top-12 w-52 h-52 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-cyan-400/10 blur-2xl" />

                <div className="relative flex items-center justify-between gap-6 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Wand2 size={14} className="text-primary-200" />
                      <span className="text-xs font-bold text-primary-200 uppercase tracking-widest">
                        Ready to Generate
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Generate Predicted Paper
                    </h3>
                    <p className="text-sm text-primary-200 mt-1 max-w-md">
                      AI will create a new exam paper following the exact same blueprint
                      patterns, difficulty distribution, and Bloom's taxonomy levels.
                    </p>
                  </div>

                  <motion.button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    whileHover={!isGenerating ? { scale: 1.04 } : {}}
                    whileTap={!isGenerating ? { scale: 0.97 } : {}}
                    className={`ripple flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm
                      transition-all duration-300 whitespace-nowrap
                      ${isGenerating
                        ? 'bg-white/20 text-white/60 cursor-not-allowed'
                        : 'bg-white text-primary-600 hover:bg-slate-50 shadow-lg shadow-black/20 hover:shadow-xl'
                      }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Generate Paper
                        <ArrowRight size={15} className="opacity-60" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

// Missing import fix
function ArrowRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
