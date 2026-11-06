/**
 * Utilitaires téléphone Congo-Brazzaville (+242).
 * Affichage national : `06 123 45 67` (groupes 2-3-2-2).
 */

const NATIONAL_MAX = 9;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Groupes nationaux : 06 123 45 67
 */
function formatNationalGroups(digits: string): string {
  const d = digits.slice(0, NATIONAL_MAX);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
  if (d.length <= 7) {
    return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
  }
  return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}`;
}

/**
 * Formate un numéro pour l'affichage / la saisie (espaces congolais).
 * Accepte local (`06…`) ou international (`+242…` / `242…`).
 */
export function formatCongoPhone(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const hasPlus = trimmed.startsWith("+");
  const digits = digitsOnly(trimmed);

  if (!digits) {
    return hasPlus ? "+" : "";
  }

  if (hasPlus || digits.startsWith("242")) {
    let national = (
      digits.startsWith("242") ? digits.slice(3) : digits
    ).slice(0, NATIONAL_MAX);

    // E.164 sans le 0 national → réintroduire pour l'affichage
    if (!national.startsWith("0") && /^[56]\d{0,7}$/.test(national)) {
      national = `0${national}`.slice(0, NATIONAL_MAX);
    }

    const groups = formatNationalGroups(national);
    return groups ? `+242 ${groups}` : "+242";
  }

  return formatNationalGroups(digits);
}

/**
 * Extrait le numéro national (9 chiffres avec 0) ou null si invalide.
 * Mobile CG : 05 / 06 + 7 chiffres.
 */
export function toCongoNationalDigits(phone: string): string | null {
  const digits = digitsOnly(phone);
  if (!digits) return null;

  let national = digits.startsWith("242") ? digits.slice(3) : digits;

  if (!national.startsWith("0") && /^[56]\d{7}$/.test(national)) {
    national = `0${national}`;
  }

  if (!/^0[56]\d{7}$/.test(national)) {
    return null;
  }

  return national;
}

/**
 * Normalise pour stockage : `06 123 45 67`, ou null si vide / invalide.
 */
export function normalizeCongoPhone(
  phone: string | null | undefined,
): string | null {
  const value = String(phone ?? "").trim();
  if (!value) return null;

  const national = toCongoNationalDigits(value);
  if (!national) return null;

  return formatNationalGroups(national);
}

/**
 * Construit un lien tel: E.164 (+242…) à partir d'un numéro libre.
 */
export function getPhoneHref(phone: string): string {
  const national = toCongoNationalDigits(phone);
  if (national) {
    return `tel:+242${national.slice(1)}`;
  }

  const value = phone.trim();
  const digits = digitsOnly(value);
  if (!digits) return "tel:";

  if (value.startsWith("+") || digits.startsWith("242")) {
    const rest = digits.startsWith("242") ? digits.slice(3) : digits;
    const withoutTrunk = rest.startsWith("0") ? rest.slice(1) : rest;
    return `tel:+242${withoutTrunk}`;
  }

  if (digits.startsWith("0")) {
    return `tel:+242${digits.slice(1)}`;
  }

  return `tel:${digits}`;
}

/**
 * Construit un lien WhatsApp (wa.me) ou null si le numéro est inutilisable.
 */
export function getWhatsAppHref(phone: string): string | null {
  const national = toCongoNationalDigits(phone);
  if (national) {
    return `https://wa.me/242${national.slice(1)}`;
  }

  const value = phone.trim();
  const digits = digitsOnly(value);
  if (!digits) return null;

  if (value.startsWith("+") || digits.startsWith("242")) {
    const rest = digits.startsWith("242") ? digits.slice(3) : digits;
    const withoutTrunk = rest.startsWith("0") ? rest.slice(1) : rest;
    return `https://wa.me/242${withoutTrunk}`;
  }

  if (digits.startsWith("0")) {
    return `https://wa.me/242${digits.slice(1)}`;
  }

  return null;
}
