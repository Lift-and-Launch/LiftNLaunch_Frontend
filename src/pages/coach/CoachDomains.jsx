import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2, Sparkles, FileDown } from 'lucide-react';
import {
  LoadingBlock,
  ErrorBox,
  AiDisclosure,
  coachBtn,
  coachCard,
  coachLink,
  createRequestGuard,
} from '../../components/coach/CoachShared';
import { useCoachAiConsent } from '../../components/coach/AiConsent';
import Seo from '../../seo/Seo';
import {
  coachApi,
  downloadArtifactExport,
  isAiConsentError,
  parseCoachError,
  COACH_CAPABILITIES,
} from '../../api/coach';

export default function CoachDomains() {
  const { caseId } = useParams();
  const { runWithConsent, ConsentModal } = useCoachAiConsent();
  const [artifacts, setArtifacts] = useState([]);
  const [active, setActive] = useState(null);
  const [focus, setFocus] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);
  const [exportingFormat, setExportingFormat] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async (isActive = () => true) => {
    setLoading(true);
    setError(null);
    try {
      const artRes = await coachApi.listArtifacts(caseId);
      if (!isActive()) return;
      setArtifacts(Array.isArray(artRes.data) ? artRes.data : artRes.data?.artifacts || []);
    } catch (err) {
      if (!isActive()) return;
      setError(parseCoachError(err, 'Failed to load domains'));
    } finally {
      if (isActive()) setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    const guard = createRequestGuard();
    load(() => !guard.cancelled);
    return () => guard.cancel();
  }, [load]);

  const generate = async (capability) => {
    setGenerating(capability);
    setError(null);
    try {
      const result = await runWithConsent(async () => {
        const body = focus.trim() ? { focus: focus.trim() } : {};
        const res = await coachApi.generateDomain(caseId, capability, body);
        const artifact = res.data;
        setActive(artifact);
        await load();
      });
      if (result?.deferred) return;
    } catch (err) {
      if (isAiConsentError(err)) return;
      setError(parseCoachError(err, 'Generation failed'));
    } finally {
      setGenerating(null);
    }
  };

  const openArtifact = async (id) => {
    try {
      const res = await coachApi.getArtifact(caseId, id);
      setActive(res.data);
    } catch (err) {
      setError(parseCoachError(err));
    }
  };

  const exportArtifact = async (id, format) => {
    setExportingFormat(format);
    setError(null);
    try {
      await downloadArtifactExport(caseId, id, format);
    } catch (err) {
      setError(parseCoachError(err, format === 'pdf' ? 'PDF export failed' : 'JSON export failed'));
    } finally {
      setExportingFormat(null);
    }
  };

  const content = active?.content || active;

  return (
    <>
      <Seo title="Domains | Business Coach" path={`/dashboard/coach/cases/${caseId}/domains`} noindex />
      {ConsentModal}
        {loading ? (
          <LoadingBlock />
        ) : (
          <div className="space-y-8">
            <ErrorBox error={error} onDismiss={() => setError(null)} />
            <AiDisclosure />

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                Optional focus for next generation
              </label>
              <input
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="e.g. Cash flow and unit economics"
                className="w-full max-w-xl px-5 py-3 rounded-xl border border-gray-200 font-bold text-sm"
              />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COACH_CAPABILITIES.map((cap) => (
                <button
                  key={cap.id}
                  type="button"
                  disabled={!!generating}
                  onClick={() => generate(cap.id)}
                  className={`${coachCard} group text-left p-5 rounded-2xl border border-gray-100 bg-white`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {generating === cap.id ? (
                      <Loader2 className="animate-spin text-yellow-500" size={18} />
                    ) : (
                      <Sparkles className="text-yellow-500" size={18} />
                    )}
                    <span className="font-black text-gray-900 transition-colors group-hover:text-yellow-800">
                      {cap.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{cap.description}</p>
                  {generating === cap.id && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mt-3">
                      Generating 10–40s…
                    </p>
                  )}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <section>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                  Artifact library
                </h2>
                {artifacts.length === 0 ? (
                  <p className="text-sm text-gray-500">No artifacts yet. Generate a domain report.</p>
                ) : (
                  <ul className="space-y-2">
                    {artifacts.map((a) => {
                      const selected = active?._id === a._id;
                      return (
                        <li key={a._id}>
                          <button
                            type="button"
                            onClick={() => openArtifact(a._id)}
                            className={`${coachCard} group w-full text-left px-4 py-3.5 rounded-xl border text-sm font-bold ${
                              selected
                                ? 'border-yellow-400 bg-yellow-50 shadow-sm'
                                : 'border-gray-100 bg-white'
                            }`}
                          >
                            <span className="text-[10px] uppercase tracking-widest text-yellow-600 font-black">
                              {a.type || a.capability}
                            </span>
                            <span
                              className={`block mt-0.5 transition-colors ${
                                selected
                                  ? 'text-yellow-900'
                                  : 'text-gray-900 group-hover:text-yellow-800'
                              }`}
                            >
                              {a.title || a.content?.title || a._id}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              <section className="p-6 rounded-[2rem] border border-gray-100 bg-gray-50/80 min-h-[320px]">
                {!active ? (
                  <p className="text-sm text-gray-500 font-medium">
                    Select or generate an artifact to view it here.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-yellow-600">
                          {active.type}
                        </p>
                        <h3 className="text-xl font-black text-gray-900">
                          {content?.title || active.title || 'Artifact'}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => exportArtifact(active._id, 'pdf')}
                          disabled={!!exportingFormat}
                          className={`${coachBtn} inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-xs font-black uppercase tracking-widest bg-white hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-sm`}
                        >
                          {exportingFormat === 'pdf' ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            <FileDown size={14} />
                          )}
                          {exportingFormat === 'pdf' ? 'Exporting…' : 'Export PDF'}
                        </button>
                        <button
                          type="button"
                          onClick={() => exportArtifact(active._id, 'json')}
                          disabled={!!exportingFormat}
                          className={`${coachBtn} inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-xs font-black uppercase tracking-widest bg-gray-50 hover:border-gray-300 hover:bg-white`}
                        >
                          {exportingFormat === 'json' ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            <FileDown size={14} />
                          )}
                          {exportingFormat === 'json' ? 'Exporting…' : 'Export JSON'}
                        </button>
                      </div>
                    </div>

                    {content?.summary && (
                      <p className="text-sm font-medium text-gray-700 whitespace-pre-wrap">
                        {content.summary}
                      </p>
                    )}

                    {content?.disclaimer && (
                      <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                        {content.disclaimer}
                      </p>
                    )}

                    {content?.facts?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                          Facts
                        </p>
                        <ul className="text-sm space-y-1">
                          {content.facts.map((f, i) => (
                            <li key={i}>• {typeof f === 'string' ? f : JSON.stringify(f)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {content?.assumptions?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                          Assumptions
                        </p>
                        <ul className="text-sm space-y-1 text-gray-600">
                          {content.assumptions.map((f, i) => (
                            <li key={i}>• {typeof f === 'string' ? f : JSON.stringify(f)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <pre className="text-xs bg-white border border-gray-100 rounded-xl p-4 overflow-auto max-h-80 font-mono text-gray-600">
                      {JSON.stringify(content || active, null, 2)}
                    </pre>

                    <Link
                      to={`/dashboard/coach/cases/${caseId}/artifacts/${active._id}`}
                      className={`${coachLink} inline-flex text-xs font-black uppercase tracking-widest text-yellow-600`}
                    >
                      Open full view →
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
    </>
  );
}
