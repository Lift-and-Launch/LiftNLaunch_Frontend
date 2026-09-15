import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Shield, Sparkles } from 'lucide-react';
import { coachApi, isAiConsentError, parseCoachError } from '../../api/coach';
import { useAuth } from '../../context/AuthContext';
import { coachBtn } from './CoachShared';

/**
 * Modal + helper for AI privacy consent (required before diagnosis/chat/domain AI/etc.).
 */
export function AiConsentModal({ open, notice, accepting, error, onAccept, onClose }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (open) setChecked(false);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const title = notice?.title || 'AI Privacy Notice';
  const body =
    notice?.body ||
    'Lift & Launch uses AI to generate coaching insights from your case data. Your Business Case content may be sent to our AI provider to produce diagnosis, chat, and domain outputs.';
  const checkboxLabel =
    notice?.checkboxLabel ||
    'I understand Lift & Launch uses AI and I consent to processing my case data for coaching insights.';

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget && !accepting) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-consent-title"
        className="w-full max-w-lg rounded-[2rem] bg-white shadow-2xl border border-gray-100 overflow-hidden animate-[fadeInUp_0.3s_ease-out]"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500" />
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0 shadow-inner">
              <Shield size={22} />
            </div>
            <div>
              <h2 id="ai-consent-title" className="text-xl font-black text-gray-900 tracking-tight">
                {title}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1 flex items-center gap-1">
                <Sparkles size={10} /> Required before AI features
                {notice?.version ? ` · v${notice.version}` : ''}
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto rounded-2xl bg-gray-50 border border-gray-100 p-4">
            {body}
          </div>

          <label className="flex items-start gap-3 p-4 rounded-2xl bg-yellow-50/60 border border-yellow-100 cursor-pointer hover:bg-yellow-50 transition-colors">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-1 w-4 h-4 accent-yellow-500 cursor-pointer"
            />
            <span className="text-sm font-bold text-gray-800">{checkboxLabel}</span>
          </label>

          {error && (
            <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              disabled={!checked || accepting}
              onClick={onAccept}
              className={`${coachBtn} inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-black uppercase tracking-widest shadow-md shadow-yellow-400/20`}
            >
              {accepting ? <Loader2 className="animate-spin" size={14} /> : null}
              {accepting ? 'Saving…' : 'Accept & continue'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={accepting}
              className={`${coachBtn} px-5 py-3 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50`}
            >
              Not now
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

/**
 * Hook: wrap AI API calls so 403 AI_PRIVACY_CONSENT_REQUIRED opens the modal,
 * accepts consent, then retries once.
 */
export function useCoachAiConsent() {
  const { refreshUser } = useAuth();
  const [consentOpen, setConsentOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [consentError, setConsentError] = useState('');
  const pendingRetryRef = React.useRef(null);

  const closeConsent = useCallback(() => {
    setConsentOpen(false);
    pendingRetryRef.current = null;
    setConsentError('');
  }, []);

  const openConsent = useCallback(async (fromError) => {
    setConsentError('');
    let noticeData = fromError?.data || null;
    if (!noticeData || (!noticeData.body && !noticeData.title)) {
      try {
        const res = await coachApi.getAiConsent();
        noticeData = { ...(noticeData || {}), ...(res.data || {}) };
      } catch {
        noticeData = {
          ...(noticeData || {}),
          title: noticeData?.title || 'AI Privacy Notice',
          body:
            noticeData?.body ||
            'Please accept the AI privacy notice before Business Case content can be sent to AI.',
          checkboxLabel:
            noticeData?.checkboxLabel ||
            'I understand and consent to AI processing for this case.',
          version: noticeData?.version || '1.0',
        };
      }
    }
    setNotice(noticeData);
    setConsentOpen(true);
  }, []);

  const acceptConsent = useCallback(async () => {
    setAccepting(true);
    setConsentError('');
    try {
      await coachApi.acceptAiConsent();
      if (typeof refreshUser === 'function') {
        await refreshUser().catch(() => null);
      }
      setConsentOpen(false);
      const retry = pendingRetryRef.current;
      pendingRetryRef.current = null;
      if (typeof retry === 'function') {
        await retry();
      }
    } catch (err) {
      const parsed = parseCoachError(err, 'Could not save consent');
      setConsentError(parsed.message);
    } finally {
      setAccepting(false);
    }
  }, [refreshUser]);

  const runWithConsent = useCallback(
    async (actionFn) => {
      try {
        return await actionFn();
      } catch (err) {
        if (isAiConsentError(err)) {
          const parsed = parseCoachError(err);
          pendingRetryRef.current = actionFn;
          await openConsent(parsed);
          // Do not rethrow — modal handles retry after accept
          return { consented: false, deferred: true };
        }
        throw err;
      }
    },
    [openConsent]
  );

  const ConsentModal = (
    <AiConsentModal
      open={consentOpen}
      notice={notice}
      accepting={accepting}
      error={consentError}
      onAccept={acceptConsent}
      onClose={closeConsent}
    />
  );

  return { runWithConsent, ConsentModal, openConsent, consentOpen };
}

export default useCoachAiConsent;
