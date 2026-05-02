import { useMemo, useState } from "react";
import { postAuth } from "./api";

const initialState = {
  name: "",
  email: "",
  password: "",
};

export default function App() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);

  const title = useMemo(() => (mode === "login" ? "Login" : "Register"), [mode]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setSuccess("");
    setUser(null);
    setForm(initialState);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setUser(null);

    try {
      const payload =
        mode === "register"
          ? { name: form.name, email: form.email, password: form.password }
          : { email: form.email, password: form.password };

      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const response = await postAuth(endpoint, payload);

      setSuccess(response.message ?? `${title} successful.`);
      setUser({
        name: response.name,
        email: response.email,
      });

      if (mode === "register") {
        setMode("login");
      }

      setForm(initialState);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="gradient-blob blob-1" />
      <div className="gradient-blob blob-2" />

      <section className="auth-card">
        <p className="eyebrow">React + Spring Boot</p>
        <h1>User Access</h1>

        <div className="mode-switch">
          <button
            className={mode === "login" ? "active" : ""}
            type="button"
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            type="button"
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          {mode === "register" && (
            <label>
              Name
              <input
                autoComplete="name"
                name="name"
                onChange={onChange}
                placeholder="Your full name"
                required
                type="text"
                value={form.name}
              />
            </label>
          )}

          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={onChange}
              placeholder="you@example.com"
              required
              type="email"
              value={form.email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              name="password"
              onChange={onChange}
              placeholder="At least 6 characters"
              required
              type="password"
              value={form.password}
            />
          </label>

          <button className="submit-btn" disabled={loading} type="submit">
            {loading ? "Please wait..." : title}
          </button>
        </form>

        {error && <p className="feedback error">{error}</p>}
        {success && <p className="feedback success">{success}</p>}
        {user && (
          <div className="user-box">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        )}
      </section>
    </main>
  );
}
