import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "../../api/resources/files";

// Uploads a file. When it succeeds every listing is refreshed, since the
// query keys of the listings start with "folder".
export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, path }: { file: File; path: string }) =>
      uploadFile(file, path),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["folder"] }),
  });
}
