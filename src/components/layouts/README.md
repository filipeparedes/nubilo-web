# layouts

The shells that wrap the pages. A layout draws the parts shared by a group of pages and leaves a hole, `<Outlet />`, where the current page appears. They are used in `App.tsx` as layout routes.

## Structure

| File            | Role                                                                                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AuthLayout.tsx` | Shell of the login and register pages: the app name, the switch between the two pages and the box where the form is drawn.                                                               |
| `AppLayout.tsx`  | Shell of the app after login: top bar (app name, state and latency of the API, logout), command bar, side panel, content area and status bar (user and state of the server).             |

## How it works

**Where they are used.** `AuthLayout` wraps the public routes. `AppLayout` goes inside `RequireAuth`, so it is only drawn with a session.

**Server state.** `AppLayout` uses `useHealth()`, which checks the API every 10 seconds. The top bar shows `ONLINE`, `OFFLINE` or `CHECKING` and the latency of the last answer, and the status bar shows the state of the server.

**Small screens.** Below 768px the side panel and part of the bars are hidden, as in the design.

## Not covered yet

The command bar and the path in the status bar show `/` for now, and the side panel only has its title. The file browser issue gives them the current folder and the folder tree. The message in the middle of the status bar stays at `READY` until there are actions to report.