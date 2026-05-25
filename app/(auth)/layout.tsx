import Link from "next/link";
import type { ReactNode } from "react";
import "./layout.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-layout">
      <header className="auth-header">
        <div className="auth-header-inner">
          <Link href="/" className="auth-logo">Pickly</Link>
          <nav className="auth-nav">
            <Link className="auth-nav-link" href="/">Home</Link>
            <Link className="auth-nav-link" href="/courts">Find Courts</Link>
            <Link className="auth-nav-link" href="/tournaments">Tournaments</Link>
            <Link className="auth-nav-link" href="/community">Community</Link>
          </nav>
          <div className="auth-header-actions">
            <Link href="/signup" className="btn-join-sm">Get started</Link>
          </div>
        </div>
      </header>
      <main className="auth-content">{children}</main>
    </div>
  );
}
