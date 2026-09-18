import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CoachCaseShell, ErrorBox } from '../../components/coach/CoachShared';
import { CoachCaseProvider, useCoachCase } from '../../context/CoachCaseContext';

function CoachCaseLayoutInner() {
  const { caseMeta, error, setError, headerActions } = useCoachCase();
  const location = useLocation();
  // Chat/Intake manage their own internal scroll; other tabs scroll in the shell content.
  const pinnedScroll = /\/(chat|intake)\/?$/.test(location.pathname);

  return (
    <CoachCaseShell
      title={caseMeta?.title}
      status={caseMeta?.status}
      actions={headerActions}
      fillHeight
    >
      {error && <ErrorBox error={error} onDismiss={() => setError(null)} />}
      <div
        className={`flex-1 min-h-0 flex flex-col min-w-0 ${
          pinnedScroll ? 'overflow-hidden' : 'overflow-y-auto overscroll-contain'
        }`}
      >
        <Outlet />
      </div>
    </CoachCaseShell>
  );
}

/**
 * Persistent shell for a business case — header + tabs stay mounted across
 * Home / Intake / Diagnosis / … so the case name does not reload on every tab.
 */
export default function CoachCaseLayout() {
  return (
    <CoachCaseProvider>
      <CoachCaseLayoutInner />
    </CoachCaseProvider>
  );
}
