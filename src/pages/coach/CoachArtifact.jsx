import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileDown, Loader2 } from 'lucide-react';
import { coachApi, downloadArtifactExport, parseCoachError } from '../../api/coach';
import {
  LoadingBlock,
  ErrorBox,
  AiDisclosure,
  createRequestGuard,
  coachBtn,
  coachLink,
} from '../../components/coach/CoachShared';
import Seo from '../../seo/Seo';

export default function CoachArtifact() {
  const { caseId, artifactId } = useParams();
  const [artifact, setArtifact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportingFormat, setExportingFormat] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const guard = createRequestGuard();
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await coachApi.getArtifact(caseId, artifactId);
        if (guard.cancelled) return;
        setArtifact(res.data);
      } catch (err) {
        if (guard.cancelled) return;
        setError(parseCoachError(err));
      } finally {
        if (!guard.cancelled) setLoading(false);
      }
    })();
    return () => guard.cancel();
  }, [caseId, artifactId]);

  const content = artifact?.content || artifact;

  const exportArtifact = async (format) => {
    setExportingFormat(format);
    setError(null);
    try {
      await downloadArtifactExport(caseId, artifactId, format);
    } catch (err) {
      setError(parseCoachError(err, format === 'pdf' ? 'PDF export failed' : 'JSON export failed'));
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div>
      <Seo title="Artifact | Business Coach" path={`/dashboard/coach/cases/${caseId}/artifacts/${artifactId}`} noindex />
      <div className="max-w-3xl">
        <Link
          to={`/dashboard/coach/cases/${caseId}/domains`}
          className={`${coachLink} inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-6`}
        >
          <ArrowLeft size={14} /> Domains
        </Link>
        <ErrorBox error={error} onDismiss={() => setError(null)} />
        {loading ? (
          <LoadingBlock />
        ) : (
          <article className="space-y-6">
            <header>
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-600">
                {artifact?.type}
              </p>
              <h1 className="text-3xl font-black text-gray-900">
                {content?.title || artifact?.title || 'Artifact'}
              </h1>
              <AiDisclosure className="mt-3" />
            </header>
            {content?.disclaimer && (
              <p className="text-sm font-bold text-amber-800 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                {content.disclaimer}
              </p>
            )}
            {content?.summary && (
              <p className="text-lg text-gray-700 font-medium whitespace-pre-wrap">
                {content.summary}
              </p>
            )}
            <pre className="text-xs bg-gray-50 border border-gray-100 rounded-2xl p-5 overflow-auto font-mono">
              {JSON.stringify(content || artifact, null, 2)}
            </pre>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => exportArtifact('pdf')}
                disabled={!!exportingFormat}
                className={`${coachBtn} inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest hover:shadow-md`}
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
                onClick={() => exportArtifact('json')}
                disabled={!!exportingFormat}
                className={`${coachBtn} inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-xs font-black uppercase tracking-widest hover:border-yellow-300`}
              >
                {exportingFormat === 'json' ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <FileDown size={14} />
                )}
                {exportingFormat === 'json' ? 'Exporting…' : 'Export JSON'}
              </button>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
