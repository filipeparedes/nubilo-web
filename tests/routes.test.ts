import { describe, expect, it } from "vitest";
import { ROUTES, routeTo } from "../src/routes";

describe("routeTo.upload", () => {
  it("is the plain upload route without a folder", () => {
    expect(routeTo.upload()).toBe(ROUTES.upload);
    expect(routeTo.upload("")).toBe(ROUTES.upload);
  });

  it("carries the folder in the address", () => {
    const url = routeTo.upload("docs/2026");
    expect(new URL(url, "http://x").searchParams.get("folder")).toBe(
      "docs/2026",
    );
  });

  it("keeps spaces and special characters of the folder", () => {
    const url = routeTo.upload("my docs/a&b");
    expect(new URL(url, "http://x").searchParams.get("folder")).toBe(
      "my docs/a&b",
    );
  });
});
