import { useState } from "react";
import { errorMessage } from "../../api/errorMessage";
import { joinPath } from "../../utils/format";
import { useUploadFile } from "./useUploadFile";

export interface UploadItem {
  file: File;
  path: string;
  status: "pending" | "uploading" | "done" | "error";
  // The message of the failure, when the status is "error".
  error?: string;
}

// Uploads several files into a folder, one request per file and one after
// the other. A file that fails does not stop the others: each item keeps
// its own status.
export function useUploadFiles() {
  const { mutateAsync } = useUploadFile();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [running, setRunning] = useState(false);

  function update(index: number, patch: Partial<UploadItem>) {
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  async function start(files: File[], folder: string) {
    const list: UploadItem[] = files.map((file) => ({
      file,
      path: joinPath(folder, file.name),
      status: "pending",
    }));
    setItems(list);
    setRunning(true);

    for (const [index, { file, path }] of list.entries()) {
      update(index, { status: "uploading" });
      try {
        await mutateAsync({ file, path });
        update(index, { status: "done" });
      } catch (e) {
        update(index, { status: "error", error: errorMessage(e) });
      }
    }

    setRunning(false);
  }

  // Forgets the results of the last upload.
  function reset() {
    setItems([]);
  }

  return { items, running, start, reset };
}
