import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ClipboardList,
  Stethoscope,
  Kanban,
  MessageSquare,
  Layers,
  Clock,
  FolderKanban,
  LifeBuoy,
  X,
  Loader2,
  Send,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { canDeleteCoachCase } from '../../utils/roles';
import { coachApi, parseCoachError } from '../../api/coach';
import {
  LoadingBlock,
  ErrorBox,
  AiDisclosure,
  coachBtn,
  coachCard,
  createRequestGuard,
} from '../../components/coach/CoachShared';
import { useCoachCase } from '../../context/CoachCaseContext';
import Seo from '../../seo/Seo';

const SHORTCUTS = [
  { to: 'intake', label: 'Intake', desc: 'Adaptive business assessment', icon: ClipboardList },
  { to: 'diagnosis', label: 'Diagnosis', desc: 'Strengths, risks & needs', icon: Stethoscope },
  { to: 'plan', label: 'Plan & Actions', desc: 'Objectives and checklist', icon: Kanban },
  { to: 'chat', label: 'Coach Chat', desc: 'Case-aware AI coaching', icon: MessageSquare },
  { to: 'domains', label: 'Domains', desc: 'Strategy, finance, pitch…', icon: Layers },
  { to: 'workspace', label: 'Workspace', desc: 'Docs, outcomes, licensing', icon: FolderKanban },
];

const ESCALATE_PRESETS = [
  'Need help prioritizing next steps',
  'Stuck on pricing or revenue model',
  'Want a second opinion on diagnosis',
  'Ready for a live coaching session',
];

function pickNumeric(...candidates) {
  for (const value of candidates) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

/** Flatten API dashboard fields that may be nested objects into a display string. */
function formatDashboardMetric(raw, { asPercent = false } = {}) {
  if (raw == null || raw === '') return '—';

  let num = pickNumeric(raw);
  if (num == null && typeof raw === 'object') {
    num = pickNumeric(
      raw.percent,
      raw.percentage,
      raw.completionPercent,
      raw.value,
      raw.count,
      raw.total,
      raw.open,
      raw.score,
      raw.progress,
      raw.completion?.percent,
      raw.completion?.percentage
    );
  }

  if (num == null) return '—';

  const rounded = Math.round(num);
  return asPercent ? `${rounded}%` : String(rounded);
}

function EscalateCoachModal({ open, reason, setReason, submitting, error, onClose, onSubmit }) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="escalate-coach-title"
        className="w-full max-w-lg rounded-[2rem] bg-white shadow-2xl border border-gray-100 overflow-hidden animate-[fadeInUp_0.3s_ease-out]"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500" />
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0 shadow-inner">
                <LifeBuoy size={22} />
              </div>
              <div>
                <h2 id="escalate-coach-title" className="text-xl font-black text-gray-900 tracking-tight">
                  Request human coach
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">
                  A Lift & Launch coach will review your case and follow up. Add context if you’d like.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className={`${coachBtn} p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700`}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Quick reasons
            </p>
            <div className="flex flex-wrap gap-2">
              {ESCALATE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  disabled={submitting}
                  onClick={() => setReason(preset)}
                  className={`${coachBtn} px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    reason === preset
                      ? 'bg-yellow-400 border-yellow-400 text-black'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-yellow-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="escalate-reason"
              className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2"
            >
              Details (optional)
            </label>
            <textarea
              id="escalate-reason"
              rows={4}
              value={reason}
              disabled={submitting}
              onChange={(e) => setReason(e.target.value)}
              placeholder="What would you like help with?"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 outline-none font-medium text-sm text-gray-900 placeholder:text-gray-400 resize-none transition-all"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitting}
              className={`${coachBtn} inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-black uppercase tracking-widest shadow-md shadow-yellow-400/20`}
            >
              {submitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
              {submitting ? 'Sending…' : 'Send request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className={`${coachBtn} px-5 py-3 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function DeleteCaseConfirmModal({ open, title, deleting, error, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !deleting) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl border border-gray-100">
        <h3 className="text-lg font-black text-gray-900 mb-2">Delete this case?</h3>
        <p className="text-sm font-medium text-gray-600">
          <span className="font-black text-gray-900">{title || 'Untitled case'}</span> will be
          removed permanently from your workspace.
        </p>
        {error && (
          <p className="mt-4 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className={`${coachBtn} inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest`}
          >
            {deleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className={`${coachBtn} px-5 py-3 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-500`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoachCaseHome() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canDelete = canDeleteCoachCase(user);
  const { setCaseMeta, setHeaderActions, refreshCase } = useCoachCase();
  const [payload, setPayload] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState('');
  const [escalating, setEscalating] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');
  const [escalateError, setEscalateError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const load = useCallback(async (isActive = () => true) => {
    setLoading(true);
    setError(null);
    try {
      const [caseRes, timelineRes, dashRes] = await Promise.all([
        coachApi.getCase(caseId),
        coachApi.getTimeline(caseId).catch(() => ({ data: [] })),
        coachApi.getFounderDashboard(caseId).catch(() => null),
      ]);
      if (!isActive()) return;
      setPayload(caseRes.data);
      setCaseMeta(caseRes.data);
      setTimeline(Array.isArray(timelineRes.data) ? timelineRes.data : []);
      setDashboard(dashRes?.data || null);
    } catch (err) {
      if (!isActive()) return;
      setError(parseCoachError(err, 'Failed to load case'));
    } finally {
      if (isActive()) setLoading(false);
    }
  }, [caseId, setCaseMeta]);

  useEffect(() => {
    const guard = createRequestGuard();
    load(() => !guard.cancelled);
    return () => guard.cancel();
  }, [load]);

  const openEscalate = useCallback(() => {
    setEscalateError('');
    setEscalateReason('');
    setEscalateOpen(true);
  }, []);

  const closeEscalate = () => {
    if (escalating) return;
    setEscalateOpen(false);
    setEscalateError('');
  };

  const openDelete = useCallback(() => {
    setDeleteError('');
    setDeleteOpen(true);
  }, []);

  useEffect(() => {
    setHeaderActions(
      <button
        type="button"
        onClick={openEscalate}
        disabled={escalating}
        className={`${coachBtn} inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-800 text-xs font-black uppercase tracking-widest hover:bg-yellow-100 hover:border-yellow-300 shadow-sm`}
      >
        {escalating ? <Loader2 className="animate-spin" size={14} /> : <LifeBuoy size={14} />}
        Request human coach
      </button>
    );
    return () => setHeaderActions(null);
  }, [setHeaderActions, escalating, openEscalate]);

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await coachApi.deleteCase(caseId);
      navigate('/dashboard/coach', { replace: true });
    } catch (err) {
      setDeleteError(parseCoachError(err, 'Could not delete case').message);
    } finally {
      setDeleting(false);
    }
  };

  const submitEscalate = async () => {
    setEscalating(true);
    setEscalateError('');
    setError(null);
    try {
      const trimmed = escalateReason.trim();
      await coachApi.escalateCase(caseId, { reason: trimmed || undefined });
      setEscalateOpen(false);
      setEscalateReason('');
      setInfo('Request sent. A human coach will follow up on your case.');
      await load();
      await refreshCase();
    } catch (err) {
      const parsed = parseCoachError(err, 'Could not send request');
      setEscalateError(parsed.message);
    } finally {
      setEscalating(false);
    }
  };

  const businessCase = payload?.case || payload;
  const profile = payload?.profile;

  if (loading) {
    return <LoadingBlock label="Loading case" />;
  }

  return (
    <>
      <Seo title={`${businessCase?.title || 'Case'} | Business Coach`} path={`/dashboard/coach/cases/${caseId}`} noindex />
      <EscalateCoachModal
        open={escalateOpen}
        reason={escalateReason}
        setReason={setEscalateReason}
        submitting={escalating}
        error={escalateError}
        onClose={closeEscalate}
        onSubmit={submitEscalate}
      />
      <DeleteCaseConfirmModal
        open={deleteOpen}
        title={businessCase?.title}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          if (deleting) return;
          setDeleteOpen(false);
          setDeleteError('');
        }}
        onConfirm={confirmDelete}
      />
        <ErrorBox error={error} onDismiss={() => setError(null)} />
        {info && (
          <p className="mb-6 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
            <CheckCircle2 size={16} className="shrink-0" /> {info}
          </p>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {dashboard && (
              <section className="p-6 rounded-[2rem] border border-yellow-100 bg-yellow-50/40 grid sm:grid-cols-3 gap-4">
                {[
                  {
                    label: 'Progress',
                    value: formatDashboardMetric(
                      dashboard.progressPercent ??
                        dashboard.completionPercent ??
                        dashboard.progress?.percent ??
                        dashboard.progress?.completionPercent ??
                        dashboard.progress?.value ??
                        dashboard.progress?.completion?.percent ??
                        dashboard.intake?.completion?.percent ??
                        dashboard.completion?.percent ??
                        dashboard.progress,
                      { asPercent: true }
                    ),
                  },
                  {
                    label: 'Follow-ups',
                    value: formatDashboardMetric(
                      dashboard.openActions ??
                        dashboard.actionsDue ??
                        dashboard.followUpCount ??
                        (Array.isArray(dashboard.followUps)
                          ? dashboard.followUps.length
                          : dashboard.followUps?.count ?? dashboard.followUps?.open)
                    ),
                  },
                  {
                    label: 'Artifacts',
                    value: formatDashboardMetric(
                      dashboard.artifactCount ??
                        (Array.isArray(dashboard.artifacts)
                          ? dashboard.artifacts.length
                          : dashboard.artifacts?.count ?? dashboard.artifacts?.total)
                    ),
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-700">
                      {label}
                    </p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
                  </div>
                ))}
              </section>
            )}

            <section className="p-6 rounded-[2rem] border border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                Continue your journey
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {SHORTCUTS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.to}
                      to={`/dashboard/coach/cases/${caseId}/${s.to}`}
                      className={`${coachCard} group flex gap-4 p-5 rounded-2xl bg-white border border-gray-100`}
                    >
                      <div className="w-11 h-11 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0 transition-colors group-hover:bg-yellow-200">
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 transition-colors group-hover:text-yellow-800">
                          {s.label}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-1">{s.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="p-6 rounded-[2rem] border border-gray-100">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <Clock size={14} /> Timeline
              </h2>
              {timeline.length === 0 ? (
                <p className="text-sm text-gray-500 font-medium">
                  Events will appear here as you save intake, run diagnosis, and chat.
                </p>
              ) : (
                <ul className="space-y-4">
                  {timeline.slice(0, 12).map((ev) => (
                    <li key={ev._id} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 shrink-0" />
                      <div>
                        <p className="font-bold text-gray-800">
                          {ev.type || ev.eventType || ev.title || 'Event'}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          {ev.createdAt
                            ? new Date(ev.createdAt).toLocaleString()
                            : ''}
                          {ev.note ? ` · ${ev.note}` : ''}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="p-6 rounded-[2rem] border border-gray-100 bg-white">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                Profile snapshot
              </h2>
              {profile ? (
                <dl className="space-y-3 text-sm">
                  {[
                    ['Industry', profile.industry || profile.category],
                    ['Stage', profile.stage],
                    ['Structure', profile.structure || profile.type],
                    ['Offering', profile.offering || profile.productsServices],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          {k}
                        </dt>
                        <dd className="font-bold text-gray-800 mt-0.5 line-clamp-3">{v}</dd>
                      </div>
                    ))}
                  {!profile.industry && !profile.stage && (
                    <p className="text-gray-500 font-medium">
                      Complete intake to build your profile.
                    </p>
                  )}
                </dl>
              ) : (
                <p className="text-sm text-gray-500 font-medium">No profile yet.</p>
              )}
            </section>
            {canDelete && (
              <section className="p-5 rounded-2xl border border-red-100/80 bg-red-50/30">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">
                  Remove case
                </h2>
                <p className="text-xs font-medium text-gray-600 leading-relaxed mb-4">
                  Permanently delete this business case from your workspace. Intake, chat, and
                  artifacts for this case will no longer be available.
                </p>
                <button
                  type="button"
                  onClick={openDelete}
                  disabled={deleting}
                  className={`${coachBtn} w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 bg-white text-red-700 text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-300`}
                >
                  {deleting ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete case
                </button>
              </section>
            )}
            <AiDisclosure className="px-2" />
          </aside>
        </div>
    </>
  );
}
