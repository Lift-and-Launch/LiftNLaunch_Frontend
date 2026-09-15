import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { coachApi, parseCoachError } from '../api/coach';
import { createRequestGuard } from '../components/coach/CoachShared';

const CoachCaseContext = createContext(null);

function normalizeCase(data) {
  if (!data) return null;
  return data.case || data;
}

export function CoachCaseProvider({ children }) {
  const { caseId } = useParams();
  const [caseMeta, setCaseMetaState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerActions, setHeaderActions] = useState(null);

  const setCaseMeta = useCallback((next) => {
    setCaseMetaState(normalizeCase(next));
  }, []);

  const patchCaseMeta = useCallback((partial) => {
    setCaseMetaState((prev) => (prev ? { ...prev, ...partial } : normalizeCase(partial)));
  }, []);

  const refreshCase = useCallback(
    async (isActive = () => true) => {
      if (!caseId) return null;
      try {
        const res = await coachApi.getCase(caseId);
        if (!isActive()) return null;
        const meta = normalizeCase(res.data);
        setCaseMetaState(meta);
        setError(null);
        return meta;
      } catch (err) {
        if (!isActive()) return null;
        setError(parseCoachError(err, 'Failed to load case'));
        return null;
      }
    },
    [caseId]
  );

  useEffect(() => {
    if (!caseId) return undefined;
    const guard = createRequestGuard();

    // Keep existing header when switching tabs for the same case; only clear on case change.
    setCaseMetaState((prev) => (prev?._id === caseId || prev?.id === caseId ? prev : null));
    setLoading(true);
    setError(null);
    setHeaderActions(null);

    (async () => {
      const meta = await refreshCase(() => !guard.cancelled);
      if (!guard.cancelled) {
        if (meta) setCaseMetaState(meta);
        setLoading(false);
      }
    })();

    return () => guard.cancel();
  }, [caseId, refreshCase]);

  const value = useMemo(
    () => ({
      caseId,
      caseMeta,
      setCaseMeta,
      patchCaseMeta,
      refreshCase,
      loading,
      error,
      setError,
      headerActions,
      setHeaderActions,
    }),
    [
      caseId,
      caseMeta,
      setCaseMeta,
      patchCaseMeta,
      refreshCase,
      loading,
      error,
      headerActions,
    ]
  );

  return <CoachCaseContext.Provider value={value}>{children}</CoachCaseContext.Provider>;
}

export function useCoachCase() {
  const ctx = useContext(CoachCaseContext);
  if (!ctx) {
    throw new Error('useCoachCase must be used within CoachCaseProvider');
  }
  return ctx;
}

/** Optional: pages outside the layout can skip if context missing */
export function useCoachCaseOptional() {
  return useContext(CoachCaseContext);
}
