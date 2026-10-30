// Every backend path in one place. API calls use these instead of
// writing the strings by hand. The paths are defined by the backend.
export const ENDPOINTS = {
  health: "/health",

  register: "/auth/register",
  login: "/auth/login",
  logout: "/auth/logout",

  files: "/files",
  file: (id: number) => `/files/${id}`,
  versions: (id: number) => `/files/${id}/versions`,
  version: (id: number, version: number) => `/files/${id}/versions/${version}`,
  compare: (id: number) => `/files/${id}/versions/compare`,
  restore: (id: number, version: number) =>
    `/files/${id}/versions/${version}/restore`,

  folders: "/folders",
  folder: (id: number) => `/folders/${id}`,
} as const;