import { beforeEach, describe, expect, it, vi } from "vitest";
import { request } from "../../src/api/client";
import { compareVersions } from "../../src/api/resources/files";

vi.mock("../../src/api/client", () => ({ request: vi.fn() }));

beforeEach(() => {
  vi.mocked(request).mockReset();
});

describe("compareVersions", () => {
  it("asks for the comparison of two versions of a file", async () => {
    const summary = { fromVersion: 1, toVersion: 3, changes: [] };
    vi.mocked(request).mockResolvedValue(summary);

    const result = await compareVersions(7, 1, 3);

    expect(request).toHaveBeenCalledWith("/files/7/versions/compare", {
      query: { from: 1, to: 3 },
    });
    expect(result).toBe(summary);
  });
});
