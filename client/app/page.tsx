'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Upload, FileText, X, Sparkles, ArrowRight,
  Brain, Zap, ShieldCheck, Layers,
  CheckCircle2, ScanLine, ChevronRight,
} from 'lucide-react';
import { uploadPDF } from '@/lib/api';

/* ─── helpers ─────────────────────────────────────────────────────── */
function cn(...cls: (string | boolean | undefined)[]) {
  return cls.filter(Boolean).join(' ');
}

/* ─── data ────────────────────────────────────────────────────────── */
const STEPS = [
  { n: '01', label: 'Upload Paper' },
  { n: '02', label: 'AI Analysis' },
  { n: '03', label: 'Generate' },
];
const FEATURES = [
  { icon: Brain,       label: 'Blueprint Extraction',  desc: 'Identifies topics, marks & patterns' },
  { icon: Layers,      label: "Bloom's Taxonomy",      desc: 'Maps cognitive difficulty levels'   },
  { icon: ScanLine,    label: 'Deep OCR Parsing',      desc: 'Works on scanned PDFs & images'    },
  { icon: ShieldCheck, label: 'Private & Secure',      desc: 'Never stored after analysis'       },
];
const STATS = [
  { value: '98%',  label: 'Accuracy'  },
  { value: '<3s',  label: 'Analysis'  },
  { value: '50k+', label: 'Papers'    },
];

/* ─── Aurora canvas background ────────────────────────────────────── */
function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    let id: number;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const orbs = [
      { x: 0.15, y: 0.35, r: 0.40, color: '#4f46e5', speed: 0.00018 },
      { x: 0.80, y: 0.20, r: 0.32, color: '#06b6d4', speed: 0.00022 },
      { x: 0.55, y: 0.80, r: 0.28, color: '#7c3aed', speed: 0.00014 },
    ];
    const draw = (t: number) => {
      ctx.clearRect(0, 0, c.width, c.height);
      orbs.forEach(o => {
        const ox = (o.x + Math.sin(t * o.speed) * 0.08) * c.width;
        const oy = (o.y + Math.cos(t * o.speed * 1.4) * 0.06) * c.height;
        const g  = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r * c.width);
        g.addColorStop(0, o.color + '1f');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, c.width, c.height);
      });
      id = requestAnimationFrame(draw);
    };
    id = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ─── Magnetic CTA button ─────────────────────────────────────────── */
function MagneticBtn({ children, onClick, disabled, className }: {
  children: React.ReactNode; onClick: () => void;
  disabled?: boolean; className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx  = useMotionValue(0); const my = useMotionValue(0);
  const sx  = useSpring(mx, { stiffness: 250, damping: 22 });
  const sy  = useSpring(my, { stiffness: 250, damping: 22 });
  const move = (e: React.MouseEvent) => {
    if (disabled) return;
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width  / 2) * 0.22);
    my.set((e.clientY - r.top  - r.height / 2) * 0.22);
  };
  return (
    <motion.button ref={ref} style={{ x: sx, y: sy }}
      onMouseMove={move} onMouseLeave={() => { mx.set(0); my.set(0); }}
      onClick={onClick} disabled={disabled} className={className}>
      {children}
    </motion.button>
  );
}

/* ─── Drop zone ───────────────────────────────────────────────────── */
function DropZone({ file, onFile, onRemove }: {
  file: File | null; onFile: (f: File) => void; onRemove: () => void;
}) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const accept = useCallback((f: File) => {
    if (['application/pdf','image/jpeg','image/png','image/webp'].includes(f.type)) onFile(f);
  }, [onFile]);
  const fmt = (b: number) => b > 1e6 ? `${(b/1e6).toFixed(1)} MB` : `${(b/1024).toFixed(0)} KB`;

  return (
    <AnimatePresence mode="wait">
      {!file ? (
        <motion.label key="dz" htmlFor="fi"
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onDragOver={e => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={e => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) accept(f); }}
          className={cn(
            'group relative flex flex-col items-center justify-center gap-4 w-full min-h-[190px]',
            'rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300',
            over
              ? 'border-indigo-400 bg-indigo-500/10 shadow-[0_0_36px_rgba(99,102,241,0.22)]'
              : 'border-white/10 bg-white/[0.03] hover:border-indigo-500/40 hover:bg-indigo-500/5'
          )}
        >
          {over && (
            <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ boxShadow: '0 0 0 2px rgba(99,102,241,0.5), 0 0 50px rgba(99,102,241,0.12)' }} />
          )}

          <motion.div
            animate={over ? { scale: 1.18, rotate: 6 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            className={cn(
              'p-4 rounded-2xl transition-colors duration-300',
              over
                ? 'bg-indigo-500/20 text-indigo-300'
                : 'bg-white/5 text-slate-500 group-hover:bg-indigo-500/10 group-hover:text-indigo-400'
            )}
          >
            <Upload size={28} strokeWidth={1.5} />
          </motion.div>

          <div className="text-center px-6 space-y-1.5">
            <p className={cn('text-sm font-semibold transition-colors', over ? 'text-indigo-300' : 'text-slate-300')}>
              {over ? 'Release to upload' : 'Drop your exam paper here'}
            </p>
            <p className="text-xs text-slate-600">PDF · JPG · PNG · WEBP &mdash; up to 20 MB</p>
          </div>

          <div className={cn(
            'px-5 py-2 rounded-xl text-xs font-bold border transition-all duration-200',
            over
              ? 'bg-indigo-500 text-white border-indigo-400'
              : 'bg-white/5 text-slate-500 border-white/10 group-hover:bg-indigo-500/15 group-hover:text-indigo-300 group-hover:border-indigo-500/30'
          )}>
            Browse Files
          </div>

          <input ref={inputRef} id="fi" type="file" className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={e => { const f = e.target.files?.[0]; if (f) accept(f); }} />
        </motion.label>
      ) : (
        <motion.div key="prev"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="w-full rounded-2xl border border-emerald-500/25 p-4"
          style={{ background: 'rgba(16,185,129,0.07)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl shrink-0" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <FileText size={20} strokeWidth={1.5} className="text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <CheckCircle2 size={11} className="text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Ready</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">{file.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{fmt(file.size)} · {file.type.split('/')[1].toUpperCase()}</p>
            </div>
            <button onClick={e => { e.preventDefault(); onRemove(); }}
              className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-600 hover:text-red-400 transition-colors">
              <X size={15} />
            </button>
          </div>
          <div className="mt-3.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }}
              initial={{ width: 0 }} animate={{ width: '100%' }}
              transition={{ duration: 0.85, ease: 'easeOut' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── PAGE ────────────────────────────────────────────────────────── */
export default function Home() {
  const router = useRouter();
  const [file,      setFile]      = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [done,      setDone]      = useState(false);

  const handleAnalyze = async () => {
    if (!file || analyzing) return;

    setAnalyzing(true);

    const toastId = toast.loading('Analyzing uploaded paper...', {
      description: 'Extracting blueprint JSON from your exam paper.',
    });

    try {
      const data = await uploadPDF(file);

      if (!data?.blueprint?.sections?.length) {
        throw new Error('No sections were extracted from the uploaded paper.');
      }

      localStorage.setItem('blueprint', JSON.stringify(data.blueprint));
      localStorage.removeItem('generated_paper');

      setDone(true);
      toast.dismiss(toastId);
      toast.success('Blueprint extracted successfully.');

      await new Promise((r) => setTimeout(r, 460));
      router.push('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed.';
      toast.dismiss(toastId);
      toast.error('Analysis failed.', { description: message });
      setDone(false);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      {/* ── FONTS + CUSTOM CSS ─────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        html,body { background:#080c18; margin:0; }
        *  { box-sizing:border-box; -webkit-font-smoothing:antialiased; }
        .sora  { font-family:'Sora',system-ui,sans-serif; }
        .dm    { font-family:'DM Sans',system-ui,sans-serif; }

        /* dot grid */
        .dot-bg {
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* aurora headline */
        .aurora-text {
          background: linear-gradient(120deg, #a5b4fc 0%, #67e8f9 50%, #c4b5fd 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: aurora 5s linear infinite;
        }
        @keyframes aurora { to { background-position: 200% center; } }

        /* card glow border */
        .card-border {
          position:relative; border-radius:24px;
        }
        .card-border::before {
          content:''; position:absolute; inset:-1px; border-radius:25px; z-index:-1;
          background: linear-gradient(130deg,
            rgba(99,102,241,0.55) 0%,
            rgba(6,182,212,0.25)  40%,
            rgba(124,58,237,0.35) 75%,
            rgba(99,102,241,0.55) 100%
          );
        }

        /* CTA button */
        .btn-ai {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #2563eb 100%);
          background-size: 200% auto;
          transition: background-position 0.4s ease, box-shadow 0.3s ease;
          position: relative; overflow: hidden;
        }
        .btn-ai:not(:disabled):hover {
          background-position: right center;
          box-shadow: 0 8px 36px rgba(99,102,241,0.52), 0 0 0 1px rgba(99,102,241,0.32);
        }
        .btn-ai:disabled { opacity: 0.38; cursor: not-allowed; }

        /* shimmer sweep */
        .shimmer::after {
          content:''; position:absolute; inset:0; pointer-events:none;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.13) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: sweep 2.4s linear infinite;
        }
        @keyframes sweep { from{background-position:200% 0} to{background-position:-200% 0} }

        /* stat chip */
        .stat-chip {
          background: rgba(255,255,255,0.032);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; backdrop-filter: blur(8px);
        }

        /* feature tile */
        .feat-tile {
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.057);
          border-radius: 14px;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .feat-tile:hover {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.24);
          transform: translateY(-2px);
        }

        /* glow divider */
        .glow-hr {
          height:1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.55), transparent);
        }

        /* scan animation on analysing */
        @keyframes scanDown {
          0%   { top:-2px; opacity:0; }
          8%   { opacity:1; }
          92%  { opacity:1; }
          100% { top:100%; opacity:0; }
        }
        .scan-bar {
          position:absolute; left:0; right:0; height:2px;
          background: linear-gradient(90deg, transparent, #6366f1 50%, transparent);
          animation: scanDown 1.8s ease-in-out infinite;
          pointer-events:none; z-index:10;
        }
      `}</style>

      <div className="dm relative min-h-screen overflow-x-hidden" style={{ background: '#080c18' }}>

        {/* ── BACKGROUND ────────────────────────────────────────────── */}
        <div className="fixed inset-0 z-0">
          <AuroraCanvas />
          <div className="absolute inset-0 dot-bg" />
          {/* radial vignette */}
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, #080c18 100%)' }} />
        </div>

        {/* ── NAV ───────────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-20 flex items-center justify-between px-8 py-5 max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', boxShadow: '0 0 18px rgba(99,102,241,0.45)' }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="sora text-sm font-bold text-white tracking-tight">
              AI Blueprint<span style={{ color: '#818cf8' }}>.</span>
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {['Docs', 'Pricing', 'About'].map(l => (
              <button key={l}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 rounded-lg hover:bg-white/5 transition-all">
                {l}
              </button>
            ))}
            <button className="ml-2 px-4 py-1.5 rounded-xl text-xs font-bold text-white border border-white/10
              hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all">
              Sign In
            </button>
          </nav>
        </motion.header>

        {/* ── MAIN TWO-COLUMN LAYOUT ────────────────────────────────── */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24 pt-10
          grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-14 items-center
          min-h-[calc(100vh-80px)]">

          {/* ───── LEFT: EDITORIAL ────────────────────────────────── */}
          <div className="space-y-9">

            {/* Live badge */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border"
                style={{ borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.1)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide" style={{ color: '#a5b4fc' }}>
                  AI-Powered Exam Intelligence
                </span>
              </div>
            </motion.div>

            {/* Big headline */}
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }} className="space-y-4">
              <h1 className="sora font-extrabold leading-[1.07] tracking-tight"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
                <span className="text-white">Turn Papers Into</span>
                <br />
                <span className="aurora-text">Smart Blueprints.</span>
              </h1>
              <p className="text-base leading-relaxed max-w-[420px] font-light"
                style={{ color: '#94a3b8' }}>
                Upload any previous exam paper. Our AI dissects the blueprint,
                maps Bloom&apos;s taxonomy, and generates a perfectly calibrated predicted
                paper — in under 3 seconds.
              </p>
            </motion.div>

            {/* Step pipeline */}
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }} className="flex items-center">
              {STEPS.map((s, i) => (
                <div key={s.n} className="flex items-center">
                  <div className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl',
                    i === 0 ? 'border' : ''
                  )}
                    style={i === 0 ? { borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.12)' } : {}}>
                    <span className={cn('sora text-[11px] font-bold tracking-wide',
                      i === 0 ? 'text-indigo-400' : 'text-slate-600')}>{s.n}</span>
                    <span className={cn('text-xs font-medium',
                      i === 0 ? 'text-indigo-300' : 'text-slate-600')}>{s.label}</span>
                  </div>
                  {i < 2 && <ChevronRight size={12} className="mx-1.5" style={{ color: '#334155' }} />}
                </div>
              ))}
            </motion.div>

            {/* Feature grid */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }} className="grid grid-cols-2 gap-3">
              {FEATURES.map(({ icon: Icon, label, desc }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34 + i * 0.07 }}
                  className="feat-tile p-3.5 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg shrink-0 mt-0.5"
                    style={{ background: 'rgba(99,102,241,0.14)', color: '#a5b4fc' }}>
                    <Icon size={13} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#cbd5e1' }}>{label}</p>
                    <p className="text-[11px] mt-0.5 leading-tight" style={{ color: '#475569' }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.52 }} className="flex items-center gap-3">
              {STATS.map(({ value, label }) => (
                <div key={label} className="stat-chip px-4 py-3 text-center">
                  <p className="sora text-xl font-bold text-white">{value}</p>
                  <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wider"
                    style={{ color: '#475569' }}>{label}</p>
                </div>
              ))}
              <div className="ml-1 text-xs leading-snug" style={{ color: '#475569' }}>
                Trusted by<br />
                <span className="font-semibold" style={{ color: '#94a3b8' }}>12,000+ students</span>
              </div>
            </motion.div>
          </div>

          {/* ───── RIGHT: UPLOAD CARD ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 28, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="card-border">
              <div className="rounded-[23px] overflow-hidden"
                style={{ background: 'rgba(10,14,26,0.93)', backdropFilter: 'blur(28px)' }}>

                {/* Titlebar */}
                <div className="px-6 py-4 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg" style={{ background: 'rgba(99,102,241,0.15)' }}>
                      <Sparkles size={13} style={{ color: '#a5b4fc' }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#94a3b8' }}>
                      EXAM PAPER ANALYZER
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {['#ef4444','#f59e0b','#10b981'].map(c => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full opacity-60"
                        style={{ background: c }} />
                    ))}
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Label row */}
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: '#475569' }}>Upload Document</p>
                    <span className="text-[10px] font-medium" style={{ color: '#334155' }}>
                      Step 1 of 3
                    </span>
                  </div>

                  {/* Drop zone wrapper */}
                  <div className="relative">
                    {analyzing && !done && <div className="scan-bar" />}
                    <DropZone file={file} onFile={setFile} onRemove={() => setFile(null)} />
                  </div>

                  {/* Supported formats */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px]" style={{ color: '#334155' }}>Supports:</span>
                    {['pdf','jpg','png','webp'].map(f => (
                      <span key={f} className="px-2 py-0.5 rounded-md font-mono text-[10px]"
                        style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', color: '#475569' }}>
                        .{f}
                      </span>
                    ))}
                  </div>

                  {/* Glow divider */}
                  <div className="glow-hr" />

                  {/* CTA */}
                  <MagneticBtn
                    onClick={handleAnalyze}
                    disabled={!file || analyzing}
                    className={cn(
                      'btn-ai w-full py-4 rounded-2xl text-sm font-bold tracking-wide text-white',
                      'flex items-center justify-center gap-3',
                      file && !analyzing ? 'shimmer' : undefined
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {done ? (
                        <motion.span key="d" initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                          className="flex items-center gap-2">
                          <CheckCircle2 size={16} /> Redirecting…
                        </motion.span>
                      ) : analyzing ? (
                        <motion.span key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex items-center gap-2.5">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                          </svg>
                          Analyzing Blueprint…
                        </motion.span>
                      ) : (
                        <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex items-center gap-2.5">
                          <ScanLine size={16} />
                          Analyze Paper
                          <ArrowRight size={15} className="opacity-70" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </MagneticBtn>

                  {/* Trust line */}
                  <div className="flex items-center justify-center gap-2.5 pt-0.5">
                    <ShieldCheck size={11} style={{ color: '#334155' }} />
                    <span className="text-[11px]" style={{ color: '#334155' }}>
                      No account required · Files never stored · 100% private
                    </span>
                  </div>
                </div>

                {/* Live footer */}
                <div className="px-6 py-3 flex items-center justify-between"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: '#475569' }}>AI Engine Online</span>
                  </div>
                  <span className="text-[10px]" style={{ color: '#1e293b' }}>v2.4.1</span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62 }}
              className="mt-4 flex items-center justify-center gap-5">
              {['GDPR Compliant', 'SOC 2 Ready', 'Zero Data Logs'].map(b => (
                <div key={b} className="flex items-center gap-1.5">
                  <CheckCircle2 size={10} style={{ color: '#10b981' }} />
                  <span className="text-[10px] font-medium" style={{ color: '#334155' }}>{b}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── BOTTOM EDGE GLOW ──────────────────────────────────────── */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[560px] h-px z-0"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)' }} />
      </div>
    </>
  );
}
