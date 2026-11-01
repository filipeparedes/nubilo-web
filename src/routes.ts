export const ROUTES = {
  login: "/login",
  register: "/register",
  components: "/components",
  upload: "/upload",
  home: "/",

  // Routes with parameters: these patterns go in <Route path>. To build
  // the real path of a link, use routeTo below.
  folder: "/folders/:folderId",
  history: "/files/:fileId/history",
  compare: "/files/:fileId/compare",
} as const;

export const routeTo = {
  folder: (folderId: number) => `/folders/${folderId}`,
  history: (fileId: number) => `/files/${fileId}/history`,
  compare: (fileId: number) => `/files/${fileId}/compare`,
};
