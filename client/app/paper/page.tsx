'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Sparkles,
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { getStoredGeneratedPaper, GeneratedPaperSection } from '@/lib/exam-data';

export default function PaperPage() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [paper, setPaper] = useState<GeneratedPaperSection[] | null>(null);

  useEffect(() => {
    const storedPaper = getStoredGeneratedPaper();

    if (storedPaper?.length) {
      setPaper(storedPaper);
    } else {
      router.replace('/dashboard');
    }
  }, [router]);

  const handlePrint = () => {
    toast.info('Opening print dialog...');
    setTimeout(() => window.print(), 300);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    toast.loading('Preparing PDF...', { id: 'pdf' });
    await new Promise((r) => setTimeout(r, 1800));
    toast.dismiss('pdf');
    toast.success('PDF downloaded!', {
      description: 'CSE-301-Predicted-Paper.pdf saved.',
    });
    setIsDownloading(false);
  };

  const handleShare = () => {
    toast.success('Link copied!', { description: 'Share link is in your clipboard.' });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 ml-16 min-w-0">
        <div className="no-print sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="h-4 w-px bg-slate-200" />
              <div>
                <h1 className="text-sm font-bold text-slate-800">Generated Exam Paper</h1>
                <p className="text-xs text-slate-400">CSE-301 · Computer Science Fundamentals</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-700">94% Accuracy</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 border border-primary-200">
                <Sparkles size={12} className="text-primary-600" />
                <span className="text-xs font-semibold text-primary-700">AI Generated</span>
              </div>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Share2 size={17} />
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Printer size={15} />
                Print
              </button>

              <motion.button
                onClick={handleDownload}
                disabled={isDownloading}
                whileHover={!isDownloading ? { scale: 1.03 } : {}}
                whileTap={!isDownloading ? { scale: 0.97 } : {}}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold
                  ${isDownloading
                    ? 'bg-primary-400 cursor-not-allowed text-white/70'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
              >
                {isDownloading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    Download PDF
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="no-print bg-gradient-to-r from-primary-50 via-white to-cyan-50 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-6 text-xs text-slate-500"
            >
              <div><span>Total Sections:</span> <b>{paper?.length || 0}</b></div>
              <div><span>Generated:</span> <b>Yes</b></div>
            </motion.div>
          </div>
        </div>

        <div className="py-8 px-6 max-w-4xl mx-auto">
          {!paper ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-6">
              {paper.map((section: any, idx: number) => (
                <div key={idx}>
                  <h2 className="text-lg font-bold">
                    Section {section.section}
                  </h2>
                  {section.error && (
                    <p className="mt-2 text-sm text-red-500">{section.error}</p>
                  )}

                  <ol className="list-decimal ml-5 mt-2 space-y-1">
                    {section.questions.map((q: string, i: number) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="no-print mt-6 flex items-center justify-center gap-4"
          >
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </button>

            <motion.button
              onClick={handleDownload}
              disabled={isDownloading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold"
            >
              <Download size={14} />
              Download PDF
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
