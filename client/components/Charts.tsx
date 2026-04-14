'use client';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { PieDatum, BarDatum } from '@/lib/exam-data';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 shadow-lg rounded-xl px-3.5 py-2.5">
      <p className="text-xs font-bold text-slate-800">{payload[0].name}</p>
      <p className="text-xs text-slate-500 mt-0.5">
        <span className="font-semibold text-primary-600">{payload[0].value}</span>{' '}
        {payload[0].name === 'value' ? 'marks' : payload[0].unit || ''}
      </p>
    </div>
  );
};

const CustomLegend = ({ pieData }: { pieData: PieDatum[] }) => (
  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center">
    {pieData.map((entry) => (
      <div key={entry.name} className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
        <span className="text-xs text-slate-500">{entry.name}</span>
      </div>
    ))}
  </div>
);

const SkeletonChart = ({ height = 220 }: { height?: number }) => (
  <div className={`skeleton rounded-xl w-full`} style={{ height }} />
);

interface ChartsProps {
  isLoading?: boolean;
  pieData: PieDatum[];
  barData: BarDatum[];
}

export default function Charts({ isLoading = false, pieData, barData }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Pie chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.45 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary-50">
            <PieIcon size={16} className="text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Marks Distribution</h3>
            <p className="text-xs text-slate-400">By topic area</p>
          </div>
        </div>

        {isLoading ? (
          <SkeletonChart height={220} />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={800}
                >
                  {pieData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={entry.color}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <CustomLegend pieData={pieData} />
          </>
        )}
      </motion.div>

      {/* Bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.45 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-cyan-50">
            <BarChart2 size={16} className="text-cyan-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Topic Frequency</h3>
            <p className="text-xs text-slate-400">Questions &amp; marks per topic</p>
          </div>
        </div>

        {isLoading ? (
          <SkeletonChart height={220} />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={barData}
              barCategoryGap="30%"
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="topic"
                tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'DM Sans' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-white border border-slate-100 shadow-lg rounded-xl px-3.5 py-2.5">
                      <p className="text-xs font-bold text-slate-800 mb-1">{label}</p>
                      {payload.map((p: any) => (
                        <p key={p.dataKey} className="text-xs text-slate-500">
                          <span className="font-semibold" style={{ color: p.fill }}>
                            {p.value}
                          </span>{' '}
                          {p.dataKey}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Bar dataKey="frequency" fill="#4F46E5" radius={[6, 6, 0, 0]} animationDuration={900} />
              <Bar dataKey="marks" fill="#06B6D4" radius={[6, 6, 0, 0]} animationDuration={900} animationBegin={200} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 12, fontFamily: 'DM Sans', color: '#94a3b8' }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
}
