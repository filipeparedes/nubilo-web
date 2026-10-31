import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "./auth/RequireAuth";
import { ROUTES } from "./routes";

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.login} element={<p>login</p>} />
      <Route element={<RequireAuth />}>
        <Route path={ROUTES.home} element={<p>home</p>} />
      </Route>
    </Routes>
  );
}
