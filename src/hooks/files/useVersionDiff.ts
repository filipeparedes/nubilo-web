import { useQuery } from "@tanstack/react-query";
import { downloadVersion } from "../../api/resources/files";
import type { VersionDiff } from "../../utils/diff";
import { diffTexts } from "../../utils/diff";
import { decodeText } from "../../utils/text";

// The biggest version, in bytes, that is read to be compared.
export const MAX_COMPARE_BYTES = 2 * 1024 * 1024;

// Downloads two versions of a file and compares their text, line by line.
// It runs once both versions are chosen. A file that is not text, or is too
// big, answers with the reason instead of rows. A version never changes, so
// the same pair is not downloaded twice.
export function useVersionDiff(
  fileId: number,
  from: number | null,
  to: number | null,
) {
  return useQuery({
    queryKey: ["versions", fileId, "diff", from, to],
    queryFn: async (): Promise<VersionDiff> => {
      const [before, after] = await Promise.all([
        downloadVersion(fileId, from!),
        downloadVersion(fileId, to!),
      ]);
      if (before.size > MAX_COMPARE_BYTES || after.size > MAX_COMPARE_BYTES) {
        return { kind: "tooLarge" };
      }

      const textBefore = decodeText(new Uint8Array(await before.arrayBuffer()));
      const textAfter = decodeText(new Uint8Array(await after.arrayBuffer()));
      if (textBefore === null || textAfter === null) {
        return { kind: "unsupported" };
      }

      const rows = diffTexts(textBefore, textAfter);
      return rows === null ? { kind: "tooLarge" } : { kind: "text", rows };
    },
    enabled: from !== null && to !== null,
    staleTime: Infinity,
  });
}