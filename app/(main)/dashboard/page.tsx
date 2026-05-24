import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import "./page.css";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: myGames } = await supabase
    .from("games")
    .select("*, courts(name)")
    .eq("host_id", user?.id)
    .order("date", { ascending: true })
    .limit(5);

  const { data: nearGames } = await supabase
    .from("games")
    .select("*, courts(name)")
    .eq("status", "open")
    .order("date", { ascending: true })
    .limit(5);

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <h1>Welcome back{profile?.name ? `, ${profile.name}` : ""}</h1>
        <p>Find courts, join games, and track tournaments near you.</p>
      </div>

      <section>
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Games Near You</h2>
          <Link href="/games" className="btn btn-ghost btn-sm">View all</Link>
        </div>

        {nearGames && nearGames.length > 0 ? (
          <div className="dashboard-grid">
            {nearGames.map((game: any) => (
              <Link key={game.id} href={`/games/${game.id}`} className="card" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div className="card-header">
                  <h3 className="card-title">{game.courts?.name || "Unknown court"}</h3>
                </div>
                <p className="text-sm text-muted">{game.date} at {game.start_time?.slice(0, 5)}</p>
                <p className="text-sm text-muted">
                  Skill: {game.skill_min} – {game.skill_max} &middot; {game.current_count}/{game.max_players} players
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty card">
            <div className="dashboard-empty-icon">🏓</div>
            <h3>No games yet</h3>
            <p>Be the first to post a game or browse courts near you.</p>
            <Link href="/games/new" className="btn btn-primary">Post a game</Link>
          </div>
        )}
      </section>

      {myGames && myGames.length > 0 && (
        <section>
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">My Games</h2>
            <Link href="/games/manage" className="btn btn-ghost btn-sm">Manage</Link>
          </div>
          <div className="dashboard-grid">
            {myGames.map((game: any) => (
              <Link key={game.id} href={`/games/manage`} className="card" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div className="card-header">
                  <h3 className="card-title">{game.courts?.name || "Unknown court"}</h3>
                  <span className={`badge ${game.status === "open" ? "badge-success" : game.status === "full" ? "badge-warning" : ""}`}>
                    {game.status}
                  </span>
                </div>
                <p className="text-sm text-muted">{game.date} at {game.start_time?.slice(0, 5)}</p>
                <p className="text-sm text-muted">{game.current_count}/{game.max_players} players</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
