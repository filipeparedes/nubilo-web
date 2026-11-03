import { useMutation } from "@tanstack/react-query";
import { downloadFile } from "../api/resources/files";
import type { FileInfo } from "../api/types";
import { saveBlob } from "../utils/download";
import { baseName } from "../utils/format";

// Downloads a file and saves it on the user's computer under its own
// name. Nothing changes on the server, so there is nothing to refresh.
export function useDownloadFile() {
  return useMutation({
    mutationFn: async (file: Pick<FileInfo, "id" | "path">) => {
      const blob = await downloadFile(file.id);
      saveBlob(blob, baseName(file.path));
    },
  });
}
