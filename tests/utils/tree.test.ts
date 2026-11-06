import { describe, expect, it } from "vitest";
import type { FolderInfo } from "../../src/api/types";
import { buildTree } from "../../src/utils/tree";

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
