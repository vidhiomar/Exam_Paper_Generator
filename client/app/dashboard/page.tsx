'use client';

import { useEffect, useState } from 'react';
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
import { generatePaper } from '@/lib/api';
import {
  BlueprintData,
  getStoredBlueprint,
  getInsightData,
  getBlueprintRows,
  getPieData,
  getBarData,
} from '@/lib/exam-data';

export default function DashboardPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null);

  useEffect(() => {
    const storedBlueprint = getStoredBlueprint();

    if (!storedBlueprint) {
      toast.error('No blueprint found. Please upload a paper first.');
      router.replace('/');
      return;
    }

    setBlueprint(storedBlueprint);
    setIsLoading(false);
  }, [router]);

  // GENERATE HANDLER (REAL API)
  const handleGenerate = async () => {
    if (!blueprint) {
      toast.error('No blueprint found. Please upload a paper first.');
      return;
    }

    setIsGenerating(true);

    const toastId = toast.loading('Generating predicted paper...', {
      description: 'AI is crafting questions based on blueprint patterns.',
    });

    try {
      const data = await generatePaper(blueprint);

      localStorage.setItem(
        'generated_paper',
        JSON.stringify(data.generated_paper)
      );

      toast.dismiss(toastId);
      toast.success('Paper generated!', {
        description: 'Your predicted exam paper is ready.',
      });

      // Navigate
      router.push('/paper');
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const insightData = getInsightData(blueprint);
  const blueprintRows = getBlueprintRows(blueprint);
  const pieData = getPieData(blueprint);
  const barData = getBarData(blueprint);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-16 min-w-0">
        {/* Header */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-r from-slate-900 via-primary-900 to-slate-900">
          <AnimatedBackground />
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
                  <span className="text-xs text-slate-300 font-medium">
                    April 2026
                  </span>
                </div>

                <button
                  onClick={() => toast.info('Re-analyzing paper...')}
                  className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20"
                >
                  <RefreshCw size={14} />
                </button>

                <button
                  onClick={() => toast.success('Report exported!')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 text-xs font-medium"
                >
                  <Download size={12} />
                  Export
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-w-[1200px]">
          {/* Insights */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Key Insights
              </h2>

              <button className="flex items-center gap-1 text-xs text-primary-600 font-semibold">
                View all <ChevronRight size={12} />
              </button>
            </div>

            <InsightCards isLoading={isLoading} data={insightData} />
          </section>

          {/* Blueprint */}
          <section>
            <div className="mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Blueprint Table
              </h2>
            </div>

            <BlueprintTable isLoading={isLoading} rows={blueprintRows} />
          </section>

          {/* Charts */}
          <section>
            <div className="mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Visual Analytics
              </h2>
            </div>

            <Charts isLoading={isLoading} pieData={pieData} barData={barData} />
          </section>

          {/* Generate CTA */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-secondary p-6">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Generate Predicted Paper
                  </h3>

                  <p className="text-sm text-white/80 mt-1 max-w-md">
                    AI will create a new exam paper based on extracted blueprint.
                  </p>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                  ${
                    isGenerating
                      ? 'bg-white/20 text-white/60'
                      : 'bg-white text-primary-600'
                  }`}
                >
                  {isGenerating ? 'Generating...' : 'Generate Paper'}
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
