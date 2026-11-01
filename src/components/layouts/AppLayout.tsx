import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useHealth } from "../../hooks/useHealth";
import { Button } from "../Button";
import { RuleTitle } from "../RuleTitle";
import { Wordmark } from "../Wordmark";

// Shell of the app after login: top bar, command bar, side panel, the
// area where each screen is drawn (<Outlet />) and the status bar.
export function AppLayout() {
  const { email, logout } = useAuth();
  const health = useHealth();

  const user = email?.split("@")[0] ?? "user";

  const api = health.isSuccess
    ? { label: "ONLINE", color: "text-ok" }
    : health.isError
      ? { label: "OFFLINE", color: "text-error" }
      : { label: "CHECKING", color: "text-muted" };

  const server = health.isSuccess
    ? "● HEALTHY"
    : health.isError
      ? "● UNREACHABLE"
      : "● CHECKING";

  const latency = health.data ? `${health.data.latencyMs}ms` : "-";

  return (
    <div className="grid h-screen min-h-[620px] grid-rows-[43px_38px_minmax(0,1fr)_27px] overflow-hidden">
      <header className="flex items-center gap-6 border-b border-accent bg-panel px-4">
        <Wordmark />
        <div className="flex flex-1 justify-center gap-8 text-[10px] tracking-[.08em] text-muted">
          <span>
            API: <b className={`font-medium ${api.color}`}>{api.label}</b>
          </span>
          <span className="hidden md:inline">LAT: {latency}</span>
        </div>
        <Button onClick={() => logout()}>logout</Button>
      </header>

      <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap border-b border-line bg-panel-alt px-4">
        <span className="font-semibold text-accent">nubilo@{user}:/$</span>
        <span className="inline-block h-3.5 w-[7px] animate-blink bg-accent motion-reduce:animate-none" />
      </div>

      <div className="grid min-h-0 grid-cols-1 md:grid-cols-[218px_minmax(0,1fr)]">
        <aside className="hidden min-h-0 flex-col border-r border-line bg-panel p-3 md:flex">
          <RuleTitle title="filesystem" />
        </aside>

        <main className="min-h-0 min-w-0 overflow-auto bg-bg p-3 md:p-4">
          <Outlet />
        </main>
      </div>

      <footer className="grid grid-cols-[1fr_auto] items-center gap-4 overflow-hidden whitespace-nowrap bg-accent px-3 text-[9px] tracking-[.04em] text-bg md:grid-cols-[auto_auto_1fr_auto]">
        <span>
          USER <b className="font-semibold">{email ?? "-"}</b>
        </span>
        <span className="hidden md:inline">
          PATH <b className="font-semibold">/</b>
        </span>
        <span className="hidden overflow-hidden text-ellipsis text-center md:block">
          READY
        </span>
        <span>
          SERVER <b className="font-semibold">{server}</b>
        </span>
      </footer>
    </div>
  );
}
