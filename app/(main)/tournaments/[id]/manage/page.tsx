import { createClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import "./page.css";

export default async function TournamentManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*, courts(name)")
    .eq("id", id)
    .single();

  if (!tournament) notFound();
  if (tournament.organizer_id !== user.id) redirect(`/tournaments/${id}`);

  const { data: registrations } = await supabase
    .from("registrations")
    .select("*, player:profiles(*)")
    .eq("tournament_id", id);

  return (
    <div className="tournament-manage">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="tournament-manage-title">Manage: {tournament.name}</h1>
        <span className={`badge ${
          tournament.status === "registration_open" ? "badge-success" :
          tournament.status === "in_progress" ? "badge-warning" : ""
        }`}>{tournament.status.replace("_", " ")}</span>
      </div>

      <div className="card">
        <div className="tournament-manage-section">
          <h2>Players ({registrations?.length || 0}/{tournament.max_players})</h2>
          {(!registrations || registrations.length === 0) ? (
            <p className="text-sm text-muted">No registrations yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {registrations.map((reg: any) => (
                <div key={reg.id} className="tournament-manage-player">
                  <div>
                    <p className="font-medium text-sm">{reg.player?.name}</p>
                    <p className="text-xs text-muted">Skill: {reg.player?.skill_level || "Not set"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="tournament-manage-actions">
        {tournament.status === "registration_open" && registrations && registrations.length >= 2 && (
          <form action={`/api/tournaments/${id}/lock`} method="POST">
            <button type="submit" className="btn btn-primary">
              Lock registration & generate bracket
            </button>
          </form>
        )}
        {(tournament.status === "in_progress" || tournament.status === "completed") && (
          <Link href={`/tournaments/${id}/bracket`} className="btn btn-secondary">
            Manage bracket scores
          </Link>
        )}
        {tournament.status === "registration_open" && (
          <form action={`/api/tournaments/${id}/cancel`} method="POST">
            <button type="submit" className="btn btn-danger">
              Cancel tournament
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
