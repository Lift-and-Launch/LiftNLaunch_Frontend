import React, { useEffect, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  ClipboardList,
  Stethoscope,
  Kanban,
  MessageSquare,
  Layers,
  FolderKanban,
  X,
  AlertCircle,
} from 'lucide-react';

const NAV = [
  { path: '', label: 'Home', icon: Home, end: true },
  { path: '/intake', label: 'Intake', icon: ClipboardList },
  { path: '/diagnosis', label: 'Diagnosis', icon: Stethoscope },
  { path: '/plan', label: 'Plan', icon: Kanban },
  { path: '/chat', label: 'Coach Chat', icon: MessageSquare },
  { path: '/domains', label: 'Domains', icon: Layers },
  { path: '/workspace', label: 'Workspace', icon: FolderKanban },
];

export const coachBtn =
  'cursor-pointer transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:shadow-none';

/** Clickable cards / list rows in coach UI */
export const coachCard =
  `${coachBtn} hover:border-yellow-300 hover:shadow-md hover:-translate-y-0.5`;

/** Text / nav links */
export const coachLink =
  `${coachBtn} hover:text-yellow-700`;

/**
 * Guards async loads against StrictMode double-mount and fast route changes.
 * Return `guard.cancel` from useEffect cleanup; skip setState when `guard.cancelled`.
 */
export function createRequestGuard() {
  let cancelled = false;
  return {
    get cancelled() {
      return cancelled;
    },
    cancel() {
      cancelled = true;
    },
  };
}

export function scrollCoachToTop() {
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const main = document.getElementById('coach-case-content');
  if (main) {
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function StatusBadge({ status }) {
  const styles = {
    draft: 'bg-gray-100 text-gray-600',
    intake: 'bg-blue-50 text-blue-700',
    diagnosed: 'bg-purple-50 text-purple-700',
    active: 'bg-emerald-50 text-emerald-700',
    paused: 'bg-amber-50 text-amber-700',
    closed: 'bg-rose-50 text-rose-700',
  };
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        styles[status] || styles.draft
      }`}
    >
      {status || 'draft'}
    </span>
  );
}

export function AiDisclosure({ className = '' }) {
  return (
    <p className={`text-xs font-bold text-gray-400 leading-relaxed ${className}`}>
      AI-assisted coaching. Insights are generated to support your judgment — not
      a substitute for licensed advice. Review before acting.
    </p>
  );
}

export function CoachCaseShell({ title, status, children, actions, fillHeight = false }) {
  const { caseId } = useParams();
  const location = useLocation();
  const base = `/dashboard/coach/cases/${caseId}`;

  const isActive = (item) => {
    const full = `${base}${item.path}`;
    if (item.end) return location.pathname === base || location.pathname === `${base}/`;
    return location.pathname.startsWith(full);
  };

  return (
    <div
      className={`bg-gradient-to-b from-gray-50 via-white to-white ${
        fillHeight ? 'h-full min-h-0 flex flex-col overflow-hidden' : 'min-h-screen'
      }`}
    >
      <div
        className={`border-b border-gray-100/80 bg-white/80 backdrop-blur-md z-30 shrink-0 ${
          fillHeight ? '' : 'sticky top-0'
        }`}
      >
        <div className={`max-w-6xl mx-auto px-6 space-y-3 ${fillHeight ? 'py-3' : 'py-5 space-y-4'}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link
                to="/dashboard/coach"
                className={`${coachBtn} inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-800 ${
                  fillHeight ? 'mb-1.5' : 'mb-3'
                }`}
              >
                <ArrowLeft size={14} /> All cases
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <h1
                  className={`font-black text-gray-900 tracking-tight ${
                    fillHeight ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'
                  }`}
                >
                  {title || 'Business Case'}
                </h1>
                <StatusBadge status={status} />
              </div>
            </div>
            {actions && (
              <div className="flex flex-wrap gap-2 animate-[fadeIn_0.4s_ease-out]">
                {actions}
              </div>
            )}
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-thin">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.path || 'home'}
                  to={`${base}${item.path}`}
                  className={`${coachBtn} inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${
                    active
                      ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/30'
                      : 'bg-white text-gray-500 border border-gray-100 hover:border-yellow-300 hover:text-gray-800 hover:shadow-sm'
                  }`}
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div
        id="coach-case-content"
        className={`max-w-6xl mx-auto px-4 sm:px-6 w-full ${
          fillHeight
            ? 'flex-1 min-h-0 overflow-hidden flex flex-col py-3'
            : 'py-8'
        }`}
      >
        {children}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

export function LoadingBlock({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
        {label}
      </p>
    </div>
  );
}

export function ErrorBox({ error, onDismiss }) {
  const ref = useRef(null);
  const message = typeof error === 'string' ? error : error?.message;

  useEffect(() => {
    if (!error) return;
    scrollCoachToTop();
    // Ensure the banner itself is visible after layout
    const t = window.setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
    return () => window.clearTimeout(t);
  }, [error, message]);

  if (!error) return null;

  return (
    <div
      ref={ref}
      role="alert"
      className="mb-6 p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 shadow-sm animate-[shakeX_0.4s_ease-out]"
    >
      <div className="flex justify-between gap-3 items-start">
        <div className="flex gap-3 min-w-0">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
          <p className="font-bold text-sm leading-relaxed">{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={`${coachBtn} p-1.5 rounded-lg hover:bg-red-100 text-red-500 shrink-0`}
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {error?.details?.missingFields?.length > 0 && (
        <ul className="mt-3 ml-7 text-xs font-medium space-y-1">
          {error.details.missingFields.map((f) => (
            <li key={f.key || f.label}>• {f.label || f.key}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function InfoBanner({ children, tone = 'amber' }) {
  const tones = {
    amber: 'bg-amber-50 border-amber-100 text-amber-800',
    green: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
  };
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-bold animate-[fadeIn_0.3s_ease-out] ${tones[tone]}`}>
      {children}
    </div>
  );
}
