'use client';
import { useState } from 'react';
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
import QuestionPaper from '@/components/QuestionPaper';

export default function PaperPage() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

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
        {/* Top bar */}
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
              {/* Confidence badge */}
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
                className={`ripple flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold
                  transition-all duration-300 shadow-md
                  ${isDownloading
                    ? 'bg-primary-400 cursor-not-allowed text-white/70'
                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200'
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

        {/* Stats bar */}
        <div className="no-print bg-gradient-to-r from-primary-50 via-white to-cyan-50 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-6 text-xs text-slate-500"
            >
              {[
                ['Total Marks', '100'],
                ['Questions', '11'],
                ['Sections', '3 (A, B, C)'],
                ['Duration', '3 Hours'],
                ['Difficulty', 'Moderate'],
                ['Blueprint Match', '97%'],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-slate-400">{label}:</span>
                  <span className="font-bold text-slate-700">{val}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Paper */}
        <div className="py-8 px-6 max-w-4xl mx-auto">
          <QuestionPaper />

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="no-print mt-6 flex items-center justify-center gap-4"
          >
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </button>
            <motion.button
              onClick={handleDownload}
              disabled={isDownloading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="ripple flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary text-white text-sm font-bold shadow-lg shadow-primary-200 hover:shadow-xl transition-all"
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
