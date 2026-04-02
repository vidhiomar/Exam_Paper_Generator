'use client';
import { motion } from 'framer-motion';
import {
  Award,
  HelpCircle,
  Gauge,
  Clock,
  BarChart2,
  Target,
} from 'lucide-react';
import { mockInsights } from '@/lib/mockData';

interface InsightCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  accentColor: string;
  bgColor: string;
  delay?: number;
  isLoading?: boolean;
  extra?: React.ReactNode;
}

const InsightCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  accentColor,
  bgColor,
  delay = 0,
  isLoading = false,
  extra,
}: InsightCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    whileHover={{ scale: 1.025, y: -2 }}
    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 cursor-default transition-shadow hover:shadow-md"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2.5 rounded-xl ${bgColor}`}>
        <Icon size={18} className={accentColor} strokeWidth={2} />
      </div>
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
    </div>

    {isLoading ? (
      <div className="space-y-2">
        <div className="skeleton h-8 w-2/3 rounded-lg" />
        <div className="skeleton h-3 w-1/2 rounded-lg" />
      </div>
    ) : (
      <>
        <p className={`text-3xl font-bold tracking-tight ${accentColor}`}>{value}</p>
        {subtext && <p className="text-xs text-slate-400 mt-1.5">{subtext}</p>}
        {extra}
      </>
    )}
  </motion.div>
);

const DifficultyBar = ({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) => (
  <div className="flex items-center gap-2 mt-1.5">
    <span className="text-xs text-slate-400 w-10">{label}</span>
    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
      />
    </div>
    <span className="text-xs font-semibold text-slate-500 w-8 text-right">{pct}%</span>
  </div>
);

interface InsightCardsProps {
  isLoading?: boolean;
}

export default function InsightCards({ isLoading = false }: InsightCardsProps) {
  const { totalMarks, totalQuestions, difficulty, difficultyBreakdown, estimatedTime, coverage } =
    mockInsights;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <InsightCard
        icon={Award}
        label="Total Marks"
        value={totalMarks}
        subtext="Full mark examination"
        accentColor="text-primary-600"
        bgColor="bg-primary-50"
        delay={0.1}
        isLoading={isLoading}
      />
      <InsightCard
        icon={HelpCircle}
        label="Questions"
        value={totalQuestions}
        subtext="Across 3 sections"
        accentColor="text-blue-600"
        bgColor="bg-blue-50"
        delay={0.18}
        isLoading={isLoading}
      />
      <InsightCard
        icon={Gauge}
        label="Difficulty"
        value={difficulty}
        accentColor="text-amber-600"
        bgColor="bg-amber-50"
        delay={0.26}
        isLoading={isLoading}
        extra={
          <div className="mt-2">
            <DifficultyBar label="Easy" pct={difficultyBreakdown.easy} color="bg-emerald-400" />
            <DifficultyBar label="Med" pct={difficultyBreakdown.medium} color="bg-amber-400" />
            <DifficultyBar label="Hard" pct={difficultyBreakdown.hard} color="bg-red-400" />
          </div>
        }
      />
      <InsightCard
        icon={Clock}
        label="Est. Duration"
        value={estimatedTime}
        subtext="Recommended exam time"
        accentColor="text-violet-600"
        bgColor="bg-violet-50"
        delay={0.34}
        isLoading={isLoading}
      />
      <InsightCard
        icon={BarChart2}
        label="Avg Marks/Q"
        value={mockInsights.avgMarksPerQuestion}
        subtext="Per question allocation"
        accentColor="text-cyan-600"
        bgColor="bg-cyan-50"
        delay={0.42}
        isLoading={isLoading}
      />
      <InsightCard
        icon={Target}
        label="Syllabus Cover"
        value={`${coverage}%`}
        subtext="Topics from blueprint"
        accentColor="text-emerald-600"
        bgColor="bg-emerald-50"
        delay={0.5}
        isLoading={isLoading}
        extra={
          <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${coverage}%` }}
              transition={{ delay: 0.8, duration: 0.7, ease: 'easeOut' }}
            />
          </div>
        }
      />
    </div>
  );
}
