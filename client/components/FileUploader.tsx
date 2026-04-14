'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { uploadPDF } from '@/lib/api';

interface FileUploaderProps {
  onFileAccepted: (data: any) => void; // 🔥 now sends blueprint
}

export default function FileUploader({ onFileAccepted }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE_MB = 20;

  // -----------------------------
  // HANDLE FILE + API CALL
  // -----------------------------
  const handleFile = async (f: File) => {
    setError(null);

    // Validation
    if (!ACCEPTED.includes(f.type)) {
      setError('Please upload a PDF or image file (JPG, PNG, WEBP).');
      return;
    }

    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setFile(f);
    setLoading(true);

    try {
      const data = await uploadPDF(f); // 🔥 Backend call
      onFileAccepted(data);            // 🔥 Send blueprint to parent
    } catch (err) {
      setError('Upload failed. Please try again.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // DRAG & DROP HANDLERS
  // -----------------------------
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  // -----------------------------
  // FORMAT FILE SIZE
  // -----------------------------
  const formatSize = (bytes: number) =>
    bytes > 1024 * 1024
      ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(0)} KB`;

  return (
    <div className="w-full space-y-4">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.label
            key="dropzone"
            htmlFor="file-input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`group relative flex flex-col items-center justify-center gap-5 w-full
              min-h-[220px] rounded-2xl border-2 border-dashed cursor-pointer
              transition-all duration-300
              ${
                isDragging
                  ? 'border-primary-600 bg-primary-50 shadow-glow'
                  : 'border-slate-200 bg-white/60 hover:border-primary-400 hover:bg-primary-50/40'
              }`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isDragging && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary-500 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ boxShadow: '0 0 0 4px rgba(79,70,229,0.12)' }}
              />
            )}

            <motion.div
              animate={isDragging ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`p-4 rounded-2xl transition-colors duration-300
                ${
                  isDragging
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600'
                }`}
            >
              <Upload size={32} strokeWidth={1.5} />
            </motion.div>

            <div className="text-center space-y-1.5 px-4">
              <p className="text-sm font-semibold text-slate-700">
                {isDragging ? 'Drop your file here' : 'Drop your exam paper here'}
              </p>
              <p className="text-xs text-slate-400">
                PDF, JPG, PNG, WEBP — up to {MAX_SIZE_MB}MB
              </p>
            </div>

            <div
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${
                isDragging
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-primary-600 group-hover:text-white'
              }`}
            >
              Browse Files
            </div>

            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={onInputChange}
            />
          </motion.label>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
                <FileText size={22} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600 uppercase">
                    {loading ? 'Uploading...' : 'File Ready'}
                  </span>
                </div>

                <p className="mt-1 text-sm font-semibold text-slate-800 truncate">
                  {file.name}
                </p>

                <p className="text-xs text-slate-400 mt-0.5">
                  {formatSize(file.size)} · {file.type.split('/')[1].toUpperCase()}
                </p>
              </div>

              <button
                onClick={() => setFile(null)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-400"
              >
                <X size={16} />
              </button>
            </div>

            {/* Loading bar */}
            <div className="mt-4 h-1.5 rounded-full bg-emerald-200 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                initial={{ width: '0%' }}
                animate={{ width: loading ? '70%' : '100%' }}
                transition={{ duration: 0.8 }}
              />
            </div>

            {/* Spinner */}
            {loading && (
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="animate-spin" size={16} />
                Processing PDF...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200"
          >
            <AlertCircle size={15} className="text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}