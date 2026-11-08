import { describe, expect, it } from "vitest";
import { decodeText } from "../../src/utils/text";

describe("decodeText", () => {
  it("decodes plain text", () => {
    const bytes = Uint8Array.from([104, 101, 108, 108, 111, 10]);
    expect(decodeText(bytes)).toBe("hello\n");
  });

  it("decodes UTF-8 with accents", () => {
    // "ção" in UTF-8
    const bytes = Uint8Array.from([0xc3, 0xa7, 0xc3, 0xa3, 0x6f]);
    expect(decodeText(bytes)).toBe("ção");
  });

  it("decodes an empty file as an empty string", () => {
    expect(decodeText(new Uint8Array())).toBe("");
  });

  it("answers null when there is a NUL byte", () => {
    const bytes = Uint8Array.from([104, 105, 0, 33]);
    expect(decodeText(bytes)).toBeNull();
  });

  it("answers null when the bytes are not valid UTF-8", () => {
    // 0xff can never appear in UTF-8
    const bytes = Uint8Array.from([104, 105, 0xff, 33]);
    expect(decodeText(bytes)).toBeNull();
  });

  it("answers null for the start of a PNG image", () => {
    const bytes = Uint8Array.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    expect(decodeText(bytes)).toBeNull();
  });
});
