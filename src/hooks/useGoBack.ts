import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

// Returns a function that goes back to the previous page, or to the home
// page when the current one was opened directly and there is nowhere to go
// back to.
export function useGoBack() {
  const navigate = useNavigate();
  const location = useLocation();

  return () => {
    if (location.key === "default") navigate(ROUTES.home);
    else navigate(-1);
  };
}
