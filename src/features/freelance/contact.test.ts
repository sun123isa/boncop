import { describe, expect, it } from "vitest";
import {
  formatCongoPhone,
  getPhoneHref,
  getWhatsAppHref,
  normalizeCongoPhone,
} from "./contact";

describe("formatCongoPhone", () => {
  it("espace un numéro local 2-3-2-2", () => {
    expect(formatCongoPhone("061234567")).toBe("06 123 45 67");
    expect(formatCongoPhone("06 1234567")).toBe("06 123 45 67");
  });

  it("formate un préfixe +242", () => {
    expect(formatCongoPhone("+242061234567")).toBe("+242 06 123 45 67");
    expect(formatCongoPhone("24261234567")).toBe("+242 06 123 45 67");
  });

  it("formate progressivement pendant la saisie", () => {
    expect(formatCongoPhone("06")).toBe("06");
    expect(formatCongoPhone("06123")).toBe("06 123");
    expect(formatCongoPhone("0612345")).toBe("06 123 45");
  });
});

describe("normalizeCongoPhone", () => {
  it("normalise vers l'affichage national", () => {
    expect(normalizeCongoPhone("061234567")).toBe("06 123 45 67");
    expect(normalizeCongoPhone("+242 6 123 45 67")).toBe("06 123 45 67");
    expect(normalizeCongoPhone("+242061234567")).toBe("06 123 45 67");
  });

  it("refuse un numéro non congolais / incomplet", () => {
    expect(normalizeCongoPhone("06123")).toBeNull();
    expect(normalizeCongoPhone("01 234 56 78")).toBeNull();
    expect(normalizeCongoPhone("")).toBeNull();
  });
});

describe("getPhoneHref", () => {
  it("normalise un numéro local congolais", () => {
    expect(getPhoneHref("06 123 45 67")).toBe("tel:+24261234567");
  });

  it("conserve un préfixe international sans le 0 national", () => {
    expect(getPhoneHref("+242061234567")).toBe("tel:+24261234567");
  });
});

describe("getWhatsAppHref", () => {
  it("construit un lien wa.me pour un numéro local", () => {
    expect(getWhatsAppHref("06 123 45 67")).toBe("https://wa.me/24261234567");
  });

  it("renvoie null pour une valeur vide", () => {
    expect(getWhatsAppHref("   ")).toBeNull();
  });
});
