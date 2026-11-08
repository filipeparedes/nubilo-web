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

// What a folder holds directly: its subfolders and its files. `path` is
// the full path of the folder itself, and an empty string for the root.
export interface FolderContents {
  path: string;
  folders: FolderInfo[];
  files: FileInfo[];
}

// One version of a file, without its content.
export interface VersionInfo {
  version: number;
  size: number;
  contentType: string;
  createdAt: string;
}

// The history of a file: its full path and its versions, newest first. The
// first one is the current version.
export interface FileVersions {
  path: string;
  versions: VersionInfo[];
}

// A chunk that differs between two versions of a file. Positions are chunk
// positions, and a missing side means the chunk does not exist in that version.
export interface ChunkChange {
  position: number;
  from: string | null;
  to: string | null;
}

// The summary of the difference between two versions of a file, at chunk
// level. It has no text: the content is read by downloading the versions.
export interface VersionComparison {
  fromVersion: number;
  toVersion: number;
  fromSize: number;
  toSize: number;
  fromChunks: number;
  toChunks: number;
  unchangedChunks: number;
  changes: ChunkChange[];
}
