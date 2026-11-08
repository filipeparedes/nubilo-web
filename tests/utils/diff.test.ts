import { describe, expect, it } from "vitest";
import { diffTexts, MAX_EDIT_LENGTH, splitLines } from "../../src/utils/diff";

describe("splitLines", () => {
  it("splits a text in lines", () => {
    expect(splitLines("a\nb\nc")).toEqual(["a", "b", "c"]);
  });

  it("ignores the final line break", () => {
    expect(splitLines("a\nb\n")).toEqual(["a", "b"]);
  });

  it("handles Windows line breaks", () => {
    expect(splitLines("a\r\nb\r\n")).toEqual(["a", "b"]);
  });

  it("gives no lines for an empty text", () => {
    expect(splitLines("")).toEqual([]);
  });

  it("keeps an empty line in the middle", () => {
    expect(splitLines("a\n\nb")).toEqual(["a", "", "b"]);
  });
});

describe("diffTexts", () => {
  it("marks every row as same when the texts are equal", () => {
    const rows = diffTexts("a\nb\n", "a\nb\n")!;
    expect(rows.map((r) => r.kind)).toEqual(["same", "same"]);
    expect(rows[1].left).toEqual({ number: 2, text: "b" });
    expect(rows[1].right).toEqual({ number: 2, text: "b" });
  });

  it("shows a replaced line as changed", () => {
    const rows = diffTexts("a\nb\nc", "a\nB\nc")!;
    expect(rows.map((r) => r.kind)).toEqual(["same", "changed", "same"]);
    expect(rows[1].left).toEqual({ number: 2, text: "b" });
    expect(rows[1].right).toEqual({ number: 2, text: "B" });
  });

  it("shows an inserted line as added, and numbers the lines after it", () => {
    const rows = diffTexts("a\nc", "a\nb\nc")!;
    expect(rows.map((r) => r.kind)).toEqual(["same", "added", "same"]);
    expect(rows[1]).toEqual({
      kind: "added",
      left: null,
      right: { number: 2, text: "b" },
    });
    expect(rows[2].left).toEqual({ number: 2, text: "c" });
    expect(rows[2].right).toEqual({ number: 3, text: "c" });
  });

  it("shows a deleted line as removed", () => {
    const rows = diffTexts("a\nb\nc", "a\nc")!;
    expect(rows.map((r) => r.kind)).toEqual(["same", "removed", "same"]);
    expect(rows[1]).toEqual({
      kind: "removed",
      left: { number: 2, text: "b" },
      right: null,
    });
  });

  it("pairs removed and added lines and leaves the extra ones alone", () => {
    const rows = diffTexts("a\nx\ny\nz\nd", "a\nP\nQ\nd")!;
    expect(rows.map((r) => r.kind)).toEqual([
      "same",
      "changed",
      "changed",
      "removed",
      "same",
    ]);
  });

  it("shows everything as added when the old text is empty", () => {
    const rows = diffTexts("", "a\nb")!;
    expect(rows.map((r) => r.kind)).toEqual(["added", "added"]);
  });

  it("shows everything as removed when the new text is empty", () => {
    const rows = diffTexts("a\nb", "")!;
    expect(rows.map((r) => r.kind)).toEqual(["removed", "removed"]);
  });

  it("gives no rows when both texts are empty", () => {
    expect(diffTexts("", "")).toEqual([]);
  });

  it("keeps the lines the texts have in common", () => {
    const rows = diffTexts("a\nb\nc\nd\ne", "a\nc\nX\ne")!;
    const same = rows.filter((r) => r.kind === "same").map((r) => r.left!.text);
    expect(same).toEqual(["a", "c", "e"]);
  });

  it("answers null when the texts are too different", () => {
    const side = MAX_EDIT_LENGTH + 1;
    const before = Array.from({ length: side }, (_, i) => `a${i}`).join("\n");
    const after = Array.from({ length: side }, (_, i) => `b${i}`).join("\n");
    expect(diffTexts(before, after)).toBeNull();
  });

  it("compares big files that only differ a little", () => {
    const lines = Array.from({ length: 50_000 }, (_, i) => `line ${i}`);
    const changed = [...lines];
    changed[25_000] = "different";
    const rows = diffTexts(lines.join("\n"), changed.join("\n"))!;
    expect(rows).toHaveLength(50_000);
    expect(rows.filter((r) => r.kind !== "same")).toHaveLength(1);
  });
});
