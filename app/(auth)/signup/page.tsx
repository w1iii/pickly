"use client";

import { signUp, signInWithGoogle } from "@/lib/auth-actions";
import "./page.css";

export default function SignupPage() {
  return (
    <div className="signup-page">
      <div className="signup-card card">
        <div className="signup-header">
          <h1 className="signup-logo">Pickly</h1>
          <p className="signup-subtitle">Create your account and hit the court.</p>
        </div>

        <form action={signUp} className="signup-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input id="name" name="name" type="text" required className="form-input" placeholder="Your name" />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" required className="form-input" placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" name="password" type="password" required className="form-input" placeholder="At least 6 characters" minLength={6} />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Create account
          </button>
        </form>

        <div className="signup-divider">or</div>

        <button onClick={signInWithGoogle} className="btn btn-secondary w-full">
          Continue with Google
        </button>

        <p className="signup-footer">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}
