import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RefreshCw, Loader2, Kanban, History, Sparkles, Check } from 'lucide-react';
import { coachApi, isAiConsentError, parseCoachError } from '../../api/coach';
import {
  LoadingBlock,
  ErrorBox,
  AiDisclosure,
  InfoBanner,
  coachBtn,
  coachCard,
  createRequestGuard,
  scrollCoachToTop,
} from '../../components/coach/CoachShared';
import { useCoachAiConsent } from '../../components/coach/AiConsent';
import { useCoachCase } from '../../context/CoachCaseContext';
import Seo from '../../seo/Seo';

function ListBlock({ title, items, tone = 'gray' }) {
  const tones = {
    gray: 'bg-gray-50 border-gray-100',
    green: 'bg-emerald-50 border-emerald-100',
    red: 'bg-rose-50 border-rose-100',
    amber: 'bg-amber-50 border-amber-100',
    blue: 'bg-blue-50 border-blue-100',
  };
  if (!items?.length) return null;
  return (
    <section
      className={`p-5 rounded-2xl border ${tones[tone]} transition-shadow hover:shadow-sm animate-[fadeInUp_0.35s_ease-out]`}
    >
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
        {title}
      </h3>
      <ul className="space-y-2 text-sm font-medium text-gray-800">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-yellow-500 font-black">•</span>
            <span>
              {typeof item === 'string'
                ? item
                : item?.text || item?.label || JSON.stringify(item)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function normalizeDiagnosisList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.diagnoses)) return payload.diagnoses;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function diagnosisId(d) {
  return d?._id ? String(d._id) : null;
}

function truncateDiagnosisTitle(text, max = 60) {
  const t = String(text || '').trim();
  if (!t) return '';
  return t.length > max ? `${t.slice(0, max).trimEnd()}…` : t;
}

/** Prefer API title; fall back to summary / top need for older rows. */
function diagnosisTitle(d) {
  if (!d) return 'Diagnosis';
  if (d.title?.trim()) return truncateDiagnosisTitle(d.title);
  if (d.summary?.trim()) return truncateDiagnosisTitle(d.summary);
  const need = d.prioritizedNeeds?.[0];
  const needText =
    typeof need === 'string'
      ? need
      : need?.need || need?.title || need?.label || need?.text || '';
  if (needText) return truncateDiagnosisTitle(needText);
  return `Diagnosis v${d.version || '—'}`;
}

export default function CoachDiagnosis() {
  const { caseId } = useParams();
  const { setHeaderActions } = useCoachCase();
  const { runWithConsent, ConsentModal } = useCoachAiConsent();
  const [diagnosis, setDiagnosis] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingHistoryItem, setLoadingHistoryItem] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  const latestId = useMemo(
    () => (history[0] ? diagnosisId(history[0]) : null),
    [history]
  );

  const viewingHistorical = Boolean(
    selectedId && latestId && selectedId !== latestId
  );

  const load = useCallback(async (isActive = () => true) => {
    setLoading(true);
    setError(null);
    try {
      const [latestRes, histRes] = await Promise.all([
        coachApi.getLatestDiagnosis(caseId).catch(() => null),
        coachApi.listDiagnoses(caseId).catch(() => ({ data: [] })),
      ]);
      if (!isActive()) return;

      const list = normalizeDiagnosisList(histRes.data);
      setHistory(list);

      const latest =
        latestRes?.data?.diagnosis ||
        latestRes?.data ||
        list[0] ||
        null;
      setDiagnosis(latest || null);
      setSelectedId(diagnosisId(latest));
    } catch (err) {
      if (!isActive()) return;
      setError(parseCoachError(err, 'Failed to load diagnosis'));
    } finally {
      if (isActive()) setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    const guard = createRequestGuard();
    load(() => !guard.cancelled);
    return () => guard.cancel();
  }, [load]);

  const selectHistoryItem = async (item) => {
    const id = diagnosisId(item);
    if (!id || loadingHistoryItem) return;

    // Prefer already-loaded full document from list
    const hasBody =
      item &&
      (item.summary ||
        item.strengths?.length ||
        item.weaknesses?.length ||
        item.risks?.length ||
        item.opportunities?.length ||
        item.rootCauses?.length ||
        item.prioritizedNeeds?.length);

    setError(null);
    setLoadingHistoryItem(true);
    try {
      let next = item;
      if (!hasBody) {
        const res = await coachApi.getDiagnosis(caseId, id);
        next = res.data?.diagnosis || res.data;
      }
      setDiagnosis(next || item);
      setSelectedId(id);
      setShowHistory(false);
      scrollCoachToTop();
    } catch (err) {
      // Fallback to list payload if detail fetch fails
      setDiagnosis(item);
      setSelectedId(id);
      setShowHistory(false);
      setError(parseCoachError(err, 'Could not load that diagnosis version'));
    } finally {
      setLoadingHistoryItem(false);
    }
  };

  const viewLatest = () => {
    const latest = history[0];
    if (latest) {
      setDiagnosis(latest);
      setSelectedId(diagnosisId(latest));
      scrollCoachToTop();
    }
  };

  const regenerate = async () => {
    setRunning(true);
    setError(null);
    try {
      const result = await runWithConsent(async () => {
        const res = await coachApi.runDiagnosis(caseId);
        const created = res.data?.diagnosis || res.data;
        setDiagnosis(created);
        setSelectedId(diagnosisId(created));
        await load();
        return res;
      });
      if (result?.deferred) return;
    } catch (err) {
      if (isAiConsentError(err)) return;
      setError(parseCoachError(err, 'Diagnosis failed — complete intake first if prompted'));
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    setHeaderActions(
      <>
        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          className={`${coachBtn} inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-widest hover:shadow-sm ${
            showHistory
              ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
              : 'border-gray-200 bg-white hover:border-yellow-300'
          }`}
        >
          <History size={14} /> History
          {history.length > 0 && (
            <span className="ml-0.5 tabular-nums text-[10px] opacity-70">
              ({history.length})
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={regenerate}
          disabled={running}
          className={`${coachBtn} inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-xs font-black uppercase tracking-widest shadow-md shadow-yellow-400/25`}
        >
          {running ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
          {running ? 'Generating…' : diagnosis ? 'Regenerate' : 'Generate'}
        </button>
      </>
    );
    return () => setHeaderActions(null);
    // regenerate closes over latest state; re-bind when action-relevant state changes
  }, [setHeaderActions, showHistory, history.length, running, diagnosis]);

  const content = diagnosis || {};

  return (
    <>
      <Seo title="Diagnosis | Business Coach" path={`/dashboard/coach/cases/${caseId}/diagnosis`} noindex />
      {ConsentModal}
        {loading ? (
          <LoadingBlock label="Loading diagnosis" />
        ) : (
          <div className="space-y-6">
            <ErrorBox error={error} onDismiss={() => setError(null)} />
            <AiDisclosure />

            {running && (
              <InfoBanner tone="amber">
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin" size={14} />
                  Generating diagnosis (often 10–40s). Keep this page open.
                </span>
              </InfoBanner>
            )}

            {viewingHistorical && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs font-bold text-amber-800">
                  Viewing diagnosis v{diagnosis?.version || '—'} (not the latest).
                  Latest is v{history[0]?.version || '—'}.
                </p>
                <button
                  type="button"
                  onClick={viewLatest}
                  className={`${coachBtn} px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-[10px] font-black uppercase tracking-widest text-amber-800 hover:bg-amber-100`}
                >
                  Back to latest
                </button>
              </div>
            )}

            {showHistory && (
              <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/80 space-y-3 animate-[fadeInUp_0.3s_ease-out]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Diagnosis history
                  </h3>
                  {loadingHistoryItem && (
                    <Loader2 className="animate-spin text-yellow-600" size={14} />
                  )}
                </div>
                <p className="text-xs font-medium text-gray-500">
                  Click a version to load that report into the view below.
                </p>
                {history.length === 0 ? (
                  <p className="text-sm text-gray-500">No previous reports.</p>
                ) : (
                  <div className="space-y-2">
                    {history.map((d, index) => {
                      const id = diagnosisId(d);
                      const active = id && id === selectedId;
                      const isLatest = index === 0;
                      return (
                        <button
                          key={id || `${d.version}-${index}`}
                          type="button"
                          disabled={loadingHistoryItem}
                          onClick={() => selectHistoryItem(d)}
                          className={`${coachCard} group block w-full text-left px-4 py-3 rounded-xl border ${
                            active
                              ? 'bg-yellow-50 border-yellow-400 shadow-sm'
                              : 'bg-white border-gray-100'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-black text-gray-900 transition-colors group-hover:text-yellow-800 line-clamp-2">
                                {diagnosisTitle(d)}
                              </p>
                              <p className="text-xs font-medium text-gray-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                <span className="font-black uppercase tracking-widest text-[10px] text-gray-500">
                                  v{d.version || '—'}
                                </span>
                                {isLatest && (
                                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                    Latest
                                  </span>
                                )}
                                <span>
                                  {d.createdAt
                                    ? new Date(d.createdAt).toLocaleString()
                                    : id}
                                </span>
                              </p>
                              {d.summary && diagnosisTitle(d) !== truncateDiagnosisTitle(d.summary) && (
                                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 font-medium">
                                  {d.summary}
                                </p>
                              )}
                            </div>
                            {active && (
                              <span className="shrink-0 w-7 h-7 rounded-full bg-yellow-400 text-black flex items-center justify-center">
                                <Check size={14} />
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {!diagnosis ? (
              <div className="text-center py-16 px-6 rounded-[2rem] border border-dashed border-gray-200 bg-gradient-to-b from-gray-50 to-white animate-[fadeInUp_0.35s_ease-out]">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
                <p className="font-black text-gray-900 mb-2 text-lg">No diagnosis yet</p>
                <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                  Finish intake (≥70% + required fields), then generate a report. You’ll be asked to accept the AI privacy notice the first time.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to={`/dashboard/coach/cases/${caseId}/intake`}
                    className={`${coachBtn} inline-flex px-5 py-3 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-700 hover:border-yellow-300`}
                  >
                    Go to intake
                  </Link>
                  <button
                    type="button"
                    onClick={regenerate}
                    disabled={running}
                    className={`${coachBtn} inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-xs font-black uppercase tracking-widest`}
                  >
                    {running ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                    Generate diagnosis
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {content.title && (
                    <span className="normal-case tracking-normal text-sm font-black text-gray-800 mr-1">
                      {diagnosisTitle(content)}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                    v{content.version || '—'}
                  </span>
                  {content.createdAt && (
                    <span>
                      {new Date(content.createdAt).toLocaleString()}
                    </span>
                  )}
                  {content.provider && (
                    <span className="text-gray-300">· {content.provider}</span>
                  )}
                </div>

                {content.summary && (
                  <section className="p-6 sm:p-8 rounded-[2rem] bg-gray-900 text-white shadow-xl shadow-gray-900/10 animate-[fadeInUp_0.35s_ease-out]">
                    <h2 className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-3">
                      Summary
                    </h2>
                    <p className="font-medium leading-relaxed whitespace-pre-wrap text-[15px]">
                      {content.summary}
                    </p>
                  </section>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <ListBlock title="Strengths" items={content.strengths} tone="green" />
                  <ListBlock title="Weaknesses" items={content.weaknesses} tone="red" />
                  <ListBlock title="Risks" items={content.risks} tone="amber" />
                  <ListBlock title="Opportunities" items={content.opportunities} tone="blue" />
                </div>

                <ListBlock title="Root causes" items={content.rootCauses} />

                {content.prioritizedNeeds?.length > 0 && (
                  <section className="p-6 rounded-[2rem] border border-gray-100 bg-white shadow-sm animate-[fadeInUp_0.4s_ease-out]">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                      Prioritized needs
                    </h3>
                    <ol className="space-y-4">
                      {content.prioritizedNeeds.map((n, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                            {n.priority || i + 1}
                          </span>
                          <div>
                            <p className="font-black text-gray-900">{n.need}</p>
                            {n.rationale && (
                              <p className="text-sm text-gray-500 mt-1">{n.rationale}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                    {!viewingHistorical && (
                      <Link
                        to={`/dashboard/coach/cases/${caseId}/plan`}
                        className={`${coachBtn} inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 font-black text-xs uppercase tracking-widest shadow-md shadow-yellow-400/20`}
                      >
                        <Kanban size={14} /> Build plan from diagnosis
                      </Link>
                    )}
                  </section>
                )}
              </>
            )}
          </div>
        )}
    </>
  );
}
