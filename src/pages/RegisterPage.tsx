import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { register } from "../api/auth";
import { errorMessage } from "../api/errorMessage";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { StatusLine } from "../components/StatusLine";
import { ROUTES } from "../routes";

export default function RegisterPage() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // The border of the confirmation turns red as soon as it stops matching.
  const mismatch = confirm !== "" && password !== confirm;

  // A user who is already logged in has nothing to do here. This also
  // sends the user home right after the account is created.
  if (isAuthenticated) return <Navigate to={ROUTES.home} replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await register(email, password);
      // Registering does not start a session, so log in right after.
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
        autoComplete="new-password"
        placeholder="choose a password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Field
        label="confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="repeat the password"
        required
        invalid={mismatch}
        value={confirm}
        onChange={(event) => setConfirm(event.target.value)}
      />
      {error && <StatusLine>{error}</StatusLine>}
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "creating account..." : "create account"}
        </Button>
      </div>
    </form>
  );
}
