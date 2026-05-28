import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import JoinRequestButton from "./join-button";
import { LeaveGameButton, RemovePlayerButton } from "@/components/roster-actions";
import "./page.css";

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: game } = await supabase
    .from("games")
    .select("*, courts(*), host:profiles!host_id(*)")
    .eq("id", id)
    .single();

  if (!game) notFound();

  const { data: requests } = await supabase
    .from("match_requests")
    .select("*, player:profiles(*)")
    .eq("game_id", id);

  const acceptedPlayers = requests?.filter((r) => r.status === "accepted") || [];
  const pendingRequests = requests?.filter((r) => r.status === "pending") || [];

  // Host is always a confirmed participant
  const hostInAccepted = acceptedPlayers.some((r) => r.player_id === game.host_id);
  const rosterCount = hostInAccepted ? acceptedPlayers.length : acceptedPlayers.length + 1;

  const isHost = user ? game.host_id === user.id : false;
  const userRequest = user ? requests?.find((r) => r.player_id === user.id) : null;

  return (
    <div className="game-detail">
      <Link href="/games" className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start" }}>&larr; Back</Link>
      <div className="game-detail-header">
        <h1 className="game-detail-court">{game.courts?.name}</h1>
        <div className="game-detail-meta">
          <span>{game.date}</span>
          <span>{game.start_time?.slice(0, 5)}</span>
          <span>Skill {game.skill_min} – {game.skill_max}</span>
          <span className={`badge ${game.status === "open" ? "badge-success" : game.status === "full" ? "badge-warning" : ""}`}>
            {game.status}
          </span>
        </div>
        <p className="text-sm text-muted">{game.courts?.address}</p>
      </div>

      <div className="game-detail-info-grid card">
        <div>
          <p className="text-sm text-muted">Host</p>
          <p className="font-medium">{game.host?.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Skill Range</p>
          <p className="font-medium">{game.skill_min} – {game.skill_max}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Players</p>
          <p className="font-medium">{game.current_count} / {game.max_players}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Status</p>
          <p className="font-medium capitalize">{game.status}</p>
        </div>
      </div>

      {!isHost && !userRequest && (
        user ? (
          game.current_count < game.max_players ? (
            <JoinRequestButton gameId={game.id} isFull={false} />
          ) : (
            <JoinRequestButton gameId={game.id} isFull={true} />
          )
        ) : (
          <Link href={`/login?redirect=/games/${game.id}`} className="btn btn-primary w-full" style={{ textAlign: "center" }}>
            Sign in to {game.current_count < game.max_players ? "join" : "join waitlist"}
          </Link>
        )
      )}

      {userRequest && (
        <div className="card">
          <p className="font-medium">Your request: <span className={`badge ${
            userRequest.status === "pending" ? "badge-warning" :
            userRequest.status === "accepted" ? "badge-success" :
            userRequest.status === "declined" ? "badge-danger" :
            userRequest.status === "waitlisted" ? "badge-info" : ""
          }`}>{userRequest.status}</span></p>
          {userRequest.status === "declined" && (
            <p className="text-sm text-muted mt-1">The host declined your request. Browse other open games to join.</p>
          )}
          {userRequest.status === "waitlisted" && (
            <p className="text-sm text-muted mt-1">You're on the waitlist. You'll be auto-accepted if a spot opens up.</p>
          )}
          {userRequest.status === "accepted" && !isHost && (
            <div style={{ marginTop: "0.5rem" }}>
              <LeaveGameButton gameId={game.id} />
            </div>
          )}
        </div>
      )}

      {game.notes && (
        <div>
          <h2 className="font-semibold mb-2">Notes</h2>
          <div className="game-detail-notes">{game.notes}</div>
        </div>
      )}

      <div>
        <h2 className="font-semibold mb-2">
          Roster ({rosterCount} / {game.max_players})
        </h2>
        <div className="game-detail-roster">
          {/* Host is always in the roster */}
          <div key="host" className="game-detail-player">
            <div className="game-detail-player-avatar">
              {game.host?.name?.charAt(0) || "?"}
            </div>
            <div className="game-detail-player-info">
              <p className="game-detail-player-name">
                {game.host?.name}
                <span className="game-detail-player-host"> (Host)</span>
              </p>
              <p className="game-detail-player-skill">
                Level: {game.host?.skill_level || "Not set"}
              </p>
            </div>
          </div>
          {/* Other accepted players (exclude host if they also have a request) */}
          {acceptedPlayers.filter((r) => r.player_id !== game.host_id).length > 0 ? (
            acceptedPlayers.filter((r) => r.player_id !== game.host_id).map((req: any) => (
              <div key={req.id} className="game-detail-player">
                <div className="game-detail-player-avatar">
                  {req.player?.name?.charAt(0) || "?"}
                </div>
                <div className="game-detail-player-info">
                  <p className="game-detail-player-name">{req.player?.name}</p>
                  <p className="game-detail-player-skill">
                    Level: {req.player?.skill_level || "Not set"}
                  </p>
                </div>
                {isHost && (
                  <RemovePlayerButton gameId={game.id} playerId={req.player_id} />
                )}
              </div>
            ))
          ) : (
            rosterCount <= 1 && (
              <p className="text-sm text-muted">No other players confirmed yet.</p>
            )
          )}
        </div>
      </div>

      {isHost && pendingRequests.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">
            Pending Requests ({pendingRequests.length})
          </h2>
          <div className="game-detail-roster">
            {pendingRequests.map((req: any) => (
              <div key={req.id} className="game-detail-player">
                <div className="game-detail-player-avatar">
                  {req.player?.name?.charAt(0) || "?"}
                </div>
                <div className="game-detail-player-info">
                  <p className="game-detail-player-name">{req.player?.name}</p>
                  <p className="game-detail-player-skill">
                    Level: {req.player?.skill_level || "Not set"}
                  </p>
                </div>
                <form action="/api/games/respond" method="POST" style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="hidden" name="request_id" value={req.id} />
                  <button name="action" value="accepted" className="btn btn-primary btn-sm">
                    Accept
                  </button>
                  <button name="action" value="declined" className="btn btn-ghost btn-sm">
                    Decline
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
