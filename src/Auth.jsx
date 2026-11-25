import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth, DEMO_USER } from "./auth/AuthContext";
import { Mail, Lock, UserRound, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import "./Auth.css";


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ icon: Icon, error, type = "text", ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="auth-field">
      <div className={`auth-input-wrap ${error ? "has-error" : ""}`}>
        <Icon size={18} className="auth-input-icon" />
        <input type={isPassword && show ? "text" : type} {...props} />
        {isPassword && (
          <button
            type="button"
            className="auth-eye"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="auth-error-text">{error}</p>}
    </div>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!EMAIL_RE.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <h1>Welcome back</h1>
      <p className="auth-subtitle">Log in to your account</p>

      {formError && <div className="auth-alert">{formError}</div>}

      <Field icon={Mail} type="email" placeholder="Email" autoComplete="email"
        value={form.email} onChange={set("email")} error={errors.email} />
      <Field icon={Lock} type="password" placeholder="Password" autoComplete="current-password"
        value={form.password} onChange={set("password")} error={errors.password} />

      <Link to="/forgot-password" className="auth-link auth-forgot">Forgot password?</Link>

      <button className="auth-primary" disabled={loading}>
        {loading ? "Logging in…" : "Log in"}
      </button>

      <p className="auth-switch">
        Don't have an account?{" "}
        <Link to="/register" className="auth-link">Sign up</Link>
      </p>

      <div className="auth-demo">
        <span>Demo: {DEMO_USER.email} / {DEMO_USER.password}</span>
        <button
          type="button"
          className="auth-link"
          onClick={() => setForm({ email: DEMO_USER.email, password: DEMO_USER.password })}
        >
          Use demo
        </button>
      </div>
    </form>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!EMAIL_RE.test(form.email)) errs.email = "Enter a valid email";
    if (form.password.length < 8) errs.password = "Use at least 8 characters";
    if (form.confirm !== form.password) errs.confirm = "Passwords don't match";
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <h1>Create account</h1>
      <p className="auth-subtitle">Sign up to get started</p>

      {formError && <div className="auth-alert">{formError}</div>}

      <Field icon={UserRound} placeholder="Full name" autoComplete="name"
        value={form.name} onChange={set("name")} error={errors.name} />
      <Field icon={Mail} type="email" placeholder="Email" autoComplete="email"
        value={form.email} onChange={set("email")} error={errors.email} />
      <Field icon={Lock} type="password" placeholder="Password" autoComplete="new-password"
        value={form.password} onChange={set("password")} error={errors.password} />
      <Field icon={Lock} type="password" placeholder="Confirm password" autoComplete="new-password"
        value={form.confirm} onChange={set("confirm")} error={errors.confirm} />

      <button className="auth-primary" disabled={loading}>
        {loading ? "Creating account…" : "Sign up"}
      </button>

      <p className="auth-switch">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">Log in</Link>
      </p>
    </form>
  );
}

export function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) return setError("Enter a valid email");
    setError("");
    setLoading(true);
    await forgotPassword(email);
    setLoading(false);
    setSent(true);
  }

  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <Link to="/login" className="auth-back" aria-label="Back to login">
        <ArrowLeft size={20} />
      </Link>

      {sent ? (
        <div className="auth-success">
          <CheckCircle2 size={48} strokeWidth={1.6} />
          <h1>Check your email</h1>
          <p className="auth-subtitle">
            If an account exists for <strong>{email}</strong>, you'll receive a link to reset your password.
          </p>
          <Link to="/login" className="auth-primary">Back to login</Link>
        </div>
      ) : (
        <>
          <h1>Forgot password?</h1>
          <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>
          <Field icon={Mail} type="email" placeholder="Email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <button className="auth-primary" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </>
      )}
    </form>
  );
}

// Shared layout for all auth screens
export function AuthLayout() {
  return (
    <div className="auth-page">
      <Outlet />
    </div>
  );
}
