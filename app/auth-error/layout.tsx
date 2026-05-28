import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthErrorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-layout">
      <header className="auth-header">
        <div className="auth-header-inner">
          <Link href="/" className="auth-logo">Pickly</Link>
          <nav className="auth-nav">
            <Link className="auth-nav-link" href="/">Home</Link>
            <Link className="auth-nav-link" href="/courts">Find Courts</Link>
            <Link className="auth-nav-link" href="/tournaments">Tournaments</Link>
          </nav>
          <div className="auth-header-actions">
            <Link href="/login" className="btn-join-sm">Sign in</Link>
          </div>
        </div>
      </header>
      <main className="auth-content">{children}</main>
    </div>
  );
}
