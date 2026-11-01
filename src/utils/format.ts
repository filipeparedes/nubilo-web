// The last part of a path: "docs/2026/notes.txt" becomes "notes.txt".
export function baseName(path: string): string {
  return path.split("/").filter(Boolean).pop() ?? path;
}

// A size in bytes as text: 18841 becomes "18.4 KB".
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(1)} ${units[unit]}`;
}

// A timestamp as "2026-04-08 16:42".
export function formatDate(timestamp: string): string {
  return timestamp.replace("T", " ").slice(0, 16);
}