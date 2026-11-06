import { describe, expect, it } from "vitest";
import {
  buildAdminDashboardHref,
  buildPaginatedResult,
  parsePage,
} from "./pagination";

describe("pagination helpers", () => {
  it("parse une page valide", () => {
    expect(parsePage("3")).toBe(3);
    expect(parsePage(["2"])).toBe(2);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("abc")).toBe(1);
  });

  it("borne la page au total disponible", () => {
    expect(buildPaginatedResult(["a"], 25, 99, 10)).toEqual({
      items: ["a"],
      total: 25,
      page: 3,
      pageSize: 10,
      totalPages: 3,
    });
  });

  it("construit les URLs du dashboard", () => {
    expect(buildAdminDashboardHref({})).toBe("/admin/dashboard");
    expect(
      buildAdminDashboardHref({
        status: "ATTENTE",
        page: 2,
        metiersPage: 3,
      }),
    ).toBe("/admin/dashboard?status=ATTENTE&page=2&metiersPage=3");
  });
});
