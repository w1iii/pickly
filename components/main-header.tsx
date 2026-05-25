"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { signOut } from "@/lib/auth-actions";
import NotificationDropdown from "./notification-dropdown";

export default function MainHeader() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    load();
  }, []);

  const initials = user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="main-header">
      <div className="main-header-inner">
        <Link href="/dashboard" className="main-logo">Pickly</Link>

        <nav className="main-nav">
          <Link className="main-nav-link" href="/courts">Find Courts</Link>
          <Link className="main-nav-link" href="/tournaments">Tournaments</Link>
          <Link className="main-nav-link" href="/dashboard">Dashboard</Link>
          <Link className="main-nav-link" href="/community">Community</Link>
        </nav>

        <div className="main-header-actions">
          <div className="main-search">
            <span className="material-symbols-outlined">search</span>
            <input className="main-search-input" placeholder="Search matches..." type="text" />
          </div>

          {loading ? null : user ? (
            <>
              <NotificationDropdown />
              <Link href="/settings" className="main-avatar-link" aria-label="Account">
                <div className="main-avatar">{initials}</div>
              </Link>
              <form action={signOut}>
                <button type="submit" className="main-signout-btn">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="main-signin-link">Sign in</Link>
              <Link href="/signup" className="btn-join-sm">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
