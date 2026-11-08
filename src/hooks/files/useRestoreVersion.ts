import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreVersion } from "../../api/resources/files";

// Restores an old version of a file. When it succeeds the history of the file
// is refreshed, to show the new version, and so are the listings, because the
// size and the date of the file changed.
export function useRestoreVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, version }: { fileId: number; version: number }) =>
      restoreVersion(fileId, version),
    onSuccess: (_result, { fileId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["versions", fileId] }),
        queryClient.invalidateQueries({ queryKey: ["folder"] }),
      ]),
  });
}
