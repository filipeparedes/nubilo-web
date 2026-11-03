// Saves a Blob as a file on the user's computer, as if it had been
// downloaded from a link.
export function saveBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  // Some browsers need a moment before the address can be released.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}