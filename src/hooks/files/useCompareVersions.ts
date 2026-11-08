import { useQuery } from "@tanstack/react-query";
import { compareVersions } from "../../api/resources/files";

// The chunk-level summary of the difference between two versions of a file.
// It only runs once both versions are chosen. Its query key starts with
// "versions", so the restore of a version refreshes it too.
export function useCompareVersions(
  fileId: number,
  from: number | null,
  to: number | null,
) {
  return useQuery({
    queryKey: ["versions", fileId, "compare", from, to],
    queryFn: () => compareVersions(fileId, from!, to!),
    enabled: from !== null && to !== null,
  });
}
