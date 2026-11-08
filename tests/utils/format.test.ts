import { describe, expect, it } from "vitest";
import {
  baseName,
  formatDate,
  formatSize,
  joinPath,
  versionedName,
} from "../../src/utils/format";

describe("baseName", () => {
  it("returns the last part of a path", () => {
    expect(baseName("docs/2026/notes.txt")).toBe("notes.txt");
  });

  it("returns a plain name unchanged", () => {
    expect(baseName("notes.txt")).toBe("notes.txt");
  });
});

describe("formatSize", () => {
  it("shows bytes below 1 KB", () => {
    expect(formatSize(512)).toBe("512 B");
  });

  it("scales to the right unit", () => {
    expect(formatSize(18841)).toBe("18.4 KB");
    expect(formatSize(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});

describe("formatDate", () => {
  it("drops the seconds and the T", () => {
    expect(formatDate("2026-04-08T16:42:10Z")).toBe("2026-04-08 16:42");
  });
});

describe("joinPath", () => {
  it("joins a folder and a name", () => {
    expect(joinPath("docs", "a.txt")).toBe("docs/a.txt");
  });

  it("ignores slashes and spaces around the folder", () => {
    expect(joinPath(" /docs/2026/ ", "a.txt")).toBe("docs/2026/a.txt");
  });

  it("gives just the name when the folder is empty", () => {
    expect(joinPath("", "a.txt")).toBe("a.txt");
    expect(joinPath("  ", "a.txt")).toBe("a.txt");
  });
});

describe("versionedName", () => {
  it("puts the version before the extension", () => {
    expect(versionedName("notes.txt", 2)).toBe("notes-v2.txt");
  });

  it("keeps only the last extension after the version", () => {
    expect(versionedName("archive.tar.gz", 3)).toBe("archive.tar-v3.gz");
  });

  it("adds the suffix to a name without an extension", () => {
    expect(versionedName("README", 1)).toBe("README-v1");
  });

  it("treats a leading dot as part of the name", () => {
    expect(versionedName(".env", 4)).toBe(".env-v4");
  });
});
