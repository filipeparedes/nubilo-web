import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes";
import { Button } from "../Button";
import { RuleTitle } from "../RuleTitle";
import { Wordmark } from "../Wordmark";

const CLOUD = `    .--.
    .--(    )--.
   (____________)
     ||  ||  ||`;

// Shell shared by the login and register pages: the app name, the
// switch between the two pages and the box where the page is drawn.
// <Outlet /> is where the current page appears.
export function AuthLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen place-items-center bg-bg p-4">
      <section className="w-full max-w-[440px] border border-line bg-panel p-6 md:p-8">
        <div className="flex justify-center">
          <Wordmark size="lg" cursor={false}/>
        </div>
        <p className="text-center text-muted">SELF-HOSTED OBJECT STORAGE</p>

        <pre
          className="my-6 text-center font-sans leading-[1.2] text-accent"
          aria-hidden="true"
        >
          {CLOUD}
        </pre>

        <RuleTitle title="secure session" />

        <nav
          className="my-6 flex justify-center gap-4"
          aria-label="Authentication mode"
        >
          <Button
            tone={pathname === ROUTES.login ? "success" : "normal"}
            onClick={() => navigate(ROUTES.login)}
          >
            login
          </Button>
          <Button
            tone={pathname === ROUTES.register ? "success" : "normal"}
            onClick={() => navigate(ROUTES.register)}
          >
            register
          </Button>
        </nav>

        <Outlet />

        <p className="mt-6 border-t border-line pt-3 text-[9px] tracking-[.08em] text-muted">
          API v0.1
        </p>
      </section>
    </main>
  );
}
