import { useQuery } from "@tanstack/react-query";
import { getFolders } from "../../api/resources/folders";

// Every folder of the user, at any depth. The query key starts with
// "folder", so the invalidation that refreshes the listings after an
// upload or a delete refreshes the tree too.
export function useFolders() {
  return useQuery({ queryKey: ["folder", "all"], queryFn: getFolders });
}
