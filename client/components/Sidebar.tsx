'use client';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  FileText,
  Settings,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

const navItems = [
  { icon: Upload, label: 'Upload', href: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Paper', href: '/paper' },
];

const bottomItems = [
  { icon: HelpCircle, label: 'Help' },
  { icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-5 bg-white border-r border-slate-100 z-40"
      style={{ boxShadow: '1px 0 8px rgba(0,0,0,0.04)' }}
    >
      {/* Logo */}
      <div className="mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-secondary flex items-center justify-center shadow-md">
          <Sparkles size={17} className="text-white" strokeWidth={2} />
        </div>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-slate-100 mb-4" />

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              title={label}
              className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                ${active
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 rounded-xl bg-primary-50"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} className="relative z-10" />
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-600 rounded-r-full -ml-px" />
              )}

              {/* Tooltip */}
              <span className="absolute left-14 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-lg
                opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap font-medium">
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="flex flex-col items-center gap-1 mb-2">
        {bottomItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={label}
            className="group relative w-10 h-10 rounded-xl flex items-center justify-center
              text-slate-300 hover:bg-slate-50 hover:text-slate-500 transition-all duration-200"
          >
            <Icon size={17} strokeWidth={1.8} />
            <span className="absolute left-14 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-lg
              opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap font-medium">
              {label}
            </span>
          </button>
        ))}

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary flex items-center justify-center mt-2">
          <span className="text-xs font-bold text-white">VD</span>
        </div>
      </div>
    </motion.aside>
  );
}
