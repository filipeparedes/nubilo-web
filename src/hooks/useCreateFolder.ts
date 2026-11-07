import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder } from "../api/resources/folders";

// Creates a folder at a path. When it succeeds every listing and the folder
// tree are refreshed, so the new folder shows up.
export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (path: string) => createFolder(path),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["folder"] }),
  });
}
