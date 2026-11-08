// Decodes bytes as UTF-8 text. Answers null when the bytes are not text, so
// the caller can say the format is not supported. A file counts as text when
// it has no NUL byte (binary formats such as images, PDFs and archives have
// them) and is valid UTF-8, which covers txt, csv, code, shell scripts,
// json, md and any other plain text.
export function decodeText(bytes: Uint8Array): string | null {
  if (bytes.includes(0)) return null;
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}
