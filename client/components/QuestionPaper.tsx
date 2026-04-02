'use client';
import { motion } from 'framer-motion';
import { mockGeneratedPaper, paperMeta, GeneratedQuestion } from '@/lib/mockData';

const DiffBadge = ({ d }: { d: GeneratedQuestion['difficulty'] }) => {
  const c = { Easy: 'text-emerald-600', Medium: 'text-amber-600', Hard: 'text-red-500' }[d];
  return <span className={`text-[10px] font-bold uppercase tracking-wider ${c} ml-2`}>[{d}]</span>;
};

const sectionTitles: Record<string, { title: string; desc: string }> = {
  A: { title: 'Section A — Short Answer Questions', desc: 'Answer all questions. (2 marks each)' },
  B: { title: 'Section B — Application Questions', desc: 'Answer all questions. (5 marks each)' },
  C: { title: 'Section C — Long Answer Questions', desc: 'Answer all questions. (10 marks each)' },
};

export default function QuestionPaper() {
  const sections = ['A', 'B', 'C'];
  const grouped = sections.reduce<Record<string, GeneratedQuestion[]>>((acc, s) => {
    acc[s] = mockGeneratedPaper.filter((q) => q.section === s);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      {/* Paper card */}
      <div
        id="exam-paper"
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print-page"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary px-8 py-7 text-white">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200 mb-1">
              {paperMeta.institution}
            </p>
            <p className="text-sm text-primary-100 mb-3">{paperMeta.department}</p>
            <h1 className="text-xl font-bold tracking-tight">{paperMeta.exam}</h1>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4 text-center">
            {[
              ['Subject', paperMeta.subject],
              ['Code', paperMeta.subjectCode],
              ['Semester', paperMeta.semester],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-xs text-primary-300 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-primary-300 text-xs">Max Marks:</span>
              <span className="font-bold">{paperMeta.maxMarks}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-primary-300 text-xs">Time Allowed:</span>
              <span className="font-bold">{paperMeta.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-primary-300 text-xs">Date:</span>
              <span className="font-bold">{paperMeta.date}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mx-6 mt-5 mb-1 rounded-xl bg-amber-50 border border-amber-100 px-5 py-4">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
            General Instructions
          </p>
          <ol className="space-y-1">
            {paperMeta.instructions.map((inst, i) => (
              <li key={i} className="text-xs text-amber-800 flex gap-2">
                <span className="font-bold shrink-0">{i + 1}.</span>
                {inst}
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        <div className="p-6 space-y-8">
          {sections.map((sec, si) => (
            <motion.div
              key={sec}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.12, duration: 0.35 }}
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{sec}</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">{sectionTitles[sec].title}</h2>
                  <p className="text-xs text-slate-400">{sectionTitles[sec].desc}</p>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {grouped[sec].map((q, qi) => (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/40 p-4 hover:bg-slate-50 transition-colors"
                  >
                    {/* Question header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xs font-bold text-primary-600 shrink-0">Q{q.number}.</span>
                          <p className="text-sm text-slate-800 leading-relaxed">
                            {q.text}
                            <DiffBadge d={q.difficulty} />
                          </p>
                        </div>

                        {/* Sub-parts */}
                        {q.subparts && (
                          <div className="mt-3 ml-5 space-y-2">
                            {q.subparts.map((sp) => (
                              <div key={sp.label} className="flex items-start justify-between gap-3">
                                <p className="text-sm text-slate-700">
                                  <span className="font-semibold text-slate-500 mr-1.5">{sp.label}</span>
                                  {sp.text}
                                </p>
                                <span className="shrink-0 text-xs font-bold text-slate-400">
                                  [{sp.marks}M]
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Marks badge */}
                      <div className="shrink-0 flex flex-col items-end">
                        <div className="px-2.5 py-1 rounded-lg bg-primary-50 border border-primary-100">
                          <span className="text-xs font-bold text-primary-700">{q.marks} Marks</span>
                        </div>
                        <span className="text-xs text-slate-400 mt-1">{q.topic}</span>
                      </div>
                    </div>

                    {/* Answer lines for section A */}
                    {sec === 'A' && (
                      <div className="mt-4 space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-px bg-slate-200 w-full" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {sec !== 'C' && <div className="mt-6 border-t border-dashed border-slate-200" />}
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-5 py-3 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              *** End of Question Paper ***
            </p>
            <p className="text-xs font-semibold text-slate-500">
              AI Generated · {paperMeta.subjectCode}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
