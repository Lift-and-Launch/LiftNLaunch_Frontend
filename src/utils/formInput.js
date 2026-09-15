/** Shared sanitize + validate helpers for campaign / business forms */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

/** Letters, spaces, hyphens, apostrophes (city, state, person names) */
export function sanitizeAlphaName(value, maxLen = 80) {
  return value.replace(/[^a-zA-Z\s.'-]/g, "").replace(/\s{2,}/g, " ").slice(0, maxLen);
}

/** Street address: letters, numbers, spaces, and common address punctuation */
export function sanitizeAddress(value, maxLen = 200) {
  return value.replace(/[^a-zA-Z0-9\s.,#'\/-]/g, "").replace(/\s{2,}/g, " ").slice(0, maxLen);
}

/** Business / campaign titles: letters, numbers, spaces, limited punctuation */
export function sanitizeBusinessText(value, maxLen = 120) {
  return value.replace(/[<>{}[\]\\|`~]/g, "").replace(/\s{2,}/g, " ").slice(0, maxLen);
}

/** Free text descriptions — strip angle brackets, cap length */
export function sanitizeDescription(value, maxLen = 1000) {
  return value.replace(/[<>]/g, "").slice(0, maxLen);
}

/** Digits only (optionally allow one leading + for phone country code handled separately) */
export function sanitizeDigits(value, maxLen = 20) {
  return value.replace(/\D/g, "").slice(0, maxLen);
}

/**
 * Phone: allow digits and formatting chars + ( ) - space
 * Strips letters and other symbols while typing
 */
export function sanitizePhone(value, maxLen = 20) {
  let cleaned = value.replace(/[^\d+()\-\s]/g, "");
  // Only one leading +
  cleaned = cleaned.replace(/(?!^)\+/g, "");
  if (cleaned.includes("+") && !cleaned.startsWith("+")) {
    cleaned = cleaned.replace(/\+/g, "");
  }
  return cleaned.slice(0, maxLen);
}

/** ZIP / postal: digits and optional hyphen (US) or alphanumeric postal codes */
export function sanitizeZip(value, maxLen = 12) {
  return value.replace(/[^a-zA-Z0-9\s-]/g, "").toUpperCase().slice(0, maxLen);
}

/** Positive money / counts: digits and one decimal point */
export function sanitizeDecimal(value, maxLen = 12) {
  let v = value.replace(/[^\d.]/g, "").slice(0, maxLen);
  const parts = v.split(".");
  if (parts.length > 2) {
    v = `${parts[0]}.${parts.slice(1).join("")}`;
  }
  return v;
}

/** Integer only (quantity, whole dollars) */
export function sanitizeInteger(value, maxLen = 12) {
  return value.replace(/\D/g, "").slice(0, maxLen);
}

/** Percentage 0–100 with optional decimal */
export function sanitizePercent(value) {
  let v = sanitizeDecimal(value, 6);
  const n = parseFloat(v);
  if (!Number.isNaN(n) && n > 100) return "100";
  return v;
}

export function isValidEmail(email) {
  return EMAIL_REGEX.test(String(email || "").trim());
}

/** At least 7 digits after stripping formatting */
export function isValidPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/** US ZIP 12345 or 12345-6789, or general 3–12 alphanumeric postal */
export function isValidZip(zip) {
  const z = String(zip || "").trim();
  if (/^\d{5}(-\d{4})?$/.test(z)) return true;
  if (/^[A-Z0-9][A-Z0-9\s-]{2,11}$/i.test(z) && /[0-9]/.test(z)) return true;
  return false;
}

export function isValidAlphaName(value, min = 2) {
  const v = String(value || "").trim();
  return v.length >= min && /^[a-zA-Z\s.'-]+$/.test(v);
}

export function isValidUrl(value) {
  const v = String(value || "").trim();
  if (!v) return true; // optional
  try {
    const u = new URL(v.startsWith("http") ? v : `https://${v}`);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Scroll to (and focus) the first invalid field after validation fails.
 * @param {Record<string, unknown>} errors
 * @param {string[]} [preferredOrder] - optional key order matching form layout
 * @param {Record<string, string>} [idMap] - map error key → element id when they differ
 */
export function scrollToFirstError(errors, preferredOrder, idMap = {}) {
  if (!errors || typeof errors !== "object") return;

  const keys = preferredOrder?.length
    ? preferredOrder.filter((k) => errors[k])
    : Object.keys(errors).filter((k) => errors[k]);

  const firstKey = keys[0];
  if (!firstKey) return;

  // Nested array errors (e.g. rewards[0].title)
  if (Array.isArray(errors[firstKey])) {
    const list = errors[firstKey];
    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      if (!row || typeof row !== "object") continue;
      const nestedKey = Object.keys(row)[0];
      if (!nestedKey) continue;
      const mapped = idMap[`${firstKey}.${nestedKey}`];
      const candidates = [
        mapped ? `${mapped}-${i}` : null,
        `reward${nestedKey.charAt(0).toUpperCase()}${nestedKey.slice(1)}-${i}`,
        `${firstKey}-${nestedKey}-${i}`,
      ].filter(Boolean);
      focusElementByIds(candidates);
      return;
    }
  }

  const elementId = idMap[firstKey] || firstKey;
  focusElementByIds([elementId]);
}

function focusElementByIds(ids) {
  requestAnimationFrame(() => {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      if (typeof el.focus === "function") {
        try {
          el.focus({ preventScroll: true });
        } catch {
          el.focus();
        }
      }
      break;
    }
  });
}
