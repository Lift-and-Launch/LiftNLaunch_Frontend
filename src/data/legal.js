import { SUPPORT_EMAIL } from "../utils/contact";

/**
 * Values used by the Terms of Service and Privacy Policy pages.
 * Source: 2026-10-26 Legal drafts (Privacy Policy v1, Terms of Service v1).
 *
 * TODO(legal): confirm every value below with Oscar / the attorney before go-live.
 * - legalEntityName / mailingAddress: still {{placeholders}} in the drafts.
 * - Numeric values use the suggestions from the drafts' notes.
 * - disputeResolution: left null on purpose ("Don't pick without the attorney").
 */
export const LEGAL_CONFIG = {
  effectiveDate: "October 10, 2026",
  legalEntityName: "Lift & Launch",
  mailingAddress: null,
  contactEmail: SUPPORT_EMAIL,
  minimumAge: 18,
  deletionWindowDays: 30,
  responseDays: 30,
  gracePeriodDays: 7,
  priceNoticeDays: 30,
  trialDays: 15,
  governingLaw: "the State of California",
  disputeResolution: null,
};
