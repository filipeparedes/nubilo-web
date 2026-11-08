import { diffArrays } from "diff";

// One side of a row of the comparison: a line and its number in that version.
export interface DiffLine {
  number: number;
  text: string;
}

// One row of the side-by-side comparison. A row has a line on the left (the
// older version), on the right (the newer one), or both:
// - same: both sides hold the same line
// - changed: a line was replaced by another one
// - removed: only the left side has a line
// - added: only the right side has a line
export interface DiffRow {
  kind: "same" | "changed" | "removed" | "added";
  left: DiffLine | null;
  right: DiffLine | null;
}

// The most added and removed lines the comparison accepts. Beyond it the
// texts are too different to be compared in the browser.
export const MAX_EDIT_LENGTH = 5000;

// Splits a text in lines. A final line break does not start a new line.
export function splitLines(text: string): string[] {
  if (text === "") return [];
  const lines = text.split(/\r?\n/);
  if (lines[lines.length - 1] === "") lines.pop();
  return lines;
}

// Compares two texts line by line and lines the differences up side by side.
// Answers null when the texts differ in too many lines to be compared.
export function diffTexts(before: string, after: string): DiffRow[] | null {
  const changes = diffArrays(splitLines(before), splitLines(after), {
    maxEditLength: MAX_EDIT_LENGTH,
  });
  if (changes === undefined) return null;

  const rows: DiffRow[] = [];
  let left = 1;
  let right = 1;
  let removed: DiffLine[] = [];
  let added: DiffLine[] = [];

  // A block of removed lines next to a block of added lines is shown as
  // replaced lines, side by side. The ones left over stay alone.
  const flush = () => {
    const paired = Math.min(removed.length, added.length);
    for (let i = 0; i < paired; i++) {
      rows.push({ kind: "changed", left: removed[i], right: added[i] });
    }
    for (let i = paired; i < removed.length; i++) {
      rows.push({ kind: "removed", left: removed[i], right: null });
    }
    for (let i = paired; i < added.length; i++) {
      rows.push({ kind: "added", left: null, right: added[i] });
    }
    removed = [];
    added = [];
  };

  for (const change of changes) {
    for (const text of change.value) {
      if (change.removed) {
        removed.push({ number: left++, text });
      } else if (change.added) {
        added.push({ number: right++, text });
      } else {
        flush();
        rows.push({
          kind: "same",
          left: { number: left++, text },
          right: { number: right++, text },
        });
      }
    }
  }
  flush();
  return rows;
}
