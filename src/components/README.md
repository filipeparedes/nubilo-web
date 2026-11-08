# components

The reusable pieces of the interface. They take their look and behavior from props, so the same component serves several screens: appearance through named props (`tone`, `size`, `invalid`...), behavior through the native props of the element (`onClick`, `type`, `value`...).

## Structure

| Folder     | What it holds                                                      |
| ---------- | ------------------------------------------------------------------ |
| `ui/`      | The generic pieces. They know nothing about files or folders.      |
| `files/`   | The pieces made for files and folders, built on the ones in `ui/`. |
| `layouts/` | The shells that wrap the pages (see its README).                   |

### ui/

| File             | Role                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `Button.tsx`     | The terminal-style button, drawn as `[ label ]`. Tones: normal, danger, success, muted.    |
| `Field.tsx`      | A labelled input with the `>` prompt and the block cursor. `invalid` turns the border red. |
| `RuleTitle.tsx`  | A section title drawn as a rule, with a slot at the end.                                   |
| `Modal.tsx`      | A dialog over a dimmed background. Closes with Escape, the backdrop or the button.         |
| `StatusLine.tsx` | A one-line message: error, success or muted.                                               |
| `Wordmark.tsx`   | The app name, with the blinking cursor.                                                    |
| `EmptyState.tsx` | The message of a list with nothing to show.                                                |
| `FilterBar.tsx`  | The box that narrows a listing as you type, with the counter.                              |
| `DataTable.tsx`  | A generic table driven by column definitions. It does not know what the rows hold.         |

### files/

| File               | Role                                                                                                                                                                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FileTable.tsx`    | The listing of files and folders, built on `DataTable`. With `onOpenFolder`, `onDownload`, `onHistory`, `onDelete` and `onDeleteFolder` the folder names open the folder, each file gets its get, history and del buttons and each folder its del button. |
| `VersionTable.tsx` | The history of a file, built on `DataTable`: one row per version, with the current one marked. With `onDownload` and `onRestore` each version gets its get and restore buttons, and the current version has no restore.                                   |
| `FileExplorer.tsx` | The tree of all the folders for the side panel. Folders start closed, except the ones that hold the current folder, and an arrow opens or closes each one. It loads nothing: it gets the folders by prop.                                                 |
| `FileDropZone.tsx` | A box to drop files on, or click to browse. It lists the chosen files and does not upload anything.                                                                                                                                                       |
| `DiffView.tsx`     | Two versions of a text side by side, line by line, with the lines numbered, the removed ones in red on the left and the added ones in green on the right. It receives the rows already lined up (`DiffRow[]`) and only draws them.                        |

## How it works

**Generic and specific.** `DataTable` only draws a header and rows from columns (`header`, `width` and a `render` function per cell). A table for a kind of data, such as `FileTable` or `VersionTable`, is the generic one with its columns defined.

**Seeing them.** With `npm run dev`, the page at `/components` shows the components with their variants.
