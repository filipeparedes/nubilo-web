import { ApiError } from "./client";

// Turns a failed call into a message for the user.
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return `${error.code} :: ${error.message}`;
  return "Could not reach the server.";
}