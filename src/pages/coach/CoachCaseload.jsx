import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Briefcase, Loader2, FileText, StickyNote } from 'lucide-react';
import { coachApi, parseCoachError } from '../../api/coach';
import { useAuth } from '../../context/AuthContext';
import { isCoachRole } from '../../utils/roles';
import { StatusBadge, LoadingBlock, ErrorBox, AiDisclosure, createRequestGuard, coachBtn, coachCard, coachLink } from '../../components/coach/CoachShared';
import { useCoachAiConsent } from '../../components/coach/AiConsent';
import Seo from '../../seo/Seo';

export default function CoachCaseload() {
  const { user, loading: authLoading } = useAuth();
  const { runWithConsent, ConsentModal } = useCoachAiConsent();
  const [cases, setCases] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [record, setRecord] = useState(null);
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [note, setNote] = useState('');
  const [taskTitle, setTaskTitle] = useState('');

  const allowed = isCoachRole(user?.role);

  useEffect(() => {
    if (!allowed) return undefined;
    const guard = createRequestGuard();
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await coachApi.getCaseload();
        if (guard.cancelled) return;
        const list = Array.isArray(res.data) ? res.data : res.data?.cases || [];
        setCases(list);
        setSelectedId((prev) => prev || list[0]?._id || null);
      } catch (err) {
        if (guard.cancelled) return;
        setError(parseCoachError(err, 'Failed to load caseload'));
      } finally {
        if (!guard.cancelled) setLoading(false);
      }
    })();
    return () => guard.cancel();
  }, [allowed]);

  useEffect(() => {
    if (!selectedId || !allowed) return undefined;
    const guard = createRequestGuard();
    setBusy(true);
    (async () => {
      try {
        const [recRes, briefRes] = await Promise.all([
          coachApi.getHumanRecord(selectedId),
          coachApi.getCoachBrief(selectedId).catch(() => null),
        ]);
        if (guard.cancelled) return;
        setRecord(recRes.data);
        setBrief(briefRes?.data || null);
      } catch (err) {
        if (guard.cancelled) return;
        setError(parseCoachError(err));
      } finally {
        if (!guard.cancelled) setBusy(false);
      }
    })();
    return () => guard.cancel();
  }, [selectedId, allowed]);

  if (authLoading) return <LoadingBlock label="Checking access" />;
  if (!allowed) return <Navigate to="/dashboard/coach" replace />;

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim() || !selectedId) return;
    setBusy(true);
    try {
      await coachApi.addNote(selectedId, { content: note.trim(), aiVisible: true });
      setNote('');
      const recRes = await coachApi.getHumanRecord(selectedId);
      setRecord(recRes.data);
    } catch (err) {
      setError(parseCoachError(err));
    } finally {
      setBusy(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedId) return;
    setBusy(true);
    try {
      await coachApi.addCoachTask(selectedId, { title: taskTitle.trim() });
      setTaskTitle('');
      const recRes = await coachApi.getHumanRecord(selectedId);
      setRecord(recRes.data);
    } catch (err) {
      setError(parseCoachError(err));
    } finally {
      setBusy(false);
    }
  };

  const generateBrief = async () => {
    if (!selectedId) return;
    setBusy(true);
    setError(null);
    try {
      await runWithConsent(async () => {
        const res = await coachApi.generateCoachBrief(selectedId);
        setBrief(res.data);
      });
    } catch (err) {
      setError(parseCoachError(err));
    } finally {
      setBusy(false);
    }
  };

  const notes = record?.notes || [];
  const tasks = record?.tasks || record?.coachTasks || [];

  return (
    <div className="min-h-screen bg-white">
      <Seo title="Coach Caseload | Business Coach" path="/dashboard/coach/caseload" noindex />
      {ConsentModal}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-yellow-600 mb-2">Human coach desk</p>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Caseload</h1>
          <p className="text-gray-500 font-medium mt-2">Assigned cases, notes, tasks, and AI briefs.</p>
        </div>

        <ErrorBox error={error} onDismiss={() => setError(null)} />
        <AiDisclosure />

        {loading ? (
          <LoadingBlock label="Loading caseload" />
        ) : cases.length === 0 ? (
          <div className="text-center py-16 rounded-[2rem] border border-dashed border-gray-200">
            <Briefcase className="mx-auto text-gray-300 mb-3" size={36} />
            <p className="font-bold text-gray-600">No assigned cases.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <aside className="space-y-2">
              {cases.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => setSelectedId(c._id)}
                  className={`${coachCard} group w-full text-left p-4 rounded-2xl border ${
                    selectedId === c._id ? 'border-yellow-400 bg-yellow-50 shadow-sm' : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-black text-sm text-gray-900 transition-colors group-hover:text-yellow-800">
                      {c.title || 'Untitled'}
                    </p>
                    <StatusBadge status={c.status} />
                  </div>
                  <Link
                    to={`/dashboard/coach/cases/${c._id}`}
                    className={`${coachLink} text-[10px] font-black uppercase tracking-widest text-yellow-700 mt-2 inline-block`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open case →
                  </Link>
                </button>
              ))}
            </aside>

            <div className="lg:col-span-2 space-y-6">
              {busy && (
                <p className="text-xs font-bold text-gray-400 flex items-center gap-2">
                  <Loader2 className="animate-spin" size={14} /> Working…
                </p>
              )}

              <section className="p-6 rounded-[2rem] border border-gray-100 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <FileText size={14} /> Coach brief
                  </h2>
                  <button
                    type="button"
                    onClick={generateBrief}
                    disabled={busy || !selectedId}
                    className={`${coachBtn} px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-xs font-black uppercase tracking-widest hover:shadow-md`}
                  >
                    Generate brief
                  </button>
                </div>
                {brief ? (
                  <pre className="text-xs font-medium text-gray-700 whitespace-pre-wrap max-h-64 overflow-auto">
                    {typeof brief === 'string' ? brief : JSON.stringify(brief.summary || brief.content || brief, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-gray-500">No brief yet.</p>
                )}
              </section>

              <section className="p-6 rounded-[2rem] border border-gray-100 space-y-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <StickyNote size={14} /> Notes
                </h2>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {notes.length === 0 ? (
                    <p className="text-sm text-gray-500">No notes yet.</p>
                  ) : (
                    notes.map((n) => (
                      <li key={n._id} className="p-3 rounded-xl bg-gray-50 text-sm font-medium text-gray-700">
                        {n.content}
                        {n.aiVisible && (
                          <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-yellow-600">
                            AI visible
                          </span>
                        )}
                      </li>
                    ))
                  )}
                </ul>
                <form onSubmit={addNote} className="flex gap-2">
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add coach note…"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                  />
                  <button type="submit" className={`${coachBtn} px-4 py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest hover:shadow-md`}>
                    Add
                  </button>
                </form>
              </section>

              <section className="p-6 rounded-[2rem] border border-gray-100 space-y-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Coach tasks</h2>
                <ul className="space-y-2">
                  {tasks.length === 0 ? (
                    <p className="text-sm text-gray-500">No tasks yet.</p>
                  ) : (
                    tasks.map((t) => (
                      <li key={t._id} className="p-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-800">
                        {t.title}
                      </li>
                    ))
                  )}
                </ul>
                <form onSubmit={addTask} className="flex gap-2">
                  <input
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="New task…"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                  />
                  <button type="submit" className={`${coachBtn} px-4 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-xs font-black uppercase tracking-widest hover:shadow-md`}>
                    Add
                  </button>
                </form>
              </section>
            </div>
          </div>
        )}

        <Link to="/dashboard/coach" className={`${coachLink} text-xs font-black uppercase tracking-widest text-gray-400`}>
          ← My cases
        </Link>
      </div>
    </div>
  );
}
