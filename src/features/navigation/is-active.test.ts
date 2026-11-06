import { describe, expect, it } from "vitest";
import { isActivePath } from "./is-active";

describe("isActivePath", () => {
  it("marque Accueil actif uniquement sur /", () => {
    expect(isActivePath("/", "/", "exact")).toBe(true);
    expect(isActivePath("/search", "/", "exact")).toBe(false);
    expect(isActivePath("/about", "/", "exact")).toBe(false);
  });

  it("utilise exact par défaut pour /", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/search", "/")).toBe(false);
  });

  it("marque un lien prefix actif sur lui-même et ses enfants", () => {
    expect(isActivePath("/admin", "/admin")).toBe(true);
    expect(isActivePath("/admin/dashboard", "/admin")).toBe(true);
    expect(isActivePath("/about", "/admin")).toBe(false);
  });

  it("n'active pas un faux préfixe (ex. /search-results vs /search)", () => {
    expect(isActivePath("/search-results", "/search")).toBe(false);
    expect(isActivePath("/search/freelances", "/search")).toBe(true);
  });

  it("ignore les fragments d'ancre pour le matching", () => {
    expect(isActivePath("/", "/#comment")).toBe(true);
    expect(isActivePath("/about", "/#comment")).toBe(false);
  });

  it("ne marque jamais actif un href placeholder #", () => {
    expect(isActivePath("/", "#")).toBe(false);
    expect(isActivePath("/about", "#")).toBe(false);
  });

  it("normalise les trailing slashes", () => {
    expect(isActivePath("/about/", "/about", "exact")).toBe(true);
    expect(isActivePath("/admin/", "/admin")).toBe(true);
  });
});
