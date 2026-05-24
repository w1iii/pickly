"use client";

import { signIn, signInWithGoogle } from "@/lib/auth-actions";
import "./page.css";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-header">
          <h1 className="login-logo">Pickly</h1>
          <p className="login-subtitle">Sign in to find a court, find a game, find your match.</p>
        </div>

        <form action={signIn} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" required className="form-input" placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" name="password" type="password" required className="form-input" placeholder="Your password" />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Sign in
          </button>
        </form>

        <div className="login-divider">or</div>

        <button onClick={signInWithGoogle} className="btn btn-secondary w-full">
          Continue with Google
        </button>

        <p className="login-footer">
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}
