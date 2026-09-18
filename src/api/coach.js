import api from './axios';

const unwrap = (response) => response.data;

export const COACH_CAPABILITIES = [
  { id: 'strategy', label: 'Strategy', description: 'Positioning, priorities, and growth bets' },
  { id: 'finance', label: 'Finance', description: 'Cash flow, unit economics, assumptions' },
  { id: 'marketing', label: 'Marketing', description: 'Audience, channels, and messaging' },
  { id: 'ops', label: 'Operations', description: 'Process, capacity, and delivery systems' },
  { id: 'business-plan', label: 'Business Plan', description: 'Structured plan narrative' },
  { id: 'capital', label: 'Capital', description: 'Raise readiness and funding options' },
  { id: 'pitch', label: 'Pitch', description: 'Pitch outline and talking points' },
];

export const CASE_STATUSES = ['draft', 'intake', 'diagnosed', 'active', 'paused', 'closed'];

export const REFERRAL_STATUSES = [
  'identified',
  'explained',
  'recommended',
  'referred',
  'tracking',
  'completed',
  'cancelled',
];

export const AI_CONSENT_CODE = 'AI_PRIVACY_CONSENT_REQUIRED';

export function parseCoachError(err, fallback = 'Something went wrong') {
  // Already-normalized coach error object
  if (err && typeof err === 'object' && err.message && (err.code !== undefined || err.status !== undefined) && !err.isAxiosError && !err.response) {
    return {
      message: err.message || fallback,
      details: err.details || null,
      status: err.status,
      code: err.code || null,
      data: err.data || null,
    };
  }

  const data = err?.response?.data;
  return {
    message: data?.message || err?.message || fallback,
    details: data?.details || null,
    status: err?.response?.status ?? err?.status,
    code: data?.code || null,
    data: data?.data || null,
  };
}

export function isAiConsentError(err) {
  // Always parse API/axios errors — do NOT use axios err.code (e.g. ERR_BAD_REQUEST)
  const parsed = parseCoachError(err);
  const msg = String(parsed.message || '').toLowerCase();
  return (
    parsed.code === AI_CONSENT_CODE ||
    msg.includes('ai privacy consent') ||
    msg.includes('privacy notice')
  );
}

export const coachApi = {
  // AI privacy consent
  getAiConsent: () => api.get('/coach/ai-consent').then(unwrap),
  acceptAiConsent: () => api.post('/coach/ai-consent', { accepted: true }).then(unwrap),

  // Cases
  createCase: (body) => api.post('/coach/cases', body).then(unwrap),
  listCases: (params) => api.get('/coach/cases', { params }).then(unwrap),
  getCase: (caseId) => api.get(`/coach/cases/${caseId}`).then(unwrap),
  deleteCase: (caseId) => api.delete(`/coach/cases/${caseId}`).then(unwrap),
  patchCase: (caseId, body) => api.patch(`/coach/cases/${caseId}`, body).then(unwrap),
  setCaseStatus: (caseId, body) => api.post(`/coach/cases/${caseId}/status`, body).then(unwrap),
  getTimeline: (caseId) => api.get(`/coach/cases/${caseId}/timeline`).then(unwrap),
  getIntakePrefill: (caseId) => api.get(`/coach/cases/${caseId}/intake/prefill`).then(unwrap),

  // Intake & diagnosis
  getIntakeSchema: (caseId) => api.get(`/coach/cases/${caseId}/intake/schema`).then(unwrap),
  saveIntake: (caseId, responses) =>
    api.put(`/coach/cases/${caseId}/intake`, { responses }).then(unwrap),
  listAssessments: (caseId) => api.get(`/coach/cases/${caseId}/assessments`).then(unwrap),
  runDiagnosis: (caseId) => api.post(`/coach/cases/${caseId}/diagnosis`, {}).then(unwrap),
  listDiagnoses: (caseId) => api.get(`/coach/cases/${caseId}/diagnoses`).then(unwrap),
  getDiagnosis: (caseId, diagnosisId) =>
    api.get(`/coach/cases/${caseId}/diagnoses/${diagnosisId}`).then(unwrap),
  getLatestDiagnosis: (caseId) =>
    api.get(`/coach/cases/${caseId}/diagnosis/latest`).then(unwrap),

  // Plan / goals / actions
  getPlan: (caseId) => api.get(`/coach/cases/${caseId}/plan`).then(unwrap),
  seedPlanFromDiagnosis: (caseId) =>
    api.post(`/coach/cases/${caseId}/plan/seed-from-diagnosis`, {}).then(unwrap),
  addPlanItem: (caseId, body) =>
    api.post(`/coach/cases/${caseId}/plan/items`, body).then(unwrap),
  patchPlanItem: (caseId, itemId, body) =>
    api.patch(`/coach/cases/${caseId}/plan/items/${itemId}`, body).then(unwrap),
  approvePlanItem: (caseId, itemId) =>
    api.post(`/coach/cases/${caseId}/plan/items/${itemId}/approve`, {}).then(unwrap),
  listGoals: (caseId) => api.get(`/coach/cases/${caseId}/goals`).then(unwrap),
  createGoal: (caseId, body) => api.post(`/coach/cases/${caseId}/goals`, body).then(unwrap),
  patchGoal: (caseId, goalId, body) =>
    api.patch(`/coach/cases/${caseId}/goals/${goalId}`, body).then(unwrap),
  listActions: (caseId, params) =>
    api.get(`/coach/cases/${caseId}/actions`, { params }).then(unwrap),
  createAction: (caseId, body) =>
    api.post(`/coach/cases/${caseId}/actions`, body).then(unwrap),
  patchAction: (caseId, actionId, body) =>
    api.patch(`/coach/cases/${caseId}/actions/${actionId}`, body).then(unwrap),

  // Chat
  chat: (caseId, body) => api.post(`/coach/cases/${caseId}/chat`, body).then(unwrap),
  listSessions: (caseId) => api.get(`/coach/cases/${caseId}/sessions`).then(unwrap),
  getSession: (caseId, sessionId) =>
    api.get(`/coach/cases/${caseId}/sessions/${sessionId}`).then(unwrap),
  deleteSession: (caseId, sessionId) =>
    api.delete(`/coach/cases/${caseId}/sessions/${sessionId}`).then(unwrap),
  saveChatArtifact: (caseId, sessionId, body) =>
    api
      .post(`/coach/cases/${caseId}/sessions/${sessionId}/save-artifact`, body)
      .then(unwrap),

  // Domains & artifacts
  generateDomain: (caseId, capability, body = {}) =>
    api.post(`/coach/cases/${caseId}/ai/${capability}`, body).then(unwrap),
  listArtifacts: (caseId, params) =>
    api.get(`/coach/cases/${caseId}/artifacts`, { params }).then(unwrap),
  getArtifact: (caseId, artifactId) =>
    api.get(`/coach/cases/${caseId}/artifacts/${artifactId}`).then(unwrap),
  exportArtifact: (caseId, artifactId, format = 'pdf') =>
    api.get(`/coach/cases/${caseId}/artifacts/${artifactId}/export`, {
      params: { format },
      responseType: format === 'pdf' ? 'blob' : 'json',
    }),

  // Human coach desk
  getCaseload: () => api.get('/coach/caseload').then(unwrap),
  getHumanRecord: (caseId) => api.get(`/coach/cases/${caseId}/human-record`).then(unwrap),
  addNote: (caseId, body) => api.post(`/coach/cases/${caseId}/notes`, body).then(unwrap),
  addCoachTask: (caseId, body) =>
    api.post(`/coach/cases/${caseId}/coach-tasks`, body).then(unwrap),
  escalateCase: (caseId, body = {}) =>
    api.post(`/coach/cases/${caseId}/escalate`, body).then(unwrap),
  generateCoachBrief: (caseId) =>
    api.post(`/coach/cases/${caseId}/coach-brief`, {}).then(unwrap),
  getCoachBrief: (caseId) => api.get(`/coach/cases/${caseId}/coach-brief`).then(unwrap),

  // Licensing & referrals
  getLicensing: (caseId, params) =>
    api.get(`/coach/cases/${caseId}/licensing`, { params }).then(unwrap),
  listReferrals: (caseId) => api.get(`/coach/cases/${caseId}/referrals`).then(unwrap),
  createReferral: (caseId, body) =>
    api.post(`/coach/cases/${caseId}/referrals`, body).then(unwrap),
  patchReferral: (caseId, referralId, body) =>
    api.patch(`/coach/cases/${caseId}/referrals/${referralId}`, body).then(unwrap),

  // Documents, validation, outcomes, reassess
  listDocuments: (caseId) => api.get(`/coach/cases/${caseId}/documents`).then(unwrap),
  addDocument: (caseId, body) =>
    api.post(`/coach/cases/${caseId}/documents`, body).then(unwrap),
  runDocumentReadiness: (caseId) =>
    api.post(`/coach/cases/${caseId}/document-readiness`, {}).then(unwrap),
  getDocumentReadiness: (caseId) =>
    api.get(`/coach/cases/${caseId}/document-readiness`).then(unwrap),
  runValidationReport: (caseId) =>
    api.post(`/coach/cases/${caseId}/validation-report`, {}).then(unwrap),
  listValidationReports: (caseId) =>
    api.get(`/coach/cases/${caseId}/validation-reports`).then(unwrap),
  listOutcomes: (caseId) => api.get(`/coach/cases/${caseId}/outcomes`).then(unwrap),
  createOutcome: (caseId, body) =>
    api.post(`/coach/cases/${caseId}/outcomes`, body).then(unwrap),
  reassess: (caseId, body = {}) =>
    api.post(`/coach/cases/${caseId}/reassess`, body).then(unwrap),

  // Dashboards, events, AI feedback, investor readiness
  getFounderDashboard: (caseId) =>
    api.get(`/coach/dashboards/founder/${caseId}`).then(unwrap),
  getProgramDashboard: () => api.get('/coach/dashboards/program').then(unwrap),
  getAiQualityDashboard: () => api.get('/coach/dashboards/ai-quality').then(unwrap),
  trackEvent: (body) => api.post('/coach/events', body).then(unwrap),
  submitAiFeedback: (caseId, body) =>
    api.post(`/coach/cases/${caseId}/ai-feedback`, body).then(unwrap),
  listAiFeedback: (caseId) => api.get(`/coach/cases/${caseId}/ai-feedback`).then(unwrap),
  runInvestorReadiness: (caseId) =>
    api.post(`/coach/cases/${caseId}/investor-readiness`, {}).then(unwrap),
  getInvestorReadiness: (caseId) =>
    api.get(`/coach/cases/${caseId}/investor-readiness`).then(unwrap),

  // Admin (superadmin + OTP)
  adminListUsers: (params) => api.get('/coach/admin/users', { params }).then(unwrap),
  adminUserCases: (userId) => api.get(`/coach/admin/users/${userId}/cases`).then(unwrap),
  adminListCases: (params) => api.get('/coach/admin/cases', { params }).then(unwrap),
  adminListPrompts: () => api.get('/coach/admin/prompts').then(unwrap),
  adminCreatePrompt: (body) => api.post('/coach/admin/prompts', body).then(unwrap),
  adminActivatePrompt: (id) =>
    api.post(`/coach/admin/prompts/${id}/activate`, {}).then(unwrap),
  adminListRubrics: () => api.get('/coach/admin/rubrics').then(unwrap),
  adminCreateRubric: (body) => api.post('/coach/admin/rubrics', body).then(unwrap),
  adminActivateRubric: (id) =>
    api.post(`/coach/admin/rubrics/${id}/activate`, {}).then(unwrap),
  adminListResources: () => api.get('/coach/admin/resources').then(unwrap),
  adminCreateResource: (body) => api.post('/coach/admin/resources', body).then(unwrap),
  adminPatchResource: (id, body) =>
    api.patch(`/coach/admin/resources/${id}`, body).then(unwrap),
};

/** Normalize list endpoints that may return a bare array or { data | sessions | cases }. */
export function normalizeCoachList(payload, extraKeys = []) {
  if (Array.isArray(payload)) return payload;
  const keys = ['data', 'sessions', 'cases', ...extraKeys];
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return [];
}

function triggerBrowserDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function filenameFromDisposition(headers, fallback) {
  const disposition = headers?.['content-disposition'] || '';
  const match = /filename="?([^"]+)"?/i.exec(disposition);
  return match?.[1] || fallback;
}

/**
 * Download artifact export (PDF blob or JSON file).
 * @param {'pdf'|'json'} format
 */
export async function downloadArtifactExport(caseId, artifactId, format = 'pdf') {
  const res = await coachApi.exportArtifact(caseId, artifactId, format);

  if (format === 'json') {
    const payload = res.data;
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    triggerBrowserDownload(blob, filenameFromDisposition(res.headers, `artifact-${artifactId}.json`));
    return;
  }

  const blob = res.data;
  const contentType = String(res.headers?.['content-type'] || blob?.type || '');

  if (contentType.includes('application/json') || blob?.type === 'application/json') {
    const text = await blob.text();
    let message = 'PDF export failed.';
    try {
      message = JSON.parse(text)?.message || message;
    } catch {
      /* ignore */
    }
    const err = new Error(message);
    err.response = { data: { message } };
    throw err;
  }

  triggerBrowserDownload(
    blob,
    filenameFromDisposition(res.headers, `artifact-${artifactId}.pdf`)
  );
}

export default coachApi;
