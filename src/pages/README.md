# pages

One file per screen of the app. A page is routed in `App.tsx` and composes the components of `src/components`; the logic of the session is in `src/auth` and the calls to the backend in `src/api`.

## Structure

| File                 | Role                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| `LoginPage.tsx`      | Email and password form. Calls `login()` and shows the error of the backend. A logged-in user is sent home. |
| `RegisterPage.tsx`   | Email, password and confirmation. Checks that the two passwords match, creates the account and logs in.     |
| `ComponentsPage.tsx` | Development-only sandbox, available at `/components` with `npm run dev`. It is not part of the app.         |

## How it works

**Layouts.** The login and register pages share `AuthLayout`: the shell with the app name and the switch between them. The page only draws its own form, which `<Outlet />` places inside the layout.

**Errors.** A failed call shows `CODE :: message` from the backend (`errorMessage` in `src/api`). The login page turns `UNAUTHORIZED` into "Invalid email or password.".

**Components.** Pages are built from the shared components (`Button`, `Field`, `StatusLine`...), which take their look and behavior from props. To see them, use the sandbox page.
