import api from './axios';

const unwrap = (response) => response.data;

export const campaignAiApi = {
  getCompletion: (campaignId) =>
    api.get(`/campaigns/${campaignId}/ai/completion`).then(unwrap),

  generateSuggestions: (campaignId) =>
    api.post(`/campaigns/${campaignId}/ai/suggestions`, {}).then(unwrap),

  listSuggestions: (campaignId) =>
    api.get(`/campaigns/${campaignId}/ai/suggestions`).then(unwrap),

  acceptSuggestion: (campaignId, sid, itemId) =>
    api
      .post(`/campaigns/${campaignId}/ai/suggestions/${sid}/items/${itemId}/accept`, {})
      .then(unwrap),

  editSuggestion: (campaignId, sid, itemId, editedValue) =>
    api
      .post(`/campaigns/${campaignId}/ai/suggestions/${sid}/items/${itemId}/edit`, {
        editedValue,
      })
      .then(unwrap),

  dismissSuggestion: (campaignId, sid, itemId) =>
    api
      .post(`/campaigns/${campaignId}/ai/suggestions/${sid}/items/${itemId}/dismiss`, {})
      .then(unwrap),

  deleteSuggestionSet: (campaignId, sid) =>
    api.delete(`/campaigns/${campaignId}/ai/suggestions/${sid}`).then(unwrap),

  generateQualityScore: (campaignId) =>
    api.post(`/campaigns/${campaignId}/ai/quality-score`, {}).then(unwrap),

  listQualityScores: (campaignId) =>
    api.get(`/campaigns/${campaignId}/ai/quality-score`).then(unwrap),

  deleteQualityScore: (campaignId, scoreId) =>
    api.delete(`/campaigns/${campaignId}/ai/quality-score/${scoreId}`).then(unwrap),

  generateLandingDraft: (campaignId) =>
    api.post(`/websites/${campaignId}/ai/draft`, {}).then(unwrap),

  listLandingDrafts: (campaignId) =>
    api.get(`/websites/${campaignId}/ai/drafts`).then(unwrap),

  getLandingDraft: (campaignId, draftId) =>
    api.get(`/websites/${campaignId}/ai/drafts/${draftId}`).then(unwrap),

  deleteLandingDraft: (campaignId, draftId) =>
    api.delete(`/websites/${campaignId}/ai/drafts/${draftId}`).then(unwrap),

  applyLandingDraft: async (campaignId, elements, version = 'A') => {
    const current = await api.get(`/websites/${campaignId}?v=${version}`);
    const website = current.data?.data || {};
    const payload = {
      ...website,
      campaignId,
      elements,
      updatedAt: new Date().toISOString(),
    };
    return api.put(`/websites/${campaignId}?v=${version}`, payload).then(unwrap);
  },

  generateAdDraft: (campaignId, platform) =>
    api.post(`/campaigns/${campaignId}/ai/ads`, { platform }).then(unwrap),

  listAdDrafts: (campaignId) =>
    api.get(`/campaigns/${campaignId}/ai/ads`).then(unwrap),

  getAdDraft: (campaignId, draftId) =>
    api.get(`/campaigns/${campaignId}/ai/ads/${draftId}`).then(unwrap),

  deleteAdDraft: (campaignId, draftId) =>
    api.delete(`/campaigns/${campaignId}/ai/ads/${draftId}`).then(unwrap),

  exportAdDraft: (campaignId, draftId, format = 'text') =>
    api.get(`/campaigns/${campaignId}/ai/ads/${draftId}/export`, {
      params: { format },
      responseType: format === 'text' ? 'text' : 'json',
    }),
};

export const STEP_ROUTES = {
  create: '/dashboard/campaign/create',
  type: '/dashboard/campaign/select-type',
  business: '/dashboard/campaign/register-business',
  configure: '/dashboard/campaign/configure',
  review: '/dashboard/campaign/review',
};

export function parseAiError(error) {
  const data = error?.response?.data;
  return {
    status: error?.response?.status,
    message: data?.message || error?.message || 'Something went wrong',
    details: data?.details || null,
  };
}
