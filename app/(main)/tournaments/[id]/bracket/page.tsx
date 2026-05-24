import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import BracketUI from "./bracket-ui";
import "./page.css";

export default async function BracketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*, courts(name)")
    .eq("id", id)
    .single();

  if (!tournament) notFound();

  const { data: bracket } = await supabase
    .from("brackets")
    .select("*")
    .eq("tournament_id", id)
    .single();

  const { data: registrations } = await supabase
    .from("registrations")
    .select("*, player:profiles(*)")
    .eq("tournament_id", id);

  const isOrganizer = user?.id === tournament.organizer_id;

  // Seed players map for bracket display
  const playerMap: Record<string, string> = {};
  registrations?.forEach((r: any) => {
    playerMap[r.player_id] = r.player?.name || "Unknown";
  });

  return (
    <div className="bracket-page">
      <div className="bracket-page-header">
        <h1 className="bracket-title">{tournament.name} &mdash; Bracket</h1>
        <p className="text-sm text-muted">
          {tournament.courts?.name} &middot; {tournament.date} &middot;{" "}
          <span className="capitalize">{tournament.format.replace("_", " ")}</span>
        </p>
      </div>

      {!bracket ? (
        <div className="dashboard-empty card">
          <h3>Bracket not yet generated</h3>
          <p>The bracket will appear here once the organizer locks registration.</p>
        </div>
      ) : (
        <BracketUI
          bracket={bracket}
          tournamentId={id}
          playerMap={playerMap}
          isOrganizer={isOrganizer}
        />
      )}
    </div>
  );
}
