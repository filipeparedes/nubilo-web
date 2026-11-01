// What the backend sends for files and folders. A path is the full path
// from the root, for example "docs/2026/notes.txt".
export interface FileInfo {
  id: number;
  path: string;
  size: number;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderInfo {
  id: number;
  path: string;
  createdAt: string;
}

// What a folder holds directly: its subfolders and its files.
export interface FolderContents {
  folders: FolderInfo[];
  files: FileInfo[];
}