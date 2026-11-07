import { useQuery } from "@tanstack/react-query";
import { getVersions } from "../api/resources/files";

// The history of a file. Its query key starts with "versions", so the
// restore of a version can refresh it with one invalidation.
export function useFileVersions(fileId: number) {
  return useQuery({
    queryKey: ["versions", fileId],
    queryFn: () => getVersions(fileId),
  });
}