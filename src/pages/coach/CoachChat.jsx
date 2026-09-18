import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Loader2,
  Send,
  BookmarkPlus,
  Plus,
  MessageSquare,
  Sparkles,
  User,
  Bot,
  Check,
  Trash2,
  X,
} from 'lucide-react';
import {
  LoadingBlock,
  ErrorBox,
  coachBtn,
  createRequestGuard,
} from '../../components/coach/CoachShared';
import CoachMarkdown from '../../components/coach/CoachMarkdown';
import { useCoachAiConsent } from '../../components/coach/AiConsent';
import Seo from '../../seo/Seo';
import {
  coachApi,
  isAiConsentError,
  normalizeCoachList,
  parseCoachError,
  COACH_CAPABILITIES,
} from '../../api/coach';

const GENERIC_SESSION_TITLE = /^coaching session$/i;

function truncateLabel(text, max = 60) {
  const t = String(text).trim();
  if (!t) return '';
  return t.length > max ? `${t.slice(0, max).trimEnd()}…` : t;
}

function sessionLabel(session, index) {
  const title = session?.title?.trim();
  if (title && !GENERIC_SESSION_TITLE.test(title)) {
    return truncateLabel(title);
  }
  const firstUser = (session?.messages || []).find((m) => m.role === 'user');
  if (firstUser?.content) {
    return truncateLabel(firstUser.content) || `Chat ${index + 1}`;
  }
  return `Chat ${index + 1}`;
}

/** Merge chat response session into sidebar list so title shows immediately. */
function upsertSessionInList(list, session) {
  if (!session?._id) return list;
  const idx = list.findIndex((s) => s._id === session._id);
  const nextItem = {
    ...(idx >= 0 ? list[idx] : {}),
    ...session,
    _id: session._id,
    title: session.title || (idx >= 0 ? list[idx].title : undefined),
    capability: session.capability ?? (idx >= 0 ? list[idx].capability : undefined),
    updatedAt: session.updatedAt || session.createdAt || (idx >= 0 ? list[idx].updatedAt : undefined),
  };
  if (idx === -1) return [nextItem, ...list];
  const next = [...list];
  next[idx] = nextItem;
  return next;
}

function sessionCapability(session) {
  const cap = session?.capability;
  return cap && cap !== 'general' ? cap : 'general';
}

function formatTime(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 ml-1">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

function DeleteSessionModal({ target, deleting, error, onClose, onConfirm }) {
  if (!target) return null;
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !deleting) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl border border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-lg font-black text-gray-900">Delete conversation?</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className={`${coachBtn} p-2 rounded-xl text-gray-400 hover:bg-gray-100`}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-sm font-medium text-gray-600 leading-relaxed">
          <span className="font-black text-gray-900">
            {target.label || 'This chat'}
          </span>{' '}
          will be removed from your sidebar. Saved insights from this chat stay in artifacts.
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
            {deleting ? 'Deleting…' : 'Delete chat'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className={`${coachBtn} px-5 py-3 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoachChat() {
  const { caseId } = useParams();
  const threadRef = useRef(null);
  const latestTurnRef = useRef(null);
  const inputRef = useRef(null);
  const flashTimerRef = useRef(null);
  const openSessionReqRef = useRef(0);
  const { runWithConsent, ConsentModal } = useCoachAiConsent();
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [capability, setCapability] = useState('general');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [savedFlash, setSavedFlash] = useState(null);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState('');
  const [focusTurnIndex, setFocusTurnIndex] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingSession, setDeletingSession] = useState(false);
  const [deleteSessionError, setDeleteSessionError] = useState('');

  const refreshSessionList = useCallback(async () => {
    const sessRes = await coachApi.listSessions(caseId);
    const list = normalizeCoachList(sessRes, ['sessions']);
    setSessions((prev) => {
      // Keep any fresher title we already have if list item still has a generic/empty title
      return list.map((item) => {
        const existing = prev.find((s) => s._id === item._id);
        const incoming = item?.title?.trim();
        const kept = existing?.title?.trim();
        if (
          (!incoming || GENERIC_SESSION_TITLE.test(incoming)) &&
          kept &&
          !GENERIC_SESSION_TITLE.test(kept)
        ) {
          return { ...item, title: kept };
        }
        return item;
      });
    });
  }, [caseId]);

  const capabilityLocked = Boolean(sessionId);

  // Reset thread when switching cases; cancel in-flight work on remount/nav.
  useEffect(() => {
    const guard = createRequestGuard();
    setSessionId(null);
    setMessages([]);
    setFocusTurnIndex(null);
    setInput('');
    setError(null);
    setInfo('');
    setLoading(true);

    (async () => {
      try {
        const sessRes = await coachApi.listSessions(caseId);
        if (guard.cancelled) return;
        const list = normalizeCoachList(sessRes, ['sessions']);
        setSessions(list);
        if (list[0]?._id) {
          const full = await coachApi.getSession(caseId, list[0]._id);
          if (guard.cancelled) return;
          const session = full.data?.session || full.data;
          setSessionId(session._id);
          setMessages(session.messages || []);
          setCapability(sessionCapability(session));
        }
      } catch (err) {
        if (guard.cancelled) return;
        setError(parseCoachError(err, 'Failed to load chat'));
      } finally {
        if (!guard.cancelled) setLoading(false);
      }
    })();

    return () => guard.cancel();
  }, [caseId]);

  useEffect(() => {
    if (focusTurnIndex == null) return;
    const thread = threadRef.current;
    const turn = latestTurnRef.current;
    if (!thread || !turn) return;

    const frame = requestAnimationFrame(() => {
      const threadTop = thread.getBoundingClientRect().top;
      const turnTop = turn.getBoundingClientRect().top;
      const nextTop = thread.scrollTop + (turnTop - threadTop) - 16;
      thread.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [focusTurnIndex, messages, sending]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  const startNewChat = () => {
    setSessionId(null);
    setMessages([]);
    setFocusTurnIndex(null);
    setError(null);
    setInfo('');
    setCapability('general');
    if (threadRef.current) threadRef.current.scrollTop = 0;
    inputRef.current?.focus();
  };

  const openSession = async (id) => {
    const reqId = ++openSessionReqRef.current;
    setError(null);
    setInfo('');
    setFocusTurnIndex(null);
    try {
      const full = await coachApi.getSession(caseId, id);
      if (reqId !== openSessionReqRef.current) return;
      const session = full.data?.session || full.data;
      setSessionId(session._id);
      setMessages(session.messages || []);
      setCapability(sessionCapability(session));
      if (session.title) {
        setSessions((prev) => upsertSessionInList(prev, session));
      }
      if (threadRef.current) threadRef.current.scrollTop = 0;
    } catch (err) {
      if (reqId !== openSessionReqRef.current) return;
      setError(parseCoachError(err));
    }
  };

  const send = async (e) => {
    e?.preventDefault?.();
    if (!input.trim() || sending) return;
    const message = input.trim();
    setInput('');
    setSending(true);
    setError(null);
    setInfo('');

    const turnStart = messages.length;
    setFocusTurnIndex(turnStart);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: message, _id: `tmp-${Date.now()}` },
    ]);

    try {
      const result = await runWithConsent(async () => {
        const body = { message };
        if (sessionId) {
          body.sessionId = sessionId;
        } else if (capability && capability !== 'general') {
          body.capability = capability;
        }
        const res = await coachApi.chat(caseId, body);
        const sid = res.data?.sessionId;
        const session = res.data?.session;
        if (sid) setSessionId(sid);
        if (session?.capability) setCapability(sessionCapability(session));
        if (session?.messages) {
          const msgs = session.messages;
          let idx = msgs.length - 1;
          for (let i = msgs.length - 1; i >= 0; i -= 1) {
            if (msgs[i].role === 'user') {
              idx = i;
              break;
            }
          }
          setFocusTurnIndex(idx);
          setMessages(msgs);
        } else if (res.data?.reply) {
          setFocusTurnIndex(turnStart);
          setMessages((prev) => [
            ...prev.filter((m) => !String(m._id).startsWith('tmp-')),
            { role: 'user', content: message },
            { role: 'assistant', content: res.data.reply, _id: `reply-${Date.now()}` },
          ]);
        }

        // Prefer server title from chat response immediately (first message of new session)
        const titledSession =
          session ||
          (sid
            ? {
                _id: sid,
                title: res.data?.session?.title || truncateLabel(message),
                capability,
              }
            : null);
        if (titledSession?._id) {
          setSessions((prev) => upsertSessionInList(prev, titledSession));
        }

        try {
          await refreshSessionList();
        } catch {
          /* keep optimistic titled session */
        }
      });
      if (result?.deferred) {
        setMessages((prev) => prev.filter((m) => !String(m._id).startsWith('tmp-')));
        setInput(message);
        setFocusTurnIndex(null);
        return;
      }
    } catch (err) {
      if (isAiConsentError(err)) {
        setMessages((prev) => prev.filter((m) => !String(m._id).startsWith('tmp-')));
        setInput(message);
        setFocusTurnIndex(null);
        return;
      }
      setError(parseCoachError(err, 'Chat failed'));
      setMessages((prev) => prev.filter((m) => !String(m._id).startsWith('tmp-')));
      setFocusTurnIndex(null);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const onComposerKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(e);
    }
  };

  const saveInsight = async (messageId) => {
    if (!sessionId || !messageId) return;
    setSavingId(messageId);
    setInfo('');
    try {
      await coachApi.saveChatArtifact(caseId, sessionId, { messageId });
      setSavedFlash(messageId);
      setInfo('Insight saved to artifacts.');
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = window.setTimeout(() => setSavedFlash(null), 2000);
    } catch (err) {
      setError(parseCoachError(err, 'Could not save insight'));
    } finally {
      setSavingId(null);
    }
  };

  const requestDeleteSession = (session, index) => {
    setDeleteSessionError('');
    setDeleteTarget({
      id: session._id,
      label: sessionLabel(session, index),
    });
  };

  const closeDeleteSession = () => {
    if (deletingSession) return;
    setDeleteTarget(null);
    setDeleteSessionError('');
  };

  const confirmDeleteSession = async () => {
    if (!deleteTarget?.id || deletingSession) return;
    const deletedId = deleteTarget.id;
    setDeletingSession(true);
    setDeleteSessionError('');
    setError(null);
    try {
      await coachApi.deleteSession(caseId, deletedId);
      const nextList = sessions.filter((s) => s._id !== deletedId);
      setSessions(nextList);
      setDeleteTarget(null);

      if (sessionId === deletedId) {
        if (nextList[0]?._id) {
          await openSession(nextList[0]._id);
        } else {
          startNewChat();
        }
      }

      setInfo('Conversation deleted. Saved insights remain in artifacts.');
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = window.setTimeout(() => setInfo(''), 2500);

      try {
        await refreshSessionList();
      } catch {
        /* list already updated locally */
      }
    } catch (err) {
      setDeleteSessionError(parseCoachError(err, 'Could not delete conversation').message);
    } finally {
      setDeletingSession(false);
    }
  };

  const suggestions = [
    'What should I prioritize this week?',
    'Help me tighten my pricing',
    'Where are the biggest risks?',
  ];

  return (
    <>
      <Seo title="Coach Chat | Business Coach" path={`/dashboard/coach/cases/${caseId}/chat`} noindex />
      {ConsentModal}
      <DeleteSessionModal
        target={deleteTarget}
        deleting={deletingSession}
        error={deleteSessionError}
        onClose={closeDeleteSession}
        onConfirm={confirmDeleteSession}
      />
        {loading ? (
          <LoadingBlock label="Opening coach chat" />
        ) : (
          <div className="grid lg:grid-cols-12 gap-4 lg:gap-5 items-stretch flex-1 min-h-0 h-full">
            {/* Sessions rail */}
            <aside className="lg:col-span-3 order-2 lg:order-1 min-h-0 hidden lg:flex lg:flex-col">
              <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col min-h-0 h-full">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Conversations
                    </p>
                    <p className="text-sm font-black text-gray-900 mt-0.5">
                      {sessions.length} session{sessions.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={startNewChat}
                    className={`${coachBtn} inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-[10px] font-black uppercase tracking-widest shadow-sm`}
                  >
                    <Plus size={14} /> New
                  </button>
                </div>

                <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1">
                  {sessions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
                      <MessageSquare className="mx-auto text-gray-300 mb-2" size={22} />
                      <p className="text-xs font-bold text-gray-500">No chats yet</p>
                      <p className="text-[11px] text-gray-400 mt-1">Start one on the right →</p>
                    </div>
                  ) : (
                    sessions.map((s, index) => {
                      const active = sessionId === s._id;
                      return (
                        <div
                          key={s._id}
                          className={`group flex items-stretch gap-1 rounded-2xl border transition-all ${
                            active
                              ? 'border-yellow-400 bg-yellow-50 shadow-sm'
                              : 'border-transparent bg-gray-50/80 hover:bg-white hover:border-gray-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => openSession(s._id)}
                            className={`${coachBtn} min-w-0 flex-1 text-left px-3.5 py-3 rounded-2xl`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span
                                className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                  active
                                    ? 'bg-yellow-400 text-black'
                                    : 'bg-white text-gray-400 border border-gray-100'
                                }`}
                              >
                                <MessageSquare size={14} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-xs font-black text-gray-900 truncate transition-colors group-hover:text-yellow-800">
                                  {sessionLabel(s, index)}
                                </span>
                                <span className="block text-[10px] font-bold text-gray-400 mt-1">
                                  {formatTime(s.updatedAt || s.createdAt)}
                                </span>
                              </span>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDeleteSession(s, index)}
                            disabled={deletingSession}
                            className={`${coachBtn} shrink-0 self-center mr-2 p-2 rounded-xl text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all ${
                              active ? 'opacity-100 text-gray-400' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
                            }`}
                            aria-label={`Delete ${sessionLabel(s, index)}`}
                            title="Delete conversation"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </aside>

            {/* Main chat surface — fills remaining viewport so composer stays visible */}
            <section className="lg:col-span-9 order-1 lg:order-2 min-h-0 h-full flex flex-col">
              <div className="flex flex-col rounded-[1.5rem] border border-gray-100 bg-white overflow-hidden shadow-[0_12px_40px_-24px_rgba(15,23,42,0.35)] flex-1 min-h-0 h-full">
                {/* Header */}
                <header className="shrink-0 px-4 sm:px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-white via-white to-yellow-50/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gray-900 text-yellow-400 flex items-center justify-center shrink-0 shadow-md shadow-gray-900/20">
                        <Bot size={18} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm font-black text-gray-900 tracking-tight truncate">
                          AI Business Coach
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5 truncate">
                          Case-aware · AI-assisted
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={startNewChat}
                        className={`${coachBtn} lg:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-yellow-400 text-[10px] font-black uppercase tracking-widest`}
                      >
                        <Plus size={12} /> New
                      </button>
                      {sessionId && (
                        <button
                          type="button"
                          onClick={() => {
                            const idx = sessions.findIndex((s) => s._id === sessionId);
                            const current = sessions[idx];
                            if (current) requestDeleteSession(current, idx >= 0 ? idx : 0);
                          }}
                          disabled={deletingSession}
                          className={`${coachBtn} inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50`}
                          title="Delete this conversation"
                        >
                          <Trash2 size={12} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      )}
                      {sending ? (
                        <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1.5 rounded-full">
                          Thinking <TypingDots />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ready
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile session picker */}
                  {sessions.length > 0 && (
                    <div className="lg:hidden mt-3">
                      <select
                        value={sessionId || ''}
                        onChange={(e) => {
                          if (e.target.value) openSession(e.target.value);
                          else startNewChat();
                        }}
                        className={`${coachBtn} w-full text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:border-yellow-300`}
                      >
                        <option value="">New conversation</option>
                        {sessions.map((s, index) => (
                          <option key={s._id} value={s._id}>
                            {sessionLabel(s, index)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="mt-3 space-y-1.5">
                    {capabilityLocked && (
                      <p className="text-[10px] font-bold text-gray-400 leading-snug">
                        Domain is locked for this conversation. Start a{' '}
                        <button
                          type="button"
                          onClick={startNewChat}
                          className={`${coachBtn} text-yellow-700 underline underline-offset-2 font-black`}
                        >
                          new chat
                        </button>{' '}
                        to switch domain.
                      </p>
                    )}
                    <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                      <button
                        type="button"
                        disabled={capabilityLocked}
                        title={
                          capabilityLocked
                            ? 'Start a new conversation to change domain'
                            : undefined
                        }
                        onClick={() => !capabilityLocked && setCapability('general')}
                        className={`${coachBtn} shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border disabled:opacity-60 disabled:cursor-not-allowed ${
                          capability === 'general'
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-yellow-300'
                        }`}
                      >
                        General
                      </button>
                      {COACH_CAPABILITIES.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          disabled={capabilityLocked}
                          title={
                            capabilityLocked
                              ? 'Start a new conversation to change domain'
                              : undefined
                          }
                          onClick={() => !capabilityLocked && setCapability(c.id)}
                          className={`${coachBtn} shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border disabled:opacity-60 disabled:cursor-not-allowed ${
                            capability === c.id
                              ? 'bg-yellow-400 text-black border-yellow-400'
                              : 'bg-white text-gray-500 border-gray-200 hover:border-yellow-300'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </header>

                {/* Thread */}
                <div
                  ref={threadRef}
                  className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-5 space-y-4 scroll-smooth bg-[radial-gradient(ellipse_at_top,_rgba(250,204,21,0.06),_transparent_55%),linear-gradient(to_bottom,#fafafa,#ffffff)]"
                >
                  <ErrorBox error={error} onDismiss={() => setError(null)} />
                  {info && (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2.5 animate-[fadeIn_0.25s_ease-out]">
                      <Check size={14} /> {info}
                    </div>
                  )}

                  {messages.length === 0 && !sending && (
                    <div className="flex flex-col items-center justify-center text-center px-4 py-10 sm:py-14 animate-[fadeInUp_0.35s_ease-out]">
                      <div className="w-14 h-14 rounded-3xl bg-yellow-100 text-yellow-700 flex items-center justify-center mb-3 shadow-inner">
                        <Sparkles size={24} />
                      </div>
                      <h3 className="text-base font-black text-gray-900 tracking-tight">
                        Ask your coach anything
                      </h3>
                      <p className="text-sm text-gray-500 font-medium mt-1.5 max-w-sm leading-relaxed">
                        Priorities, cash, marketing, ops — grounded in this case.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 mt-5">
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setInput(s);
                              inputRef.current?.focus();
                            }}
                            className={`${coachBtn} px-3.5 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:border-yellow-400 hover:bg-yellow-50`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m, index) => {
                    const isUser = m.role === 'user';
                    const isTurnStart = focusTurnIndex != null && index === focusTurnIndex;
                    const body = m.content || m.text || '';
                    return (
                      <div
                        key={m._id || `${m.role}-${index}-${String(body).slice(0, 12)}`}
                        ref={isTurnStart ? latestTurnRef : undefined}
                        className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-[fadeInUp_0.28s_ease-out]`}
                      >
                        {!isUser && (
                          <div className="w-8 h-8 rounded-xl bg-gray-900 text-yellow-400 flex items-center justify-center shrink-0 mt-1">
                            <Bot size={14} />
                          </div>
                        )}
                        <div className={`max-w-[min(100%,520px)] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                          <div
                            className={`rounded-3xl px-4 py-3 text-[13.5px] leading-relaxed font-medium ${
                              isUser
                                ? 'bg-gray-900 text-white rounded-br-md shadow-lg shadow-gray-900/15 whitespace-pre-wrap'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md shadow-sm'
                            }`}
                          >
                            {isUser ? body : <CoachMarkdown>{body}</CoachMarkdown>}
                          </div>
                          {!isUser && m._id && !String(m._id).startsWith('reply-') && !String(m._id).startsWith('tmp-') && (
                            <button
                              type="button"
                              onClick={() => saveInsight(m._id)}
                              disabled={savingId === m._id}
                              className={`${coachBtn} inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-yellow-700 px-1`}
                            >
                              {savingId === m._id ? (
                                <Loader2 className="animate-spin" size={12} />
                              ) : savedFlash === m._id ? (
                                <Check size={12} className="text-emerald-600" />
                              ) : (
                                <BookmarkPlus size={12} />
                              )}
                              {savedFlash === m._id ? 'Saved' : 'Save insight'}
                            </button>
                          )}
                        </div>
                        {isUser && (
                          <div className="w-8 h-8 rounded-xl bg-yellow-400 text-black flex items-center justify-center shrink-0 mt-1">
                            <User size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {sending && (
                    <div
                      ref={focusTurnIndex == null ? latestTurnRef : undefined}
                      className="flex gap-2.5 items-start animate-[fadeIn_0.2s_ease-out]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gray-900 text-yellow-400 flex items-center justify-center shrink-0">
                        <Bot size={14} />
                      </div>
                      <div className="rounded-3xl rounded-bl-md px-4 py-3 bg-white border border-amber-100 shadow-sm">
                        <p className="text-xs font-bold text-amber-800 inline-flex items-center gap-2">
                          Working on your answer
                          <TypingDots />
                        </p>
                        <p className="text-[11px] text-amber-700/80 font-medium mt-1">
                          Usually 10–40 seconds. Stay on this page.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Composer */}
                <footer className="shrink-0 border-t border-gray-100 bg-white p-2.5 sm:p-3">
                  <form
                    onSubmit={send}
                    className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50/80 focus-within:border-yellow-400 focus-within:ring-4 focus-within:ring-yellow-400/15 focus-within:bg-white transition-all px-2.5 py-2"
                  >
                    <textarea
                      ref={inputRef}
                      rows={1}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
                      }}
                      onKeyDown={onComposerKeyDown}
                      placeholder="Write a message… (Enter to send)"
                      disabled={sending}
                      className="flex-1 resize-none bg-transparent border-0 outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 max-h-[96px] py-1.5 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={sending || !input.trim()}
                      aria-label="Send message"
                      className={`${coachBtn} shrink-0 w-10 h-10 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black flex items-center justify-center shadow-md shadow-yellow-400/25`}
                    >
                      {sending ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}
                    </button>
                  </form>
                </footer>
              </div>
            </section>
          </div>
        )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
