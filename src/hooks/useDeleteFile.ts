import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFile } from "../api/resources/files";

// Deletes a file with all its versions. When it succeeds every listing is
// refreshed, so the row disappears.
export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFile(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["folder"] }),
  });
}
