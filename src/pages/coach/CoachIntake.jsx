import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  Stethoscope,
  Loader2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Database,
  Pencil,
} from 'lucide-react';
import {
  LoadingBlock,
  ErrorBox,
  AiDisclosure,
  coachBtn,
  createRequestGuard,
} from '../../components/coach/CoachShared';
import { useCoachAiConsent } from '../../components/coach/AiConsent';
import Seo from '../../seo/Seo';
import { coachApi, isAiConsentError, parseCoachError } from '../../api/coach';

const MIN_DEFAULT = 70;
const AUTOSAVE_MS = 900;

const INTAKE_VALUE_KEYS = [
  'stage',
  'industry',
  'structure',
  'offering',
  'customers',
  'revenueModel',
  'pricing',
  'costs',
  'cashFlow',
  'marketing',
  'sales',
  'ops',
  'staffing',
  'capital',
  'goals',
  'documents',
];

function isFilled(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/** Avoid sending invalid enum empties (e.g. stage: "") to the API. */
function sanitizeIntakePayload(values) {
  const out = {};
  for (const [key, value] of Object.entries(values || {})) {
    if (key === 'stage') {
      out.stage = isFilled(value) ? value : null;
      continue;
    }
    if (typeof value === 'string') {
      out[key] = value.trim();
      continue;
    }
    out[key] = value;
  }
  return out;
}

/**
 * Map campaign/business prefill snapshot → intake field values.
 * Supports story → goals when goals is empty.
 */
function hintsFromPrefill(prefillPayload) {
  if (!prefillPayload || typeof prefillPayload !== 'object') return {};
  const snap =
    prefillPayload.prefillSnapshot && typeof prefillPayload.prefillSnapshot === 'object'
      ? prefillPayload.prefillSnapshot
      : {};
  const hints = {};
  for (const key of INTAKE_VALUE_KEYS) {
    if (isFilled(snap[key])) hints[key] = snap[key];
  }
  if (!isFilled(hints.goals) && isFilled(snap.story)) {
    hints.goals = snap.story;
  }
  return hints;
}

function sourceMapFromPrefill(prefillPayload, schemaData) {
  const fromSchema = schemaData?.dataSourceMap;
  const fromPrefill = prefillPayload?.dataSourceMap;
  const map = { ...(fromPrefill || {}), ...(fromSchema || {}) };
  // story prefilled into goals keeps campaign/business source
  if (!map.goals && (map.story || fromPrefill?.story)) {
    map.goals = map.story || fromPrefill.story;
  }
  return map;
}

function sourceLabel(type) {
  if (type === 'campaign') return 'From campaign';
  if (type === 'business') return 'From business profile';
  if (type === 'manual') return 'Edited by you';
  return null;
}

/** Mirror backend IntakeService.assessCompletion for live client updates. */
function assessCompletion(fields, values, minPercent = MIN_DEFAULT) {
  const list = Array.isArray(fields) ? fields : [];
  let completedWeight = 0;
  let totalWeight = 0;
  const missingFields = [];
  const filledFields = [];

  for (const field of list) {
    const weight = typeof field.weight === 'number' ? field.weight : 1;
    totalWeight += weight;
    if (isFilled(values[field.key])) {
      completedWeight += weight;
      filledFields.push(field);
    } else {
      missingFields.push({
        key: field.key,
        label: field.label,
        required: Boolean(field.required),
        weight,
      });
    }
  }

  const percent =
    totalWeight === 0 ? 0 : Math.round((completedWeight / totalWeight) * 100);
  const requiredMissing = missingFields.filter((f) => f.required);
  const optionalMissing = missingFields.filter((f) => !f.required);

  return {
    percent,
    completedWeight,
    totalWeight,
    missingFields,
    requiredMissing,
    optionalMissing,
    filledCount: filledFields.length,
    totalCount: list.length,
    readyForDiagnosis: percent >= minPercent && requiredMissing.length === 0,
  };
}

function fieldInputClass(filled) {
  return [
    'w-full px-4 py-3.5 rounded-2xl border bg-white text-sm font-semibold text-gray-900',
    'placeholder:text-gray-400 placeholder:font-medium',
    'outline-none transition-all duration-200',
    'focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 focus:bg-yellow-50/30',
    filled
      ? 'border-emerald-200 bg-emerald-50/20'
      : 'border-gray-200 hover:border-gray-300',
  ].join(' ');
}

export default function CoachIntake() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { runWithConsent, ConsentModal } = useCoachAiConsent();
  const [schema, setSchema] = useState(null);
  const [values, setValues] = useState({});
  const [sourceMap, setSourceMap] = useState({});
  const [prefillMeta, setPrefillMeta] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [diagnosing, setDiagnosing] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState('');
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const fieldRefs = useRef({});
  const autosaveTimer = useRef(null);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const loadSchema = useCallback(async (isActive = () => true) => {
    setLoading(true);
    setError(null);
    try {
      const [schemaRes, prefillRes] = await Promise.all([
        coachApi.getIntakeSchema(caseId),
        coachApi.getIntakePrefill(caseId).catch(() => null),
      ]);
      if (!isActive()) return;
      const data = schemaRes.data || {};
      const prefillPayload = prefillRes?.data || null;
      setSchema(data);

      const current = data.currentValues || {};
      const hints = hintsFromPrefill(prefillPayload);
      // Schema/current values win; prefill fills any gaps
      const merged = { ...hints, ...current };
      setValues(merged);
      valuesRef.current = merged;
      setSavedSnapshot(JSON.stringify(sanitizeIntakePayload(merged)));

      const map = sourceMapFromPrefill(prefillPayload, data);
      setSourceMap(map);

      const prefilledKeys = INTAKE_VALUE_KEYS.filter(
        (key) => isFilled(merged[key]) && (map[key]?.type === 'campaign' || map[key]?.type === 'business')
      );
      setPrefillMeta({
        active: prefilledKeys.length > 0 || Boolean(data.hasCampaignPrefill),
        count: prefilledKeys.length,
        campaignId: prefillPayload?.campaignId || null,
        source: prefillPayload?.source || (data.hasCampaignPrefill ? 'campaign' : null),
      });
    } catch (err) {
      if (!isActive()) return;
      setError(parseCoachError(err, 'Failed to load intake schema'));
    } finally {
      if (isActive()) setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    const guard = createRequestGuard();
    loadSchema(() => !guard.cancelled);
    return () => {
      guard.cancel();
      if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    };
  }, [loadSchema]);

  const fields = schema?.fields || [];
  const minPercent = schema?.minCompletionPercent || MIN_DEFAULT;

  const live = useMemo(
    () => assessCompletion(fields, values, minPercent),
    [fields, values, minPercent]
  );

  const dirty = useMemo(
    () => JSON.stringify(values) !== savedSnapshot,
    [values, savedSnapshot]
  );

  const persist = useCallback(
    async ({ silent = false, nextValues } = {}) => {
      const payload = sanitizeIntakePayload(nextValues || valuesRef.current);
      if (!silent) {
        setSaving(true);
        setError(null);
        setInfo('');
      }
      try {
        const res = await coachApi.saveIntake(caseId, payload);
        const refreshed = await coachApi.getIntakeSchema(caseId);
        setSchema(refreshed.data);
        const saved = refreshed.data?.currentValues || payload;
        valuesRef.current = saved;
        setValues(saved);
        setSavedSnapshot(JSON.stringify(sanitizeIntakePayload(saved)));
        if (refreshed.data?.dataSourceMap) {
          setSourceMap((prev) => ({ ...prev, ...refreshed.data.dataSourceMap }));
        }
        setLastSavedAt(new Date());
        setError(null);
        if (!silent) {
          setInfo(
            res.data?.readyForDiagnosis || refreshed.data?.readyForDiagnosis
              ? 'Progress saved — ready for diagnosis.'
              : 'Progress saved.'
          );
        }
        return refreshed.data;
      } catch (err) {
        setError(parseCoachError(err, 'Failed to save intake'));
        throw err;
      } finally {
        if (!silent) setSaving(false);
      }
    },
    [caseId]
  );

  const scheduleAutosave = useCallback(() => {
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    autosaveTimer.current = window.setTimeout(() => {
      const current = valuesRef.current;
      if (JSON.stringify(sanitizeIntakePayload(current)) === savedSnapshot) return;
      persist({ silent: true, nextValues: current }).catch(() => null);
    }, AUTOSAVE_MS);
  }, [persist, savedSnapshot]);

  const setField = (key, value) => {
    // Clearing a select should be null, not ""
    const normalized =
      key === 'stage' && !isFilled(value) ? null : value;
    const next = { ...valuesRef.current, [key]: normalized };
    valuesRef.current = next;
    setValues(next);
    setInfo('');
    // Any new input clears the banner — no need to hit dismiss
    setError(null);
    // Manual edit overwrites campaign/business source for this field
    setSourceMap((prev) => ({
      ...prev,
      [key]: { type: 'manual' },
    }));

    const prevStage = values.stage ?? null;
    if (key === 'stage' && normalized !== prevStage) {
      // Stage drives adaptive fields — save + reload schema immediately
      if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
      (async () => {
        try {
          setSaving(true);
          await coachApi.saveIntake(caseId, sanitizeIntakePayload(next));
          const schemaRes = await coachApi.getIntakeSchema(caseId);
          setSchema(schemaRes.data);
          const saved = schemaRes.data?.currentValues || next;
          valuesRef.current = saved;
          setValues(saved);
          setSavedSnapshot(JSON.stringify(sanitizeIntakePayload(saved)));
          if (schemaRes.data?.dataSourceMap) {
            setSourceMap((prev) => ({ ...prev, ...schemaRes.data.dataSourceMap, stage: { type: 'manual' } }));
          }
          setLastSavedAt(new Date());
          setError(null);
        } catch (err) {
          setError(parseCoachError(err, 'Failed to update stage'));
        } finally {
          setSaving(false);
        }
      })();
      return;
    }

    scheduleAutosave();
  };

  const handleSave = async () => {
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    try {
      await persist({ silent: false });
    } catch {
      /* error already set */
    }
  };

  const handleDiagnose = async () => {
    if (!live.readyForDiagnosis) return;
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    setDiagnosing(true);
    setError(null);
    try {
      await persist({ silent: true });
      const result = await runWithConsent(async () => {
        await coachApi.runDiagnosis(caseId);
        navigate(`/dashboard/coach/cases/${caseId}/diagnosis`);
      });
      if (result?.deferred) return;
    } catch (err) {
      if (isAiConsentError(err)) return;
      setError(parseCoachError(err, 'Could not generate diagnosis'));
    } finally {
      setDiagnosing(false);
    }
  };

  const scrollToField = (key) => {
    const el = fieldRefs.current[key];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('ring-2', 'ring-yellow-400');
    window.setTimeout(() => el.classList.remove('ring-2', 'ring-yellow-400'), 1200);
    const focusable = el.querySelector('input, textarea, select, button');
    focusable?.focus?.();
  };

  const remainingToMin = Math.max(0, minPercent - live.percent);

  const renderField = (field) => {
    const val = values[field.key] ?? (field.type === 'multiselect' ? [] : '');
    const filled = isFilled(val);
    const common = fieldInputClass(filled);

    if (field.type === 'textarea') {
      return (
        <textarea
          rows={4}
          className={`${common} resize-y min-h-[110px]`}
          value={val}
          onChange={(e) => setField(field.key, e.target.value)}
          placeholder={field.helpText || `Share a bit about ${field.label.toLowerCase()}…`}
        />
      );
    }
    if (field.type === 'select') {
      return (
        <div className="relative">
          <select
            className={`${common} appearance-none pr-10`}
            value={val ?? ''}
            onChange={(e) => setField(field.key, e.target.value)}
          >
            <option value="">Select…</option>
            {(field.options || []).map((opt) => {
              const o = typeof opt === 'string' ? { value: opt, label: opt } : opt;
              return (
                <option key={o.value || o} value={o.value || o}>
                  {o.label || o.value || o}
                </option>
              );
            })}
          </select>
          <ChevronRight
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400"
          />
        </div>
      );
    }
    if (field.type === 'multiselect') {
      const selected = Array.isArray(val) ? val : val ? [val] : [];
      return (
        <div className="flex flex-wrap gap-2">
          {(field.options || []).map((opt) => {
            const o = typeof opt === 'string' ? { value: opt, label: opt } : opt;
            const v = o.value || o;
            const on = selected.includes(v);
            return (
              <button
                key={v}
                type="button"
                onClick={() => {
                  const next = on ? selected.filter((x) => x !== v) : [...selected, v];
                  setField(field.key, next);
                }}
                className={`${coachBtn} px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
                  on
                    ? 'bg-yellow-400 border-yellow-400 text-black shadow-sm shadow-yellow-400/30'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-yellow-300'
                }`}
              >
                {o.label || v}
              </button>
            );
          })}
        </div>
      );
    }
    return (
      <input
        type="text"
        className={common}
        value={val}
        onChange={(e) => setField(field.key, e.target.value)}
        placeholder={field.helpText || ''}
      />
    );
  };

  const progressTone =
    live.readyForDiagnosis
      ? 'from-emerald-400 to-emerald-500'
      : live.percent >= minPercent
        ? 'from-amber-400 to-yellow-500'
        : 'from-yellow-400 to-amber-400';

  return (
    <>
      <Seo title="Intake | Business Coach" path={`/dashboard/coach/cases/${caseId}/intake`} noindex />
      {ConsentModal}
        {loading ? (
          <LoadingBlock label="Loading intake form" />
        ) : (
          <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-3 lg:gap-6 lg:items-stretch">
            {/* Form scrolls; panel stays pinned in the viewport */}
            <div className="lg:col-span-2 min-h-0 flex flex-col order-2 lg:order-1">
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-5 pr-1 pb-28 lg:pb-4">
                <ErrorBox error={error} onDismiss={() => setError(null)} />
                {info && (
                  <p className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0" /> {info}
                  </p>
                )}

                <div className="rounded-[1.75rem] border border-yellow-100 bg-gradient-to-br from-yellow-50/80 to-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-700">
                      Adaptive intake
                    </p>
                    <p className="text-sm font-bold text-gray-700 mt-0.5">
                      Answer as you go — progress updates live. Save keeps a server copy.
                    </p>
                  </div>
                  <div className="text-right text-xs font-bold text-gray-400">
                    {dirty ? (
                      <span className="text-amber-600">Unsaved changes…</span>
                    ) : lastSavedAt ? (
                      <span>
                        Saved{' '}
                        {lastSavedAt.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    ) : (
                      <span>Not saved yet</span>
                    )}
                  </div>
                </div>

                {prefillMeta?.active && (
                  <div className="rounded-[1.75rem] border border-sky-100 bg-sky-50/70 px-5 py-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Database size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-sky-900 tracking-tight">
                        Prefill from your campaign
                      </p>
                      <p className="text-xs font-medium text-sky-800/80 mt-1 leading-relaxed">
                        {prefillMeta.count > 0
                          ? `${prefillMeta.count} field${prefillMeta.count === 1 ? '' : 's'} were filled from campaign / business data. Edit anything — your changes overwrite the prefill.`
                          : 'This case is linked to a campaign. Matching intake fields were pulled in automatically where available.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {fields.map((field) => {
                    const filled = isFilled(values[field.key]);
                    const srcType = sourceMap[field.key]?.type;
                    const srcText = sourceLabel(srcType);
                    return (
                      <div
                        key={field.key}
                        id={`intake-field-${field.key}`}
                        ref={(node) => {
                          fieldRefs.current[field.key] = node;
                        }}
                        className={`group p-5 sm:p-6 rounded-[1.75rem] border bg-white transition-all duration-200 ${
                          filled
                            ? 'border-emerald-100 shadow-sm'
                            : 'border-gray-100 hover:border-yellow-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <label className="block text-sm font-black text-gray-900 tracking-tight">
                              {field.label}
                              {field.required ? (
                                <span className="text-red-500 ml-1" title="Required">
                                  *
                                </span>
                              ) : (
                                <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
                                  Optional
                                </span>
                              )}
                            </label>
                            {field.helpText && (
                              <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">
                                {field.helpText}
                              </p>
                            )}
                            {srcText && filled && (
                              <p
                                className={`mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                  srcType === 'manual'
                                    ? 'bg-gray-100 text-gray-500'
                                    : 'bg-sky-100 text-sky-700'
                                }`}
                              >
                                {srcType === 'manual' ? (
                                  <Pencil size={10} />
                                ) : (
                                  <Database size={10} />
                                )}
                                {srcText}
                              </p>
                            )}
                          </div>
                          <span
                            className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                              filled ? 'text-emerald-600' : 'text-gray-300'
                            }`}
                          >
                            {filled ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                            {filled ? 'Done' : 'Open'}
                          </span>
                        </div>
                        {renderField(field)}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions stay under the form column */}
              <div className="shrink-0 pt-3 hidden lg:flex flex-wrap gap-3 border-t border-gray-100 bg-white/90 backdrop-blur">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || diagnosing || !dirty}
                  className={`${coachBtn} inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest`}
                >
                  {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                  {saving ? 'Saving…' : dirty ? 'Save progress' : 'Saved'}
                </button>
                <button
                  type="button"
                  onClick={handleDiagnose}
                  disabled={!live.readyForDiagnosis || diagnosing || saving}
                  className={`${coachBtn} inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs uppercase tracking-widest shadow-md shadow-yellow-400/20`}
                  title={
                    live.readyForDiagnosis
                      ? 'Generate diagnosis'
                      : 'Reach the completion target and fill required fields first'
                  }
                >
                  {diagnosing ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Stethoscope size={14} />
                  )}
                  {diagnosing ? 'Generating…' : 'Generate diagnosis'}
                </button>
              </div>

              {/* Mobile action bar */}
              <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden p-4 bg-white/95 backdrop-blur border-t border-gray-100">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || diagnosing || !dirty}
                    className={`${coachBtn} inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest hover:shadow-md`}
                  >
                    {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                    {saving ? 'Saving…' : dirty ? 'Save' : 'Saved'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDiagnose}
                    disabled={!live.readyForDiagnosis || diagnosing || saving}
                    className={`${coachBtn} inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs uppercase tracking-widest hover:shadow-md`}
                  >
                    {diagnosing ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Stethoscope size={14} />
                    )}
                    {diagnosing ? 'Generating…' : 'Diagnose'}
                  </button>
                </div>
              </div>
            </div>

            {/* Pinned completion rail — never leaves the viewport on desktop */}
            <aside className="order-1 lg:order-2 shrink-0 lg:min-h-0 lg:h-full lg:max-h-full flex flex-col mb-4 lg:mb-0">
              <div className="lg:h-full lg:min-h-0 flex flex-col gap-3 lg:overflow-hidden">
                <div className="p-5 sm:p-6 rounded-[2rem] border border-gray-100 bg-white shadow-sm space-y-4 lg:flex-1 lg:min-h-0 lg:overflow-y-auto overscroll-contain">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Completion
                      </p>
                      <p className="text-4xl font-black text-gray-900 tracking-tight mt-1 tabular-nums">
                        {live.percent}
                        <span className="text-xl text-gray-300">%</span>
                      </p>
                    </div>
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        live.readyForDiagnosis
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {live.readyForDiagnosis ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Sparkles size={20} />
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${progressTone} transition-all duration-500 ease-out`}
                        style={{ width: `${Math.min(100, live.percent)}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span>
                        {live.filledCount}/{live.totalCount} fields
                      </span>
                      <span>Goal {minPercent}%</span>
                    </div>
                  </div>

                  {live.readyForDiagnosis ? (
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
                        Ready for diagnosis
                      </p>
                      <p className="text-xs font-medium text-emerald-700/80 mt-1 leading-relaxed">
                        Required fields are complete and you hit the {minPercent}% target. Generate
                        when you’re ready.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-500 leading-relaxed">
                        Need ≥ {minPercent}% plus all required fields.
                        {remainingToMin > 0 ? (
                          <>
                            {' '}
                            <span className="text-amber-600">
                              About {remainingToMin}% more to go.
                            </span>
                          </>
                        ) : (
                          <>
                            {' '}
                            <span className="text-amber-600">
                              Percent is fine — finish required fields below.
                            </span>
                          </>
                        )}
                      </p>

                      {live.requiredMissing.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2 flex items-center gap-1">
                            <AlertCircle size={12} /> Required remaining
                          </p>
                          <ul className="space-y-1.5">
                            {live.requiredMissing.map((f) => (
                              <li key={f.key}>
                                <button
                                  type="button"
                                  onClick={() => scrollToField(f.key)}
                                  className={`${coachBtn} w-full text-left text-xs font-bold text-gray-700 px-3 py-2 rounded-xl bg-red-50/80 border border-red-100 hover:border-red-200 hover:bg-red-50 flex items-center justify-between gap-2`}
                                >
                                  <span className="truncate">{f.label || f.key}</span>
                                  <ChevronRight size={14} className="text-red-300 shrink-0" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {live.optionalMissing.length > 0 && live.percent < minPercent && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                            Optional boosts
                          </p>
                          <ul className="space-y-1.5">
                            {live.optionalMissing.slice(0, 6).map((f) => (
                              <li key={f.key}>
                                <button
                                  type="button"
                                  onClick={() => scrollToField(f.key)}
                                  className={`${coachBtn} w-full text-left text-xs font-medium text-gray-600 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:border-yellow-200 hover:bg-yellow-50/40 flex items-center justify-between gap-2`}
                                >
                                  <span className="truncate">{f.label || f.key}</span>
                                  <ChevronRight size={14} className="text-gray-300 shrink-0" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="hidden lg:block shrink-0 p-4 rounded-[1.5rem] border border-gray-100 bg-gray-50/80">
                  <AiDisclosure />
                </div>

                {diagnosing && (
                  <p className="shrink-0 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                    Diagnosis can take 10–40 seconds. Please wait…
                  </p>
                )}
              </div>
            </aside>
          </div>
        )}
    </>
  );
}
