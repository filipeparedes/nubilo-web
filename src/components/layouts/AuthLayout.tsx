import { NavLink, Outlet } from "react-router-dom";
import { ROUTES } from "../../routes";
import { Button } from "../Button";
import { RuleTitle } from "../RuleTitle";
import { Wordmark } from "../Wordmark";

// Shell shared by the login and register pages: the app name, the
// switch between the two pages and the box where the page is drawn.
// <Outlet /> is where the current page appears.
export function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <section className="w-full max-w-md">
        <Wordmark size="lg" />
        <p className="mt-1 mb-6 text-accent-dim">SELF-HOSTED OBJECT STORAGE</p>

        <RuleTitle title="secure session" />

        <nav className="my-4 flex gap-4" aria-label="Authentication mode">
          <NavLink to={ROUTES.login}>
            {({ isActive }) => (
              <Button tone={isActive ? "success" : "normal"} tabIndex={-1}>
                login
              </Button>
            )}
          </NavLink>
          <NavLink to={ROUTES.register}>
            {({ isActive }) => (
              <Button tone={isActive ? "success" : "normal"} tabIndex={-1}>
                register
              </Button>
            )}
          </NavLink>
        </nav>

        <Outlet />
      </section>
    </main>
  );
}