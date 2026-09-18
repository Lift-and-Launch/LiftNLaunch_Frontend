import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Briefcase, Sparkles, ArrowRight, Users, Trash2, Loader2, X } from 'lucide-react';
import api from '../../api/axios';
import { coachApi, normalizeCoachList, parseCoachError } from '../../api/coach';
import { useAuth } from '../../context/AuthContext';
import { canDeleteCoachCase, isCoachRole } from '../../utils/roles';
import { StatusBadge, LoadingBlock, ErrorBox, createRequestGuard, coachBtn, coachLink } from '../../components/coach/CoachShared';
import Seo from '../../seo/Seo';

function DeleteCaseModal({ target, deleting, error, onClose, onConfirm }) {
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
          <h3 className="text-lg font-black text-gray-900">Delete business case?</h3>
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
          <span className="font-black text-gray-900">{target.title || 'Untitled case'}</span>{' '}
          will be removed from your list. This cannot be undone from the app.
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
            {deleting ? 'Deleting…' : 'Delete case'}
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

export default function CoachCases() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const showCaseload = isCoachRole(user?.role);
  const canDelete = canDeleteCoachCase(user);
  const [cases, setCases] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('My Business Case');
  const [campaignId, setCampaignId] = useState(location.state?.campaignId || '');
  const [showForm, setShowForm] = useState(!!location.state?.campaignId);

  useEffect(() => {
    const guard = createRequestGuard();
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const [casesRes, campaignsRes] = await Promise.all([
          coachApi.listCases(),
          api.get('/campaigns').catch(() => ({ data: { data: [] } })),
        ]);
        if (guard.cancelled) return;
        setCases(normalizeCoachList(casesRes, ['cases']));
        const campData = campaignsRes.data?.data;
        setCampaigns(Array.isArray(campData) ? campData : []);
      } catch (err) {
        if (guard.cancelled) return;
        setError(parseCoachError(err, 'Failed to load business cases'));
      } finally {
        if (!guard.cancelled) setLoading(false);
      }
    })();
    return () => guard.cancel();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || creating) return;
    setCreating(true);
    setError(null);
    try {
      const body = { title: title.trim() };
      if (campaignId) body.campaignId = campaignId;
      const res = await coachApi.createCase(body);
      const created = res.data?.case || res.data;
      const id = created?._id;
      if (!id) throw new Error('Case created but no id returned');
      // Linked campaigns → go straight to intake so prefill is visible
      navigate(
        campaignId
          ? `/dashboard/coach/cases/${id}/intake`
          : `/dashboard/coach/cases/${id}`
      );
    } catch (err) {
      setError(parseCoachError(err, 'Failed to create case'));
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id || deleting) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await coachApi.deleteCase(deleteTarget._id);
      setCases((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(parseCoachError(err, 'Could not delete case').message);
    } finally {
      setDeleting(false);
    }
  };

  const onCampaignChange = (id) => {
    setCampaignId(id);
    if (!id) return;
    const camp = campaigns.find((c) => c._id === id);
    const name = camp?.campaignName || camp?.title;
    if (name && (title === 'My Business Case' || title.startsWith('Business Case — '))) {
      setTitle(`Business Case — ${name}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Business Coach | Lift & Launch"
        description="Case-based business coaching: intake, diagnosis, plans, and AI coach chat."
        path="/dashboard/coach"
        noindex
      />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-yellow-600 mb-2">
              Business Coach
            </p>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              Your Business Cases
            </h1>
            <p className="text-gray-500 font-medium max-w-xl">
              A guided journey — intake, diagnosis, service plan, domain workspaces,
              and ongoing AI coaching. Not a single chatbot.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className={`${coachBtn} inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
            >
              <Plus size={16} /> Start Business Case
            </button>
            {showCaseload && (
              <Link
                to="/dashboard/coach/caseload"
                className={`${coachBtn} inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-gray-200 text-gray-800 font-black text-xs uppercase tracking-widest hover:border-yellow-300 hover:shadow-md hover:-translate-y-0.5`}
              >
                <Users size={16} /> Coach caseload
              </Link>
            )}
          </div>
        </div>

        <DeleteCaseModal
          target={deleteTarget}
          deleting={deleting}
          error={deleteError}
          onClose={() => {
            if (deleting) return;
            setDeleteTarget(null);
            setDeleteError('');
          }}
          onConfirm={confirmDelete}
        />

        <ErrorBox error={error} onDismiss={() => setError(null)} />

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="mb-10 p-8 rounded-[2rem] border border-gray-100 bg-gray-50/80 space-y-5"
          >
            <h2 className="text-lg font-black text-gray-900">Create a case</h2>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white font-bold"
                placeholder="My Business Case"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                Link a campaign (optional)
              </label>
              <select
                value={campaignId}
                onChange={(e) => onCampaignChange(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white font-bold"
              >
                <option value="">Blank case — no campaign</option>
                {campaigns.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.campaignName || c.title || c._id}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-400 font-medium">
                Linking a campaign prefills intake (industry, offering, customers, etc.) from your
                campaign and business profile. You can edit anything after.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className={`${coachBtn} px-6 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-lg hover:-translate-y-0.5 ring-0 hover:ring-2 hover:ring-yellow-400/50`}
              >
                {creating ? 'Creating…' : 'Create case'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={`${coachBtn} px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-gray-500 border border-transparent hover:text-gray-900 hover:bg-gray-100 hover:border-gray-200 hover:shadow-sm hover:-translate-y-0.5`}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <LoadingBlock label="Loading cases" />
        ) : cases.length === 0 ? (
          <div className="text-center py-20 rounded-[2.5rem] border border-dashed border-gray-200 bg-gray-50/50">
            <Briefcase className="mx-auto text-gray-300 mb-4" size={40} />
            <h3 className="text-xl font-black text-gray-900 mb-2">No cases yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start a Business Case to diagnose your venture and build a coached action plan.
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className={`${coachBtn} inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-500 font-black text-xs uppercase tracking-widest hover:shadow-md hover:-translate-y-0.5`}
            >
              <Sparkles size={14} /> Start Business Case
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {cases.map((c) => (
              <article
                key={c._id}
                className="group p-6 rounded-[2rem] border border-gray-100 bg-white hover:border-yellow-300 hover:shadow-md transition-all duration-200"
              >
                <Link to={`/dashboard/coach/cases/${c._id}`} className="block">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-black text-gray-900 group-hover:text-yellow-700 transition-colors min-w-0">
                      {c.title || 'Untitled case'}
                    </h3>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-gray-400 font-bold">
                    Updated {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : '—'}
                  </p>
                </Link>
                <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-gray-100">
                  <Link
                    to={`/dashboard/coach/cases/${c._id}`}
                    className={`${coachLink} inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-yellow-600`}
                  >
                    Open case <ArrowRight size={14} />
                  </Link>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError('');
                        setDeleteTarget(c);
                      }}
                      className={`${coachBtn} inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50`}
                    >
                      <Trash2 size={13} aria-hidden />
                      Delete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
