import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import RegisterButton from "./register-button";
import "./page.css";

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*, courts(*), organizer:profiles!organizer_id(*)")
    .eq("id", id)
    .single();

  if (!tournament) notFound();

  const { data: registrations } = await supabase
    .from("registrations")
    .select("*, player:profiles(*)")
    .eq("tournament_id", id);

  const isOrganizer = user?.id === tournament.organizer_id;
  const userRegistered = registrations?.some((r) => r.player_id === user?.id);
  const registrationCount = registrations?.length || 0;

  return (
    <div className="tournament-detail">
      <Link href="/tournaments" className="btn btn-ghost btn-sm" style={{ marginBottom: "1rem", alignSelf: "flex-start" }}>&larr; Back</Link>
      <div className="tournament-detail-header">
        <h1 className="tournament-detail-name">{tournament.name}</h1>
        <div className="tournament-detail-meta">
          <span>{tournament.date}</span>
          <span>{tournament.courts?.name}</span>
          <span className="capitalize">{tournament.format.replace("_", " ")}</span>
          <span className={`badge ${
            tournament.status === "registration_open" ? "badge-success" :
            tournament.status === "in_progress" ? "badge-warning" :
            tournament.status === "completed" ? "" : ""
          }`}>{tournament.status.replace("_", " ")}</span>
        </div>
      </div>

      <div className="tournament-detail-info card">
        <div>
          <p className="text-sm text-muted">Organizer</p>
          <p className="font-medium">{tournament.organizer?.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Format</p>
          <p className="font-medium capitalize">{tournament.format.replace("_", " ")}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Players</p>
          <p className="font-medium">{registrationCount} / {tournament.max_players}</p>
        </div>
        {tournament.entry_fee && (
          <div>
            <p className="text-sm text-muted">Entry Fee</p>
            <p className="font-medium">${tournament.entry_fee}</p>
          </div>
        )}
      </div>

      {!isOrganizer && tournament.status === "registration_open" && !userRegistered && (
        user ? (
          <RegisterButton tournamentId={tournament.id} userId={user.id} />
        ) : (
          <Link href={`/login?redirect=/tournaments/${tournament.id}`} className="btn btn-primary w-full" style={{ textAlign: "center" }}>
            Sign in to register
          </Link>
        )
      )}

      {userRegistered && (
        <div className="card">
          <p className="font-medium" style={{ color: "var(--color-success)" }}>
            You are registered for this tournament.
          </p>
        </div>
      )}

      <div className="tournament-detail-actions">
        <Link href={`/tournaments/${id}/bracket`} className="btn btn-secondary">
          View bracket
        </Link>
        {user && (isOrganizer || tournament.status === "registration_open") && (
          <Link href={`/tournaments/${id}/manage`} className="btn btn-secondary">
            {isOrganizer ? "Manage" : "View registrations"}
          </Link>
        )}
      </div>

      <div>
        <h2 className="font-semibold mb-4">
          Registered Players ({registrationCount})
        </h2>
        {registrationCount === 0 ? (
          <p className="text-sm text-muted">No players registered yet.</p>
        ) : (
          <div className="tournament-player-list">
            {registrations?.map((reg: any) => (
              <div key={reg.id} className="tournament-player">
                <div className="tournament-player-avatar">
                  {reg.player?.name?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="font-medium text-sm">{reg.player?.name}</p>
                  <p className="text-xs text-muted">
                    Level: {reg.player?.skill_level || "Not set"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
