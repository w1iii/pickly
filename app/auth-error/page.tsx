import Link from "next/link";
import "./page.css";

export default function AuthErrorPage() {
  return (
    <div className="auth-error-page">
      <div className="auth-error-card card">
        <h1 className="auth-error-title">Authentication Error</h1>
        <p className="auth-error-message">
          Something went wrong while signing in. Please try again.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/login" className="btn btn-primary">
            Try again
          </Link>
          <Link href="/" className="btn btn-secondary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
