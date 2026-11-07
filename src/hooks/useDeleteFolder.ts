import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFolder } from "../api/resources/folders";

// Deletes a folder with everything inside it. When it succeeds every listing
// and the folder tree are refreshed, so the folder disappears.
export function useDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFolder(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["folder"] }),
  });
}