import { describe, expect, it } from "vitest";
import type { FolderInfo } from "../../src/api/types";
import { ancestorIds, buildTree, displayPath } from "../../src/utils/tree";

function folder(id: number, path: string): FolderInfo {
  return { id, path, createdAt: "2026-04-01T10:00:00Z" };
}

describe("buildTree", () => {
  it("returns an empty tree when there are no folders", () => {
    expect(buildTree([])).toEqual([]);
  });

  it("keeps the top-level folders at the top", () => {
    const tree = buildTree([folder(1, "docs"), folder(2, "img")]);

    expect(tree.map((node) => node.name)).toEqual(["docs", "img"]);
    expect(tree[0].children).toEqual([]);
  });

  it("nests a folder under its parent", () => {
    const tree = buildTree([
      folder(1, "docs"),
      folder(2, "docs/sub"),
      folder(3, "img"),
    ]);

    expect(tree.map((node) => node.name)).toEqual(["docs", "img"]);
    expect(tree[0].children.map((node) => node.folder.id)).toEqual([2]);
  });

  it("nests several levels", () => {
    const tree = buildTree([
      folder(1, "a"),
      folder(2, "a/b"),
      folder(3, "a/b/c"),
    ]);

    expect(tree[0].children[0].children[0].name).toBe("c");
  });

  it("sorts the folders by name at every level", () => {
    const tree = buildTree([
      folder(1, "img"),
      folder(2, "docs/z"),
      folder(3, "docs"),
      folder(4, "docs/a"),
    ]);

    expect(tree.map((node) => node.name)).toEqual(["docs", "img"]);
    expect(tree[0].children.map((node) => node.name)).toEqual(["a", "z"]);
  });

  it("puts a folder whose parent is missing at the top", () => {
    const tree = buildTree([folder(1, "docs/sub")]);

    expect(tree).toHaveLength(1);
    expect(tree[0].name).toBe("sub");
  });
});

describe("ancestorIds", () => {
  const folders = [
    folder(1, "docs"),
    folder(2, "docs/2026"),
    folder(3, "docs/2026/april"),
    folder(4, "img"),
  ];

  it("lists the folders that contain a folder, outermost first", () => {
    expect(ancestorIds(folders, 3)).toEqual([1, 2]);
  });

  it("is empty for a top-level folder", () => {
    expect(ancestorIds(folders, 4)).toEqual([]);
  });

  it("is empty for an unknown id", () => {
    expect(ancestorIds(folders, 99)).toEqual([]);
  });

  it("skips a parent that is not in the list", () => {
    expect(ancestorIds([folder(1, "a/b/c")], 1)).toEqual([]);
  });
});

describe("displayPath", () => {
  const folders = [folder(1, "docs"), folder(2, "docs/2026")];

  it("is a slash for the root", () => {
    expect(displayPath(folders, null)).toBe("/");
  });

  it("is the path of the open folder", () => {
    expect(displayPath(folders, 2)).toBe("/docs/2026");
  });

  it("is a dash when no folder is open", () => {
    expect(displayPath(folders, undefined)).toBe("-");
  });

  it("is dots while the folders are loading", () => {
    expect(displayPath(undefined, 2)).toBe("...");
  });

  it("is dots for a folder that is not in the list", () => {
    expect(displayPath(folders, 99)).toBe("...");
  });
});
