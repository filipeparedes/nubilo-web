export interface Config {
  api: { url: string };
}

let current: Config | null = null;

export async function loadConfig(): Promise<void> {
  const res = await fetch("/config.json");
  if (!res.ok) throw new Error(`Failed to load config.json (${res.status})`);
  const url = (await res.json())?.config?.api?.url;
  if (typeof url !== "string" || url === "") {
    throw new Error("config.api.url must be a non-empty string");
  }
  current = { api: { url } };
}

export function getConfig(): Config {
  if (!current) throw new Error("Config not loaded");
  return current;
}
