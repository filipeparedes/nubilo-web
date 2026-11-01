# components

The reusable pieces of the interface. They take their look and behavior from props, so the same component serves several screens: appearance through named props (`tone`, `size`, `invalid`...), behavior through the native props of the element (`onClick`, `type`, `value`...).

## Structure

| File | Role |
|---|---|
| `Button.tsx` | The terminal-style button, drawn as `[ label ]`. Tones: normal, danger, success, muted. |
| `Field.tsx` | A labelled input with the `>` prompt and the block cursor. `invalid` turns the border red. |
| `RuleTitle.tsx` | A section title drawn as a rule, with a slot at the end. |
| `Modal.tsx` | A dialog over a dimmed background. Closes with Escape, the backdrop or the button. |
| `StatusLine.tsx` | A one-line message: error, success or muted. |
| `Wordmark.tsx` | The app name, with the blinking cursor. |
| `EmptyState.tsx` | The message of a list with nothing to show. |
| `FilterBar.tsx` | The box that narrows a listing as you type, with the counter. |
| `DataTable.tsx` | A generic table driven by column definitions. It does not know what the rows hold. |
| `FileTable.tsx` | The listing of files and folders, built on `DataTable`. |
| `layouts/` | The shells that wrap the pages (see its README). |

## How it works

**Generic and specific.** `DataTable` only draws a header and rows from columns (`header`, `width` and a `render` function per cell). A table for a kind of data, such as `FileTable`, is the generic one with its columns defined. The version history will be built the same way.

**Seeing them.** With `npm run dev`, the page at `/components` shows the components with their variants.