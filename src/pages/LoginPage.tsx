import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { StatusLine } from "../components/StatusLine";
import { ROUTES } from "../routes";

// Turns a failed login into a message for the user.
function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "UNAUTHORIZED") return "Invalid email or password.";
    return `${error.code} :: ${error.message}`;
  }
  return "Could not reach the server.";
}

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // A user who is already logged in has nothing to do here. This also
  // sends the user home right after a successful login.
  if (isAuthenticated) return <Navigate to={ROUTES.home} replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field
        label="email"
        type="email"
        autoComplete="email"
        placeholder="name@host.tld"
        autoFocus
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Field
        label="password"
        type="password"
        autoComplete="current-password"
        placeholder="your password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {error && <StatusLine>{error}</StatusLine>}
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "authenticating..." : "authenticate"}
        </Button>
      </div>
    </form>
  );
}
