import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import "./page.css";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const { data: games } = await supabase
    .from("games")
    .select("*, courts(name)")
    .eq("host_id", id)
    .limit(10);

  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*")
    .eq("organizer_id", id)
    .limit(10);

  const { data: joinedGames } = await supabase
    .from("match_requests")
    .select("*, games!inner(*, courts(name))")
    .eq("player_id", id)
    .eq("status", "accepted")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: registrations } = await supabase
    .from("registrations")
    .select("*, tournaments(name)")
    .eq("player_id", id)
    .limit(10);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.name?.charAt(0) || "?"}
        </div>
        <div>
          <h1 className="profile-name">{profile.name}</h1>
          <p className="text-sm text-muted">{profile.city}</p>
        </div>
      </div>

      <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="profile-detail">
          <span className="profile-detail-label">Skill Level</span>
          <span className="font-medium">{profile.skill_level}</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">DUPR</span>
          <span className="font-medium">{profile.dupr_rating || "Not set"}</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">City</span>
          <span className="font-medium">{profile.city || "Not set"}</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">Member since</span>
          <span className="font-medium">
            {new Date(profile.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <section>
        <h2 className="font-semibold mb-4">Hosted Games</h2>
        {games && games.length > 0 ? (
          <div className="profile-history">
            {games.map((g: any) => (
              <div key={g.id} className="card" style={{ padding: "1rem" }}>
                <p className="font-medium text-sm">{g.courts?.name}</p>
                <p className="text-xs text-muted">{g.date} — {g.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No games hosted yet.</p>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-4">Games Played</h2>
        {joinedGames && joinedGames.length > 0 ? (
          <div className="profile-history">
            {joinedGames.map((r: any) => (
              <div key={r.id} className="card" style={{ padding: "1rem" }}>
                <p className="font-medium text-sm">{r.games?.courts?.name}</p>
                <p className="text-xs text-muted">{r.games?.date} — {r.games?.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No games played yet.</p>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-4">Tournaments</h2>
        {tournaments && tournaments.length > 0 ? (
          <div className="profile-history">
            {tournaments.map((t: any) => (
              <div key={t.id} className="card" style={{ padding: "1rem" }}>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted">{t.date} — {t.status.replace("_", " ")}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No tournaments organized yet.</p>
        )}
      </section>

      {registrations && registrations.length > 0 && (
        <section>
          <h2 className="font-semibold mb-4">Registered Tournaments</h2>
          <div className="profile-history">
            {registrations.map((r: any) => (
              <div key={r.id} className="card" style={{ padding: "1rem" }}>
                <p className="font-medium text-sm">{r.tournaments?.name}</p>
                <p className="text-xs text-muted">Registered {new Date(r.registered_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
