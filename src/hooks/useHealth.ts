import { useQuery } from "@tanstack/react-query";
import { getHealth } from "../api/resources/health";

// The state of the API, checked again every 10 seconds. `isSuccess` means
// online, `isError` means offline, and `data.latencyMs` is how long the
// last answer took.
export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const start = performance.now();
      await getHealth();
      return { latencyMs: Math.round(performance.now() - start) };
    },
    refetchInterval: 10_000,
    retry: false,
  });
}
