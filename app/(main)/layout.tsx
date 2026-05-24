import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { signOut } from "@/lib/auth-actions";
import "./layout.css";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const initials = user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="main-layout">
      <nav className="main-nav">
        <Link href="/dashboard" className="main-nav-brand">
          Pickly
        </Link>

        <div className="main-nav-links">
          <Link href="/dashboard" className="main-nav-link">
            Dashboard
          </Link>
          <Link href="/courts" className="main-nav-link">
            Courts
          </Link>
          <Link href="/games" className="main-nav-link">
            Games
          </Link>
          <Link href="/tournaments" className="main-nav-link">
            Tournaments
          </Link>
        </div>

        <div className="main-nav-user">
          <Link href="/settings" className="main-nav-link">
            Settings
          </Link>
          <div className="main-nav-avatar">{initials}</div>
          <form action={signOut}>
            <button type="submit" className="btn btn-ghost btn-sm">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
}
