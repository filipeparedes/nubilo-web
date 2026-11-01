import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "./auth/RequireAuth";
import ComponentsPage from "./pages/ComponentsPage";
import { ROUTES } from "./routes";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { AppLayout } from "./components/layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.home} element={<p>home</p>} />
        </Route>
      </Route>
      {import.meta.env.DEV && (
        <Route path={ROUTES.components} element={<ComponentsPage />} />
      )}
    </Routes>
  );
}
