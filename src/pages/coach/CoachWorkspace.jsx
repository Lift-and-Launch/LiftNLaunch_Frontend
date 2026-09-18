import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Plus, RefreshCw } from 'lucide-react';
import { coachApi, parseCoachError, REFERRAL_STATUSES } from '../../api/coach';
import {
  LoadingBlock,
  ErrorBox,
  AiDisclosure,
  createRequestGuard,
  coachBtn,
  coachLink,
} from '../../components/coach/CoachShared';
import { useCoachAiConsent } from '../../components/coach/AiConsent';
import Seo from '../../seo/Seo';

const TABS = [
  { id: 'documents', label: 'Documents' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'licensing', label: 'Licensing' },
  { id: 'investor', label: 'Investor readiness' },
];

export default function CoachWorkspace() {
  const { caseId } = useParams();
  const { runWithConsent, ConsentModal } = useCoachAiConsent();
  const [tab, setTab] = useState('documents');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState('');

  const [documents, setDocuments] = useState([]);
  const [readiness, setReadiness] = useState(null);
  const [validation, setValidation] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [licensing, setLicensing] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [investor, setInvestor] = useState(null);
  const loadedTabsRef = useRef({ documents: false, outcomes: false, licensing: false, investor: false });

  const [docForm, setDocForm] = useState({ title: '', url: '', category: '' });
  const [outcomeForm, setOutcomeForm] = useState({ title: '', metric: '', value: '' });

  const loadTabData = useCallback(async (tabId, { force = false, isActive = () => true } = {}) => {
    if (!force && loadedTabsRef.current[tabId]) return;
    try {
      if (tabId === 'documents') {
        const [docsRes, readyRes, valRes] = await Promise.all([
          coachApi.listDocuments(caseId).catch(() => ({ data: [] })),
          coachApi.getDocumentReadiness(caseId).catch(() => null),
          coachApi.listValidationReports(caseId).catch(() => ({ data: [] })),
        ]);
        if (!isActive()) return;
        setDocuments(Array.isArray(docsRes.data) ? docsRes.data : docsRes.data?.documents || []);
        setReadiness(readyRes?.data || null);
        setValidation(Array.isArray(valRes.data) ? valRes.data : valRes.data?.reports || []);
      } else if (tabId === 'outcomes') {
        const outcomesRes = await coachApi.listOutcomes(caseId).catch(() => ({ data: [] }));
        if (!isActive()) return;
        setOutcomes(
          Array.isArray(outcomesRes.data) ? outcomesRes.data : outcomesRes.data?.outcomes || []
        );
      } else if (tabId === 'licensing') {
        const [licRes, refRes] = await Promise.all([
          coachApi.getLicensing(caseId).catch(() => null),
          coachApi.listReferrals(caseId).catch(() => ({ data: [] })),
        ]);
        if (!isActive()) return;
        setLicensing(licRes?.data || licRes);
        setReferrals(Array.isArray(refRes.data) ? refRes.data : refRes.data?.referrals || []);
      } else if (tabId === 'investor') {
        const invRes = await coachApi.getInvestorReadiness(caseId).catch(() => null);
        if (!isActive()) return;
        const invList = invRes?.data;
        setInvestor(Array.isArray(invList) ? invList[0] : invList);
      }
      if (isActive()) loadedTabsRef.current[tabId] = true;
    } catch (err) {
      if (!isActive()) return;
      setError(parseCoachError(err, 'Failed to load workspace data'));
    }
  }, [caseId]);

  const refreshActiveTab = useCallback(async () => {
    await loadTabData(tab, { force: true });
  }, [loadTabData, tab]);

  useEffect(() => {
    loadedTabsRef.current = { documents: false, outcomes: false, licensing: false, investor: false };
    setLoading(false);
    setError(null);
  }, [caseId]);

  useEffect(() => {
    const guard = createRequestGuard();
    loadTabData(tab, { isActive: () => !guard.cancelled });
    return () => guard.cancel();
  }, [caseId, tab, loadTabData]);

  const addDocument = async (e) => {
    e.preventDefault();
    if (!docForm.title.trim() || !docForm.url.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await coachApi.addDocument(caseId, {
        title: docForm.title.trim(),
        url: docForm.url.trim(),
        category: docForm.category.trim() || undefined,
      });
      setDocForm({ title: '', url: '', category: '' });
      setInfo('Document added.');
      await refreshActiveTab();
    } catch (err) {
      setError(parseCoachError(err));
    } finally {
      setBusy(false);
    }
  };

  const runReadiness = async () => {
    setBusy(true);
    setError(null);
    try {
      await runWithConsent(async () => {
        const res = await coachApi.runDocumentReadiness(caseId);
        setReadiness(res.data);
        setInfo('Document readiness updated.');
        await refreshActiveTab();
      });
    } catch (err) {
      setError(parseCoachError(err));
    } finally {
      setBusy(false);
    }
  };

  const runValidation = async () => {
    setBusy(true);
    setError(null);
    try {
      await runWithConsent(async () => {
        await coachApi.runValidationReport(caseId);
        setInfo('Validation report generated.');
        await refreshActiveTab();
      });
    } catch (err) {
      setError(parseCoachError(err));
    } finally {
      setBusy(false);
    }
  };

  const addOutcome = async (e) => {
    e.preventDefault();
    if (!outcomeForm.title.trim()) return;
    setBusy(true);
    try {
      await coachApi.createOutcome(caseId, {
        title: outcomeForm.title.trim(),
        metric: outcomeForm.metric.trim() || undefined,
        value: outcomeForm.value.trim() || undefined,
      });
      setOutcomeForm({ title: '', metric: '', value: '' });
      await refreshActiveTab();
    } catch (err) {
      setError(parseCoachError(err));
    } finally {
      setBusy(false);
    }
  };

  const addReferral = async (resourceId) => {
    setBusy(true);
    try {
      await coachApi.createReferral(caseId, { resourceId, status: 'identified' });
      await refreshActiveTab();
    } catch (err) {
      setError(parseCoachError(err));
    } finally {
      setBusy(false);
    }
  };

  const runInvestor = async () => {
    setBusy(true);
    setError(null);
    try {
      await runWithConsent(async () => {
        const res = await coachApi.runInvestorReadiness(caseId);
        setInvestor(res.data);
        setInfo('Investor readiness scored (coaching signal only).');
        await refreshActiveTab();
      });
    } catch (err) {
      setError(parseCoachError(err));
    } finally {
      setBusy(false);
    }
  };

  const resources = licensing?.resources || licensing?.items || [];
  const licDisclaimer = licensing?.disclaimer;

  return (
    <>
      <Seo title="Workspace | Business Coach" path={`/dashboard/coach/cases/${caseId}/workspace`} noindex />
      {ConsentModal}
        {loading ? (
          <LoadingBlock />
        ) : (
          <div className="space-y-6">
            <ErrorBox error={error} onDismiss={() => setError(null)} />
            {info && (
              <p className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                {info}
              </p>
            )}
            <AiDisclosure />

            <div className="flex gap-2 overflow-x-auto pb-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`${coachBtn} px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap ${
                    tab === t.id
                      ? 'bg-yellow-400 text-black shadow-sm'
                      : 'bg-white border border-gray-100 text-gray-500 hover:border-yellow-300 hover:shadow-sm'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'documents' && (
              <div className="space-y-6">
                <form onSubmit={addDocument} className="grid md:grid-cols-3 gap-3 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <input
                    value={docForm.title}
                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                    placeholder="Document title"
                    className="px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                    required
                  />
                  <input
                    value={docForm.url}
                    onChange={(e) => setDocForm({ ...docForm, url: e.target.value })}
                    placeholder="https://…"
                    className="px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                    required
                  />
                  <input
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                    placeholder="Category (optional)"
                    className="px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className={`${coachBtn} md:col-span-3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest hover:shadow-md`}
                  >
                    <Plus size={14} /> Add document link
                  </button>
                </form>

                <ul className="space-y-2">
                  {documents.length === 0 ? (
                    <p className="text-sm text-gray-500 font-medium">No documents linked yet.</p>
                  ) : (
                    documents.map((d) => (
                      <li key={d._id} className="p-4 rounded-xl border border-gray-100 flex justify-between gap-3">
                        <div>
                          <p className="font-bold text-sm text-gray-900">{d.title}</p>
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`${coachLink} text-xs text-yellow-700 font-bold break-all`}
                          >
                            {d.url}
                          </a>
                        </div>
                        {d.category && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {d.category}
                          </span>
                        )}
                      </li>
                    ))
                  )}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={runReadiness}
                    disabled={busy}
                    className={`${coachBtn} inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-xs font-black uppercase tracking-widest hover:shadow-md`}
                  >
                    {busy ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                    Run document readiness
                  </button>
                  <button
                    type="button"
                    onClick={runValidation}
                    disabled={busy}
                    className={`${coachBtn} inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-sm`}
                  >
                    Generate validation report
                  </button>
                </div>

                {readiness && (
                  <section className="p-5 rounded-2xl border border-gray-100 bg-white space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Latest readiness</h3>
                    <pre className="text-xs font-medium text-gray-700 whitespace-pre-wrap overflow-auto max-h-64">
                      {typeof readiness === 'string'
                        ? readiness
                        : JSON.stringify(readiness.summary || readiness, null, 2)}
                    </pre>
                    {readiness.disclaimer && <p className="text-xs text-gray-400">{readiness.disclaimer}</p>}
                  </section>
                )}

                {validation.length > 0 && (
                  <section className="p-5 rounded-2xl border border-gray-100 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Validation history</h3>
                    {validation.slice(0, 3).map((v) => (
                      <div key={v._id} className="text-sm font-medium text-gray-700 p-3 rounded-xl bg-gray-50">
                        {v.summary || v.title || `Report ${v._id}`}
                        <span className="block text-[10px] text-gray-400 mt-1">
                          {v.createdAt ? new Date(v.createdAt).toLocaleString() : ''}
                        </span>
                      </div>
                    ))}
                  </section>
                )}
              </div>
            )}

            {tab === 'outcomes' && (
              <div className="space-y-6">
                <form onSubmit={addOutcome} className="grid md:grid-cols-3 gap-3 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <input
                    value={outcomeForm.title}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, title: e.target.value })}
                    placeholder="Outcome title"
                    className="px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                    required
                  />
                  <input
                    value={outcomeForm.metric}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, metric: e.target.value })}
                    placeholder="Metric"
                    className="px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                  />
                  <input
                    value={outcomeForm.value}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, value: e.target.value })}
                    placeholder="Value"
                    className="px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className={`${coachBtn} md:col-span-3 px-4 py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest hover:shadow-md`}
                  >
                    Log outcome
                  </button>
                </form>
                <ul className="space-y-2">
                  {outcomes.length === 0 ? (
                    <p className="text-sm text-gray-500">No outcomes logged yet.</p>
                  ) : (
                    outcomes.map((o) => (
                      <li key={o._id} className="p-4 rounded-xl border border-gray-100">
                        <p className="font-bold text-gray-900 text-sm">{o.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {[o.metric, o.value].filter(Boolean).join(': ') || o.description}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {tab === 'licensing' && (
              <div className="space-y-6">
                {licDisclaimer && (
                  <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                    {licDisclaimer}
                  </p>
                )}
                <p className="text-sm text-gray-500 font-medium">
                  Recommendations come only from the approved Lift & Launch directory.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {resources.length === 0 ? (
                    <p className="text-sm text-gray-500 md:col-span-2">No licensing resources available yet.</p>
                  ) : (
                    resources.map((r) => (
                      <article key={r._id || r.id} className="p-5 rounded-2xl border border-gray-100 space-y-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-yellow-600">
                            {r.type || r.category}
                          </p>
                          <h3 className="font-black text-gray-900">{r.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{r.description || r.guidance}</p>
                        </div>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => addReferral(r._id || r.id)}
                          className={`${coachLink} text-xs font-black uppercase tracking-widest text-yellow-700`}
                        >
                          Track referral →
                        </button>
                      </article>
                    ))
                  )}
                </div>

                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                    Referral tracker
                  </h3>
                  <ul className="space-y-2">
                    {referrals.length === 0 ? (
                      <p className="text-sm text-gray-500">No referrals yet.</p>
                    ) : (
                      referrals.map((ref) => (
                        <li key={ref._id} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-gray-100">
                          <span className="font-bold text-sm text-gray-800">
                            {ref.resourceName || ref.resourceId || 'Referral'}
                          </span>
                          <select
                            value={ref.status || 'identified'}
                            onChange={async (e) => {
                              await coachApi.patchReferral(caseId, ref._id, { status: e.target.value });
                              refreshActiveTab();
                            }}
                            className={`${coachBtn} text-xs font-bold border border-gray-200 rounded-lg px-2 py-1 hover:border-yellow-300`}
                          >
                            {REFERRAL_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </li>
                      ))
                    )}
                  </ul>
                </section>
              </div>
            )}

            {tab === 'investor' && (
              <div className="space-y-6">
                <button
                  type="button"
                  onClick={runInvestor}
                  disabled={busy}
                  className={`${coachBtn} inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-xs font-black uppercase tracking-widest hover:shadow-md`}
                >
                  {busy ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                  Score investor readiness
                </button>
                <p className="text-xs text-gray-400 font-bold">
                  Coaching signal only — not an investment recommendation.
                </p>
                {investor ? (
                  <section className="p-6 rounded-[2rem] border border-gray-100 space-y-3">
                    {(investor.score != null || investor.overallScore != null) && (
                      <p className="text-3xl font-black text-gray-900">
                        {investor.score ?? investor.overallScore}
                        <span className="text-sm text-gray-400 font-bold ml-2">/ 100</span>
                      </p>
                    )}
                    <pre className="text-xs font-medium text-gray-700 whitespace-pre-wrap overflow-auto max-h-80">
                      {JSON.stringify(investor.summary || investor.breakdown || investor, null, 2)}
                    </pre>
                    {(investor.disclaimer || investor.meta?.disclaimer) && (
                      <p className="text-xs text-amber-700 font-bold">
                        {investor.disclaimer || investor.meta?.disclaimer}
                      </p>
                    )}
                  </section>
                ) : (
                  <p className="text-sm text-gray-500">No investor-readiness score yet.</p>
                )}
              </div>
            )}
          </div>
        )}
    </>
  );
}
