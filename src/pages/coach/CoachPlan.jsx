import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Plus, CheckCircle2, AlertTriangle } from 'lucide-react';
import { coachApi, parseCoachError } from '../../api/coach';
import { useAuth } from '../../context/AuthContext';
import { canApproveCoachPlan } from '../../utils/roles';
import {
  LoadingBlock,
  ErrorBox,
  coachBtn,
  createRequestGuard,
} from '../../components/coach/CoachShared';
import { useCoachCase } from '../../context/CoachCaseContext';
import Seo from '../../seo/Seo';

export default function CoachPlan() {
  const { caseId } = useParams();
  const { setHeaderActions } = useCoachCase();
  const { user } = useAuth();
  const canApprove = canApproveCoachPlan(user?.role);

  const [plan, setPlan] = useState(null);
  const [goals, setGoals] = useState([]);
  const [actions, setActions] = useState([]);
  const [actionFilter, setActionFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [newGoal, setNewGoal] = useState('');
  const [newAction, setNewAction] = useState({ title: '', dueDate: '' });
  const [newItem, setNewItem] = useState({ need: '', objective: '' });
  const filterReadyRef = useRef(false);

  const load = useCallback(async (isActive = () => true) => {
    setLoading(true);
    setError(null);
    try {
      const params = actionFilter ? { status: actionFilter } : undefined;
      const [planRes, goalsRes, actionsRes] = await Promise.all([
        coachApi.getPlan(caseId),
        coachApi.listGoals(caseId),
        coachApi.listActions(caseId, params),
      ]);
      if (!isActive()) return;
      setPlan(planRes.data);
      setGoals(Array.isArray(goalsRes.data) ? goalsRes.data : goalsRes.data?.goals || []);
      setActions(
        Array.isArray(actionsRes.data) ? actionsRes.data : actionsRes.data?.actions || []
      );
    } catch (err) {
      if (!isActive()) return;
      setError(parseCoachError(err, 'Failed to load plan'));
    } finally {
      if (isActive()) setLoading(false);
    }
  }, [caseId, actionFilter]);

  const loadActionsOnly = useCallback(async (isActive = () => true) => {
    try {
      const params = actionFilter ? { status: actionFilter } : undefined;
      const actionsRes = await coachApi.listActions(caseId, params);
      if (!isActive()) return;
      setActions(
        Array.isArray(actionsRes.data) ? actionsRes.data : actionsRes.data?.actions || []
      );
    } catch (err) {
      if (!isActive()) return;
      setError(parseCoachError(err, 'Failed to filter actions'));
    }
  }, [caseId, actionFilter]);

  // Full load on case change
  useEffect(() => {
    filterReadyRef.current = false;
    const guard = createRequestGuard();
    load(() => !guard.cancelled).finally(() => {
      if (!guard.cancelled) filterReadyRef.current = true;
    });
    return () => guard.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- actionFilter handled below
  }, [caseId]);

  // Actions-only when filter changes (skip until initial case load finishes)
  useEffect(() => {
    if (!filterReadyRef.current) return undefined;
    const guard = createRequestGuard();
    loadActionsOnly(() => !guard.cancelled);
    return () => guard.cancel();
  }, [actionFilter, loadActionsOnly]);

  const seedPlan = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await coachApi.seedPlanFromDiagnosis(caseId);
      setPlan(res.data);
      await load();
    } catch (err) {
      setError(parseCoachError(err, 'Could not seed plan — run diagnosis first'));
    } finally {
      setBusy(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.need.trim() || !newItem.objective.trim()) return;
    setBusy(true);
    try {
      await coachApi.addPlanItem(caseId, {
        need: newItem.need.trim(),
        objective: newItem.objective.trim(),
        status: 'draft',
      });
      setNewItem({ need: '', objective: '' });
      await load();
    } catch (err) {
      setError(parseCoachError(err));
    } finally {
      setBusy(false);
    }
  };

  const patchItem = async (itemId, body) => {
    try {
      await coachApi.patchPlanItem(caseId, itemId, body);
      await load();
    } catch (err) {
      setError(parseCoachError(err));
    }
  };

  const approveItem = async (itemId) => {
    try {
      await coachApi.approvePlanItem(caseId, itemId);
      await load();
    } catch (err) {
      setError(parseCoachError(err, 'Approve failed (coach/admin only)'));
    }
  };

  const items = plan?.items || [];

  useEffect(() => {
    setHeaderActions(
      <button
        type="button"
        onClick={seedPlan}
        disabled={busy}
        className={`${coachBtn} inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 font-black text-xs uppercase tracking-widest`}
      >
        {busy ? <Loader2 className="animate-spin" size={14} /> : null}
        Build plan from diagnosis
      </button>
    );
    return () => setHeaderActions(null);
  }, [setHeaderActions, busy]);

  return (
    <>
      <Seo title="Plan | Business Coach" path={`/dashboard/coach/cases/${caseId}/plan`} noindex />
        {loading ? (
          <LoadingBlock />
        ) : (
          <div className="space-y-10">
            <ErrorBox error={error} onDismiss={() => setError(null)} />

            {/* Plan board */}
            <section>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                Service plan
              </h2>
              {items.length === 0 ? (
                <p className="text-sm text-gray-500 font-medium mb-4">
                  No plan items yet. Seed from diagnosis or add manually.
                </p>
              ) : (
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <article
                      key={item._id}
                      className="p-5 rounded-2xl border border-gray-100 bg-white"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-yellow-600">
                            Need
                          </p>
                          <h3 className="font-black text-gray-900">{item.need}</h3>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-3">
                        <span className="font-black text-gray-800">Objective: </span>
                        {item.objective}
                      </p>
                      {item.steps?.length > 0 && (
                        <ul className="text-xs text-gray-500 space-y-1 mb-3">
                          {item.steps.map((s, i) => (
                            <li key={i}>→ {typeof s === 'string' ? s : s.title || JSON.stringify(s)}</li>
                          ))}
                        </ul>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <select
                          value={item.status || 'draft'}
                          onChange={(e) => patchItem(item._id, { status: e.target.value })}
                          className={`${coachBtn} text-xs font-bold px-3 py-2 rounded-lg border border-gray-200 hover:border-yellow-300`}
                        >
                          {['draft', 'proposed', 'approved', 'in-progress', 'completed', 'cancelled'].map(
                            (s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            )
                          )}
                        </select>
                        {canApprove && item.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => approveItem(item._id)}
                            className={`${coachBtn} inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest`}
                          >
                            <CheckCircle2 size={12} /> Approve
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <form onSubmit={addItem} className="grid md:grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <input
                  value={newItem.need}
                  onChange={(e) => setNewItem({ ...newItem, need: e.target.value })}
                  placeholder="Need"
                  className="px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                />
                <input
                  value={newItem.objective}
                  onChange={(e) => setNewItem({ ...newItem, objective: e.target.value })}
                  placeholder="Objective"
                  className="px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className={`${coachBtn} md:col-span-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest hover:shadow-md`}
                >
                  <Plus size={14} /> Add plan item
                </button>
              </form>
            </section>

            {/* Goals */}
            <section>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                Goals
              </h2>
              <ul className="space-y-2 mb-4">
                {goals.map((g) => (
                  <li
                    key={g._id}
                    className="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-100"
                  >
                    <span className="font-bold text-gray-800 text-sm">{g.title}</span>
                    <select
                      value={g.status || 'open'}
                      onChange={async (e) => {
                        await coachApi.patchGoal(caseId, g._id, { status: e.target.value });
                        load();
                      }}
                      className={`${coachBtn} text-xs font-bold border border-gray-200 rounded-lg px-2 py-1 hover:border-yellow-300`}
                    >
                      {['open', 'in-progress', 'completed', 'cancelled'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newGoal.trim()) return;
                  await coachApi.createGoal(caseId, { title: newGoal.trim() });
                  setNewGoal('');
                  load();
                }}
                className="flex gap-2"
              >
                <input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="New goal title"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                />
                <button
                  type="submit"
                  className={`${coachBtn} px-4 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-xs font-black uppercase tracking-widest hover:shadow-md`}
                >
                  Add
                </button>
              </form>
            </section>

            {/* Actions */}
            <section>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Actions
                </h2>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className={`${coachBtn} text-xs font-bold border border-gray-200 rounded-lg px-3 py-2 hover:border-yellow-300`}
                >
                  <option value="">All</option>
                  {['pending', 'in-progress', 'completed', 'stalled', 'overdue', 'cancelled'].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>
              <ul className="space-y-2 mb-4">
                {actions.map((a) => (
                  <li
                    key={a._id}
                    className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border ${
                      a.status === 'overdue'
                        ? 'border-rose-200 bg-rose-50'
                        : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {a.status === 'overdue' && (
                        <AlertTriangle size={16} className="text-rose-500 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold text-sm text-gray-800">
                          {a.title || a.description || 'Action'}
                        </p>
                        {a.dueDate && (
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Due {new Date(a.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <select
                      value={a.status || 'pending'}
                      onChange={async (e) => {
                        await coachApi.patchAction(caseId, a._id, { status: e.target.value });
                        load();
                      }}
                      className={`${coachBtn} text-xs font-bold border border-gray-200 rounded-lg px-2 py-1 hover:border-yellow-300`}
                    >
                      {['pending', 'in-progress', 'completed', 'stalled', 'overdue', 'cancelled'].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        )
                      )}
                    </select>
                  </li>
                ))}
              </ul>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newAction.title.trim()) return;
                  await coachApi.createAction(caseId, {
                    title: newAction.title.trim(),
                    dueDate: newAction.dueDate || undefined,
                  });
                  setNewAction({ title: '', dueDate: '' });
                  load();
                }}
                className="flex flex-wrap gap-2"
              >
                <input
                  value={newAction.title}
                  onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                  placeholder="Action title"
                  className="flex-1 min-w-[160px] px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                />
                <input
                  type="date"
                  value={newAction.dueDate}
                  onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm"
                />
                <button
                  type="submit"
                  className={`${coachBtn} px-4 py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest hover:shadow-md`}
                >
                  Add action
                </button>
              </form>
            </section>
          </div>
        )}
    </>
  );
}
