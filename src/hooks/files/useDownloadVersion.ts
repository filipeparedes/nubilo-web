import { useMutation } from "@tanstack/react-query";
import { downloadVersion } from "../../api/resources/files";
import { saveBlob } from "../../utils/download";
import { baseName, versionedName } from "../../utils/format";

// Downloads one version of a file and saves it on the user's computer, named
// after the file with the version in it ("notes-v2.txt"). Nothing changes on
// the server, so there is nothing to refresh.
export function useDownloadVersion() {
  return useMutation({
    mutationFn: async ({
      fileId,
      path,
      version,
    }: {
      fileId: number;
      path: string;
      version: number;
    }) => {
      const blob = await downloadVersion(fileId, version);
      saveBlob(blob, versionedName(baseName(path), version));
    },
  });
}
