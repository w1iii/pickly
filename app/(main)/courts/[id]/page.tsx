import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourtDetailMap from "./court-detail-map";
import "./page.css";

export default async function CourtDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: court } = await supabase
    .from("courts")
    .select("*")
    .eq("id", id)
    .single();

  if (!court) notFound();

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .eq("court_id", id)
    .eq("status", "open")
    .order("date", { ascending: true })
    .limit(10);

  return (
    <div className="court-detail">
      <Link href="/courts" className="btn btn-ghost btn-sm" style={{  alignSelf: "flex-start" }}>
        &larr; Back to courts
      </Link>

      <div className="court-detail-header">
        <div>
          <h1 className="court-detail-name">{court.name}</h1>
          <p className="court-detail-address">{court.address}</p>
        </div>
        <Link href={`/games/new?court=${court.id}`} className="btn btn-primary">
          Post a game here
        </Link>
      </div>

      <div className="court-detail-map">
        <CourtDetailMap
          courts={[
            {
              id: court.id,
              name: court.name,
              lat: court.lat,
              lng: court.lng,
              address: court.address,
            },
          ]}
        />
      </div>

      <div className="card">
        <div className="court-detail-info">
          <div>
            <p className="text-sm text-muted">Type</p>
            <p className="font-medium">{court.indoor ? "Indoor" : "Outdoor"}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Surface</p>
            <p className="font-medium">{court.surface_type}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Courts</p>
            <p className="font-medium">{court.num_courts}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Verified</p>
            <p className="font-medium">{court.verified ? "Yes" : "No"}</p>
          </div>
        </div>

        {court.amenities?.length > 0 && (
          <div className="court-detail-amenities">
            {court.amenities.map((a: string) => (
              <span key={a} className="badge badge-primary">{a}</span>
            ))}
          </div>
        )}
      </div>

      <div className="court-detail-section">
        <h2>Available Games</h2>
        {games && games.length > 0 ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            {games.map((game: any) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="card"
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="font-medium">{game.date} at {game.start_time?.slice(0, 5)}</span>
                  <span className={`badge ${game.current_count >= game.max_players ? "badge-warning" : "badge-success"}`}>
                    {game.current_count}/{game.max_players}
                  </span>
                </div>
                <p className="text-sm text-muted mt-1">
                  Skill: {game.skill_min} – {game.skill_max}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No upcoming games at this court yet.</p>
        )}
      </div>
    </div>
  );
}
