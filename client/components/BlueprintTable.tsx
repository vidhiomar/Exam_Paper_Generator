'use client';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp } from 'lucide-react';
import { mockBlueprintData, BlueprintRow } from '@/lib/mockData';

const DifficultyBadge = ({ level }: { level: BlueprintRow['difficulty'] }) => {
  const styles = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Hard: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[level]}`}>
      {level}
    </span>
  );
};

const BloomsChip = ({ level }: { level: string }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
    {level}
  </span>
);

const SkeletonRow = () => (
  <tr className="border-b border-slate-50">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="skeleton h-4 rounded-lg" style={{ width: `${[70, 50, 30, 30, 50, 40][i]}%` }} />
      </td>
    ))}
  </tr>
);

interface BlueprintTableProps {
  isLoading?: boolean;
}

export default function BlueprintTable({ isLoading = false }: BlueprintTableProps) {
  const totalMarks = mockBlueprintData.reduce((a, r) => a + r.marks, 0);
  const totalQs = mockBlueprintData.reduce((a, r) => a + r.questions, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-50">
            <BookOpen size={17} className="text-primary-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">Blueprint Analysis</h2>
            <p className="text-xs text-slate-400 mt-0.5">Extracted from your exam paper</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <TrendingUp size={12} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">{totalQs} Questions</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 border border-primary-100">
            <span className="text-xs font-semibold text-primary-600">{totalMarks} Total Marks</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-50">
              {['Topic', 'Sub-topic', 'Questions', 'Marks', "Bloom's Level", 'Difficulty'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              : mockBlueprintData.map((row, idx) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07, duration: 0.35 }}
                    className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-slate-800">{row.topic}</span>
                      <div className="text-xs text-slate-400 mt-0.5">{row.chapter}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{row.subtopic}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(row.questions)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-300" />
                          ))}
                        </div>
                        <span className="text-sm text-slate-700 font-medium">{row.questions}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-slate-800">{row.marks}</span>
                      <span className="text-xs text-slate-400 ml-1">pts</span>
                    </td>
                    <td className="px-5 py-4">
                      <BloomsChip level={row.bloomsLevel} />
                    </td>
                    <td className="px-5 py-4">
                      <DifficultyBadge level={row.difficulty} />
                    </td>
                  </motion.tr>
                ))}
          </tbody>

          {/* Footer totals */}
          {!isLoading && (
            <tfoot>
              <tr className="bg-slate-50/80">
                <td className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider" colSpan={2}>
                  Total
                </td>
                <td className="px-5 py-3 text-sm font-bold text-slate-700">{totalQs}</td>
                <td className="px-5 py-3 text-sm font-bold text-primary-600">{totalMarks}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </motion.div>
  );
}
