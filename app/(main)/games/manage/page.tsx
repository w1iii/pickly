import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import "./page.css";

export default async function ManageGamesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: games } = await supabase
    .from("games")
    .select("*, courts(name)")
    .eq("host_id", user.id)
    .order("date", { ascending: false });

  const gameIds = games?.map((g) => g.id) || [];
  const { data: allRequests } = gameIds.length > 0
    ? await supabase
        .from("match_requests")
        .select("*, player:profiles(*), game:games!inner(court_id, courts(name))")
        .in("game_id", gameIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="manage-games-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="manage-games-title">Manage Games</h1>
        <Link href="/games/new" className="btn btn-primary">Post a game</Link>
      </div>

      {!games || games.length === 0 ? (
        <div className="dashboard-empty card">
          <h3>No games yet</h3>
          <p>Post your first game to start receiving join requests.</p>
          <Link href="/games/new" className="btn btn-primary">Post a game</Link>
        </div>
      ) : (
        <div className="manage-games-list">
          {games.map((game: any) => {
            const gameRequests = allRequests?.filter((r: any) => r.game_id === game.id) || [];
            const pending = gameRequests.filter((r: any) => r.status === "pending");

            return (
              <div key={game.id} className="manage-game-card card">
                <div className="manage-game-info">
                  <h3 className="font-semibold">{game.courts?.name || "Unknown court"}</h3>
                  <div className="manage-game-meta">
                    <span>{game.date}</span>
                    <span>{game.start_time?.slice(0, 5)}</span>
                    <span>{game.current_count}/{game.max_players}</span>
                    <span className={`badge ${
                      game.status === "open" ? "badge-success" :
                      game.status === "full" ? "badge-warning" : ""
                    }`}>{game.status}</span>
                  </div>
                  {pending.length > 0 && (
                    <p className="text-sm mt-1" style={{ color: "var(--color-warning)" }}>
                      {pending.length} pending request{pending.length > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <div className="manage-game-actions">
                  <Link href={`/games/${game.id}`} className="btn btn-ghost btn-sm">
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {allRequests && allRequests.filter((r: any) => r.status === "pending").length > 0 && (
        <section>
          <h2 className="font-semibold mb-4">Pending Join Requests</h2>
          <div className="manage-requests-section">
            {allRequests.filter((r: any) => r.status === "pending").map((req: any) => (
              <div key={req.id} className="manage-request-card">
                <div className="manage-request-info">
                  <p className="font-medium">{req.player?.name}</p>
                  <p className="text-sm text-muted">
                    Skill: {req.player?.skill_level || "Not set"} &middot;
                    Game: {req.game?.courts?.name}
                  </p>
                </div>
                <div className="manage-request-actions">
                  <form action="/api/games/respond" method="POST">
                    <input type="hidden" name="request_id" value={req.id} />
                    <button name="action" value="accepted" className="btn btn-primary btn-sm">
                      Accept
                    </button>
                    <button name="action" value="declined" className="btn btn-ghost btn-sm">
                      Decline
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
