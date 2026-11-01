import { request } from "../client";
import { ENDPOINTS } from "../endpoints";

// Asks the server whether it is up. Only the fact that it answers matters.
export function getHealth() {
  return request<unknown>(ENDPOINTS.health);
}