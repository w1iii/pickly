import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import "./page.css";

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string; date?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  let query = supabase
    .from("games")
    .select("*, courts(name)")
    .eq("status", "open")
    .order("date", { ascending: true })
    .limit(50);

  if (params.skill) {
    query = query.eq("skill_min", params.skill);
  }

  const { data: games } = await query;

  return (
    <div className="games-page">
      <div className="games-header">
        <h1 className="games-title">Open Games</h1>
        <Link href="/games/new" className="btn btn-primary">
          Post a game
        </Link>
      </div>

      <div className="games-filters">
        <form method="GET" action="/games" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <select name="skill" className="form-select">
            <option value="">All skill levels</option>
            <option value="beginner">Beginner</option>
            <option value="3.0">3.0</option>
            <option value="3.5">3.5</option>
            <option value="4.0">4.0</option>
            <option value="4.5">4.5</option>
            <option value="5.0+">5.0+</option>
          </select>
          <input type="date" name="date" className="form-input" />
          <button type="submit" className="btn btn-secondary btn-sm">Filter</button>
        </form>
      </div>

      <div className="games-list">
        {games?.map((game: any) => {
          const fillPercent = (game.current_count / game.max_players) * 100;
          return (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="game-card card"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="card-header" style={{ marginBottom: 0 }}>
                  <h3 className="card-title">{game.courts?.name || "Unknown court"}</h3>
                </div>
                <span className={`badge ${game.current_count >= game.max_players ? "badge-warning" : "badge-success"}`}>
                  {game.current_count}/{game.max_players}
                </span>
              </div>
              <div className="game-card-meta">
                <span>{game.date}</span>
                <span>{game.start_time?.slice(0, 5)}</span>
                <span>Skill {game.skill_min}–{game.skill_max}</span>
              </div>
              <div className="game-card-progress">
                <div className="game-card-bar">
                  <div className="game-card-fill" style={{ width: `${Math.min(fillPercent, 100)}%` }}></div>
                </div>
              </div>
              {game.notes && (
                <p className="text-sm text-muted mt-2">{game.notes}</p>
              )}
            </Link>
          );
        })}
      </div>

      {(!games || games.length === 0) && (
        <div className="dashboard-empty card">
          <h3>No games found</h3>
          <p>Try adjusting your filters or post a new game.</p>
          <Link href="/games/new" className="btn btn-primary">Post a game</Link>
        </div>
      )}
    </div>
  );
}
