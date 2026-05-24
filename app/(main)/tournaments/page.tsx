import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import "./page.css";

export default async function TournamentsPage() {
  const supabase = await createClient();

  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*, courts(name)")
    .order("date", { ascending: false })
    .limit(50);

  return (
    <div className="tournaments-page">
      <div className="tournaments-header">
        <h1 className="tournaments-title">Tournaments</h1>
        <Link href="/tournaments/new" className="btn btn-primary">
          Create tournament
        </Link>
      </div>

      <div className="tournaments-list">
        {tournaments?.map((t: any) => (
          <Link
            key={t.id}
            href={`/tournaments/${t.id}`}
            className="tournament-card card"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div className="card-header" style={{ marginBottom: 0 }}>
                <h3 className="card-title">{t.name}</h3>
              </div>
              <span className={`badge ${
                t.status === "registration_open" ? "badge-success" :
                t.status === "in_progress" ? "badge-warning" :
                t.status === "completed" ? "" : ""
              }`}>{t.status.replace("_", " ")}</span>
            </div>
            <div className="tournament-card-meta">
              <span>{t.date}</span>
              <span>{t.courts?.name}</span>
              <span>{t.format.replace("_", " ")}</span>
            </div>
          </Link>
        ))}
      </div>

      {(!tournaments || tournaments.length === 0) && (
        <div className="dashboard-empty card">
          <h3>No tournaments yet</h3>
          <p>Create the first tournament for your community.</p>
          <Link href="/tournaments/new" className="btn btn-primary">Create tournament</Link>
        </div>
      )}
    </div>
  );
}
