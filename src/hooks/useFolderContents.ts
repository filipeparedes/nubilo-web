import { useQuery } from "@tanstack/react-query";
import { getFolderContents, getRootContents } from "../api/resources/folders";

// The contents of a folder, or of the root when no id is given. The query
// key starts with "folder", so after an upload or a delete a single
// invalidation of ["folder"] refreshes every listing.
export function useFolderContents(folderId?: number) {
  return useQuery({
    queryKey: ["folder", folderId ?? "root"],
    queryFn: () =>
      folderId === undefined ? getRootContents() : getFolderContents(folderId),
  });
}
