import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Copy,
  Layout,
  Megaphone,
  BarChart3,
  Lightbulb,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import api from '../api/axios';
import { campaignAiApi, parseAiError, STEP_ROUTES } from '../api/campaignAi';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
  { id: 'score', label: 'Quality Score', icon: BarChart3 },
  { id: 'landing', label: 'Landing Draft', icon: Layout },
  { id: 'ads', label: 'Ad Copy', icon: Megaphone },
];

const AD_PLATFORMS = [
  { id: 'meta', label: 'Meta' },
  { id: 'google', label: 'Google' },
  { id: 'linkedin', label: 'LinkedIn' },
];

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

function CompletionRing({ percent }) {
  const clamped = Math.max(0, Math.min(100, Number(percent) || 0));
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} stroke="#f3f4f6" strokeWidth="10" fill="none" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="#eab308"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-black text-gray-900">{clamped}%</span>
      </div>
    </div>
  );
}

function ErrorBanner({ error, onDismiss }) {
  if (!error) return null;
  return (
    <div className="p-4 bg-red-50 text-red-600 rounded-[1.5rem] border border-red-100 font-medium flex gap-3 items-start">
      <AlertCircle size={18} className="shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <p className="font-bold">{error.message}</p>
        {error.details?.missingFields?.length > 0 && (
          <ul className="text-xs font-bold space-y-1 text-red-700/80">
            {error.details.missingFields.map((field) => (
              <li key={field.key}>
                • {field.label}
                {field.step && STEP_ROUTES[field.step] && (
                  <>
                    {' '}
                    <Link
                      to={STEP_ROUTES[field.step]}
                      state={{ campaignId: error.campaignId }}
                      className="underline text-red-800"
                    >
                      Fix in {field.step}
                    </Link>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="text-red-400 hover:text-red-600 cursor-pointer">
          <XCircle size={18} />
        </button>
      )}
    </div>
  );
}

function GeneratingOverlay({ label = 'Generating with AI…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center border border-yellow-100">
        <Loader2 className="animate-spin text-yellow-500" size={28} />
      </div>
      <div>
        <p className="font-black text-gray-900 tracking-tight">{label}</p>
        <p className="text-sm text-gray-400 font-bold mt-1">This can take 10–40 seconds.</p>
      </div>
    </div>
  );
}

export default function CampaignAiAssistant() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tab, setTab] = useState('suggestions');
  const [campaign, setCampaign] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState('');

  const [suggestionSets, setSuggestionSets] = useState([]);
  const [scores, setScores] = useState([]);
  const [landingDrafts, setLandingDrafts] = useState([]);
  const [adDrafts, setAdDrafts] = useState([]);
  const [adPlatform, setAdPlatform] = useState('meta');
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [applyingDraftId, setApplyingDraftId] = useState(null);

  const readyForAi = Boolean(completion?.readyForAi);

  const handleApiError = useCallback(
    (err) => {
      const parsed = parseAiError(err);
      setError({ ...parsed, campaignId });
      if (parsed.status === 403) {
        setInfo('Your account must be approved before using AI features.');
      }
    },
    [campaignId],
  );

  const loadCompletion = useCallback(async () => {
    const res = await campaignAiApi.getCompletion(campaignId);
    setCompletion(res.data);
  }, [campaignId]);

  const loadTabData = useCallback(async () => {
    if (tab === 'suggestions') {
      const res = await campaignAiApi.listSuggestions(campaignId);
      setSuggestionSets(Array.isArray(res.data) ? res.data : res.data?.items || []);
    } else if (tab === 'score') {
      const res = await campaignAiApi.listQualityScores(campaignId);
      setScores(Array.isArray(res.data) ? res.data : []);
    } else if (tab === 'landing') {
      const res = await campaignAiApi.listLandingDrafts(campaignId);
      setLandingDrafts(Array.isArray(res.data) ? res.data : []);
    } else if (tab === 'ads') {
      const res = await campaignAiApi.listAdDrafts(campaignId);
      setAdDrafts(Array.isArray(res.data) ? res.data : []);
    }
  }, [campaignId, tab]);

  const bootstrap = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const campRes = await api.get(`/campaigns/${campaignId}`);
      if (campRes.data.success) setCampaign(campRes.data.data);
      await loadCompletion();
      await loadTabData();
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [campaignId, loadCompletion, loadTabData, handleApiError]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!info) return undefined;
    const timer = window.setTimeout(() => setInfo(''), 4000);
    return () => window.clearTimeout(timer);
  }, [info]);

  useEffect(() => {
    loadTabData().catch(handleApiError);
  }, [tab, loadTabData, handleApiError]);

  const runGenerate = async (fn, successMessage) => {
    setGenerating(true);
    setError(null);
    setInfo('');
    try {
      await fn();
      await loadCompletion();
      await loadTabData();
      setInfo(successMessage);
    } catch (err) {
      handleApiError(err);
    } finally {
      setGenerating(false);
    }
  };

  const pendingItems = useMemo(() => {
    const latest = suggestionSets[0];
    if (!latest?.items) return [];
    return latest.items.filter((item) => item.status === 'pending');
  }, [suggestionSets]);

  if (user?.adminApprovalStatus && user.adminApprovalStatus !== 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mx-auto">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">AI Assistant locked</h1>
          <p className="text-gray-400 font-bold text-sm leading-relaxed">
            Your account must be approved before campaign AI tools are available.
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 rounded-xl font-black text-black uppercase tracking-widest text-xs transition-all cursor-pointer"
          >
            Back to Workspace
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-yellow-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-black uppercase tracking-widest transition-colors cursor-pointer self-start"
          >
            <ArrowLeft size={16} /> Back to Workspace
          </button>
          <button
            type="button"
            onClick={() => bootstrap()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-row justify-between items-start md:items-center gap-4">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600 mb-1 flex items-center gap-2">
              <Sparkles size={14} className="text-yellow-500 shrink-0" /> Campaign AI
            </span>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">AI Assistant</h1>
            <p className="text-gray-400 font-bold text-sm mt-1 break-words">
              {campaign?.campaignName || 'Campaign'} · improve copy, score quality, draft landing & ads
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-yellow-50 border border-yellow-100 rounded-full shrink-0 whitespace-nowrap mt-1 md:mt-0">
            <div className={`w-2 h-2 rounded-full shrink-0 ${readyForAi ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-700 whitespace-nowrap">
              {readyForAi ? 'AI Ready' : 'Complete Campaign'}
            </span>
          </div>
        </div>

        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
          <div className="flex flex-col md:flex-row gap-8 md:items-center">
            <CompletionRing percent={completion?.percent ?? 0} />
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Campaign completion</h2>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                    readyForAi
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}
                >
                  {readyForAi ? 'Ready for AI' : 'Needs more detail'}
                </span>
              </div>
              <p className="text-sm text-gray-400 font-bold">
                AI generate actions require at least 75% completion.
              </p>
              {!readyForAi && completion?.missingFields?.length > 0 && (
                <ul className="grid sm:grid-cols-2 gap-2 mt-2">
                  {completion.missingFields.map((field) => (
                    <li key={field.key}>
                      <Link
                        to={STEP_ROUTES[field.step] || '/dashboard'}
                        state={{ campaignId, campaignType: campaign?.campaignType }}
                        className="block text-sm font-bold text-gray-700 bg-gray-50 hover:bg-yellow-50 border border-gray-100 rounded-2xl px-4 py-3 transition-colors"
                      >
                        {field.label}
                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest block mt-1">
                          {field.step}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <ErrorBanner error={error} onDismiss={() => setError(null)} />
        {info && (
          <div className="p-4 bg-green-50 text-green-700 rounded-[1.5rem] border border-green-100 font-medium flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0" />
            <span className="flex-1">{info}</span>
            <button
              type="button"
              onClick={() => setInfo('')}
              className="text-green-500 hover:text-green-800 cursor-pointer"
              aria-label="Dismiss"
            >
              <XCircle size={18} />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-3 border-b border-gray-100 pb-4">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                tab === id
                  ? 'bg-yellow-400 text-black shadow-lg'
                  : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-100 shadow-sm'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 min-h-[320px]">
          {generating ? (
            <GeneratingOverlay />
          ) : (
            <>
              {tab === 'suggestions' && (
                <SuggestionsPanel
                  readyForAi={readyForAi}
                  suggestionSets={suggestionSets}
                  pendingItems={pendingItems}
                  editingItem={editingItem}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  onGenerate={() =>
                    runGenerate(
                      () => campaignAiApi.generateSuggestions(campaignId),
                      'Suggestions generated. Review and apply items below.',
                    )
                  }
                  onAccept={async (sid, itemId) => {
                    try {
                      await campaignAiApi.acceptSuggestion(campaignId, sid, itemId);
                      setInfo('Suggestion applied to campaign.');
                      await loadTabData();
                    } catch (err) {
                      handleApiError(err);
                    }
                  }}
                  onStartEdit={(sid, item) => {
                    setEditingItem({ sid, itemId: item._id || item.id, field: item.field });
                    setEditValue(item.suggestedValue || '');
                  }}
                  onCancelEdit={() => setEditingItem(null)}
                  onSaveEdit={async () => {
                    if (!editingItem) return;
                    try {
                      await campaignAiApi.editSuggestion(
                        campaignId,
                        editingItem.sid,
                        editingItem.itemId,
                        editValue,
                      );
                      setEditingItem(null);
                      setInfo('Edited suggestion applied.');
                      await loadTabData();
                    } catch (err) {
                      handleApiError(err);
                    }
                  }}
                  onDismiss={async (sid, itemId) => {
                    try {
                      await campaignAiApi.dismissSuggestion(campaignId, sid, itemId);
                      await loadTabData();
                    } catch (err) {
                      handleApiError(err);
                    }
                  }}
                  onDeleteSet={async (sid) => {
                    try {
                      await campaignAiApi.deleteSuggestionSet(campaignId, sid);
                      await loadTabData();
                    } catch (err) {
                      handleApiError(err);
                    }
                  }}
                />
              )}

              {tab === 'score' && (
                <ScorePanel
                  readyForAi={readyForAi}
                  scores={scores}
                  onGenerate={() =>
                    runGenerate(
                      () => campaignAiApi.generateQualityScore(campaignId),
                      'Quality score generated.',
                    )
                  }
                  onDelete={async (scoreId) => {
                    try {
                      await campaignAiApi.deleteQualityScore(campaignId, scoreId);
                      await loadTabData();
                    } catch (err) {
                      handleApiError(err);
                    }
                  }}
                />
              )}

              {tab === 'landing' && (
                <LandingPanel
                  readyForAi={readyForAi}
                  drafts={landingDrafts}
                  applyingDraftId={applyingDraftId}
                  onGenerate={() =>
                    runGenerate(
                      () => campaignAiApi.generateLandingDraft(campaignId),
                      'Landing draft generated. Preview below, then apply when ready.',
                    )
                  }
                  onApply={async (draft) => {
                    const draftId = draft._id || draft.id;
                    setApplyingDraftId(draftId);
                    setError(null);
                    try {
                      await campaignAiApi.applyLandingDraft(campaignId, draft.elements || []);
                      setInfo('Draft applied to website (version A). Open the builder to refine.');
                    } catch (err) {
                      handleApiError(err);
                    } finally {
                      setApplyingDraftId(null);
                    }
                  }}
                  onDelete={async (draftId) => {
                    try {
                      await campaignAiApi.deleteLandingDraft(campaignId, draftId);
                      await loadTabData();
                    } catch (err) {
                      handleApiError(err);
                    }
                  }}
                  onOpenBuilder={() => {
                    if (!user?.isSubscribed) {
                      navigate('/pricing');
                      return;
                    }
                    navigate('/dashboard/campaign/builder', {
                      state: { campaignId, campaignType: campaign?.campaignType },
                    });
                  }}
                />
              )}

              {tab === 'ads' && (
                <AdsPanel
                  readyForAi={readyForAi}
                  drafts={adDrafts}
                  platform={adPlatform}
                  setPlatform={setAdPlatform}
                  onGenerate={() =>
                    runGenerate(
                      () => campaignAiApi.generateAdDraft(campaignId, adPlatform),
                      `${adPlatform} ad draft generated.`,
                    )
                  }
                  onExport={async (draftId, format) => {
                    try {
                      setInfo('');
                      const res = await campaignAiApi.exportAdDraft(campaignId, draftId, format);
                      const text =
                        format === 'text'
                          ? res.data
                          : JSON.stringify(res.data?.data || res.data, null, 2);
                      await navigator.clipboard.writeText(typeof text === 'string' ? text : String(text));
                      return true;
                    } catch (err) {
                      handleApiError(err);
                      return false;
                    }
                  }}
                  onDelete={async (draftId) => {
                    try {
                      await campaignAiApi.deleteAdDraft(campaignId, draftId);
                      await loadTabData();
                    } catch (err) {
                      handleApiError(err);
                    }
                  }}
                />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function SuggestionsPanel({
  readyForAi,
  suggestionSets,
  editingItem,
  editValue,
  setEditValue,
  onGenerate,
  onAccept,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDismiss,
  onDeleteSet,
}) {
  const latest = suggestionSets[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Lightbulb size={20} className="text-yellow-500" /> Campaign suggestions
          </h3>
          <p className="text-sm text-gray-400 font-bold mt-1">AI proposes copy improvements you can apply or dismiss.</p>
        </div>
        <button
          type="button"
          disabled={!readyForAi}
          onClick={onGenerate}
          className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
        >
          Generate suggestions
        </button>
      </div>

      {!latest ? (
        <div className="py-12 text-center bg-gray-50 rounded-[2rem] border border-gray-100">
          <p className="text-sm text-gray-400 font-bold">No suggestion history yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestionSets.map((set) => {
            const sid = set._id || set.id;
            return (
              <div key={sid} className="border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {formatDate(set.createdAt)}
                    {set.model ? ` · ${set.model}` : ''}
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteSet(sid)}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    title="Delete set"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {(set.items || []).map((item) => {
                    const itemId = item._id || item.id;
                    const isEditing =
                      editingItem?.sid === sid && editingItem?.itemId === itemId;
                    return (
                      <div key={itemId} className="p-5 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-50 text-yellow-700 border border-yellow-100 px-3 py-1 rounded-full">
                            {item.label || item.field}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {item.status}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Original</p>
                            <p className="text-gray-600 font-bold whitespace-pre-wrap">
                              {item.originalValue || '—'}
                            </p>
                          </div>
                          <div className="bg-yellow-50/60 rounded-2xl p-4 border border-yellow-100">
                            <p className="text-[10px] font-black text-yellow-700 uppercase tracking-widest mb-2">Suggested</p>
                            {isEditing ? (
                              <textarea
                                className="w-full rounded-xl border border-yellow-200 p-3 text-sm font-bold min-h-[80px] outline-none focus:ring-2 focus:ring-yellow-400/40"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                              />
                            ) : (
                              <p className="text-gray-900 font-bold whitespace-pre-wrap">
                                {item.suggestedValue}
                              </p>
                            )}
                          </div>
                        </div>
                        {item.rationale && (
                          <p className="text-xs text-gray-400 font-bold leading-relaxed">{item.rationale}</p>
                        )}
                        {item.status === 'pending' && (
                          <div className="flex flex-wrap gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={onSaveEdit}
                                  className="px-4 py-2.5 bg-gray-950 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
                                >
                                  Save & apply
                                </button>
                                <button
                                  type="button"
                                  onClick={onCancelEdit}
                                  className="px-4 py-2.5 bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onAccept(sid, itemId)}
                                  className="inline-flex items-center gap-1 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
                                >
                                  <CheckCircle2 size={14} /> Apply
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onStartEdit(sid, item)}
                                  className="inline-flex items-center gap-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer"
                                >
                                  <Pencil size={14} /> Edit & apply
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDismiss(sid, itemId)}
                                  className="inline-flex items-center gap-1 px-4 py-2.5 text-gray-400 hover:text-gray-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 cursor-pointer"
                                >
                                  <XCircle size={14} /> Dismiss
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ScorePanel({ readyForAi, scores, onGenerate, onDelete }) {
  const latest = scores[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart3 size={20} className="text-yellow-500" /> Quality score
          </h3>
          <p className="text-sm text-gray-400 font-bold mt-1">0–100 rubric across clarity, story, audience, and CTA.</p>
        </div>
        <button
          type="button"
          disabled={!readyForAi}
          onClick={onGenerate}
          className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 text-black font-black rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
        >
          Score campaign
        </button>
      </div>

      {!latest ? (
        <div className="py-12 text-center bg-gray-50 rounded-[2rem] border border-gray-100">
          <p className="text-sm text-gray-400 font-bold">No scores yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scores.map((score) => {
            const scoreId = score._id || score.id;
            return (
              <div key={scoreId} className="border border-gray-100 rounded-[2rem] p-6 space-y-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-4xl font-black text-gray-900 tracking-tighter">{score.score}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">
                      {formatDate(score.createdAt)}
                      {score.model ? ` · ${score.model}` : ''}
                    </p>
                  </div>
                  <button type="button" onClick={() => onDelete(scoreId)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
                {score.summary && (
                  <p className="text-sm text-gray-600 font-bold leading-relaxed">{score.summary}</p>
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  {(score.breakdown || []).map((row) => (
                    <div key={row.criterion} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">
                        <span>{row.criterion}</span>
                        <span className="text-yellow-600">
                          {row.score}/{row.maxScore}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-bold leading-relaxed">{row.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LandingPanel({
  readyForAi,
  drafts,
  applyingDraftId,
  onGenerate,
  onApply,
  onDelete,
  onOpenBuilder,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Layout size={20} className="text-yellow-500" /> Landing page drafts
          </h3>
          <p className="text-sm text-gray-400 font-bold mt-1">
            Generates builder blocks. Apply only when you are ready — nothing auto-publishes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenBuilder}
            className="px-5 py-3 bg-white border border-gray-100 text-gray-800 font-black rounded-xl text-xs uppercase tracking-widest shadow-sm hover:bg-gray-50 cursor-pointer"
          >
            Open builder
          </button>
          <button
            type="button"
            disabled={!readyForAi}
            onClick={onGenerate}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 text-black font-black rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
          >
            Generate draft
          </button>
        </div>
      </div>

      {!drafts.length ? (
        <div className="py-12 text-center bg-gray-50 rounded-[2rem] border border-gray-100">
          <p className="text-sm text-gray-400 font-bold">No landing drafts yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => {
            const draftId = draft._id || draft.id;
            const elementCount = draft.elements?.length || 0;
            return (
              <div key={draftId} className="border border-gray-100 rounded-[2rem] p-6 space-y-4 shadow-sm">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-black text-gray-900 tracking-tight">{elementCount} blocks</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                      {formatDate(draft.createdAt)}
                      {draft.model ? ` · ${draft.model}` : ''}
                    </p>
                  </div>
                  <button type="button" onClick={() => onDelete(draftId)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>

                {(draft.advisories || []).length > 0 && (
                  <ul className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-1 font-bold">
                    {draft.advisories.map((a, i) => (
                      <li key={i}>• {a.message || a.type}</li>
                    ))}
                  </ul>
                )}

                <div className="max-h-40 overflow-auto bg-gray-50 rounded-2xl border border-gray-100 p-4 text-xs font-mono text-gray-600">
                  {(draft.elements || []).slice(0, 6).map((el) => (
                    <div key={el.id || el.type} className="truncate">
                      [{el.type}] {el.content || el.id}
                    </div>
                  ))}
                  {elementCount > 6 && <div>… +{elementCount - 6} more</div>}
                </div>

                <button
                  type="button"
                  disabled={applyingDraftId === draftId}
                  onClick={() => onApply(draft)}
                  className="px-5 py-3 bg-gray-950 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50 cursor-pointer"
                >
                  {applyingDraftId === draftId ? 'Applying…' : 'Apply to website'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdsPanel({
  readyForAi,
  drafts,
  platform,
  setPlatform,
  onGenerate,
  onExport,
  onDelete,
}) {
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = async (draftId, format) => {
    const ok = await onExport(draftId, format);
    if (!ok) return;
    const key = `${draftId}:${format}`;
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((current) => (current === key ? null : current));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Megaphone size={20} className="text-yellow-500" /> Ad copy drafts
            </h3>
          </div>
          <button
            type="button"
            disabled={!readyForAi}
            onClick={onGenerate}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 text-black font-black rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
          >
            Generate {platform} ads
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {AD_PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                platform === p.id
                  ? 'bg-yellow-400 text-black shadow-lg'
                  : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-100 shadow-sm'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {!drafts.length ? (
        <div className="py-12 text-center bg-gray-50 rounded-[2rem] border border-gray-100">
          <p className="text-sm text-gray-400 font-bold">No ad drafts yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => {
            const draftId = draft._id || draft.id;
            const content = draft.content || {};
            const textCopied = copiedKey === `${draftId}:text`;
            const jsonCopied = copiedKey === `${draftId}:json`;
            return (
              <div key={draftId} className="border border-gray-100 rounded-[2rem] p-6 space-y-4 shadow-sm">
                <div className="flex justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-50 text-yellow-700 border border-yellow-100 px-3 py-1 rounded-full">
                      {draft.platform}
                    </span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-3">
                      {formatDate(draft.createdAt)}
                      {draft.model ? ` · ${draft.model}` : ''}
                    </p>
                  </div>
                  <button type="button" onClick={() => onDelete(draftId)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>

                {(content.headlines || []).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Headlines</p>
                    <ul className="text-sm font-black text-gray-900 space-y-1">
                      {content.headlines.map((h, i) => (
                        <li key={i}>• {h}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {(content.descriptions || []).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Descriptions</p>
                    <ul className="text-sm font-bold text-gray-600 space-y-1">
                      {content.descriptions.map((d, i) => (
                        <li key={i}>• {d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(draftId, 'text')}
                    disabled={textCopied}
                    className={`inline-flex items-center gap-1 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer transition-all ${
                      textCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-950 text-white hover:bg-black'
                    }`}
                  >
                    {textCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    {textCopied ? 'Copied' : 'Copy text'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(draftId, 'json')}
                    disabled={jsonCopied}
                    className={`inline-flex items-center gap-1 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer transition-all ${
                      jsonCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {jsonCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    {jsonCopied ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
