import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import CourtMapClient from "./court-map-client";
import "./page.css";

// Bacolod City, Philippines
const BACOLOD_CENTER: [number, number] = [122.9491, 10.6676];

export default async function CourtsPage() {
  const supabase = await createClient();
  const { data: courts } = await supabase
    .from("courts")
    .select("*")
    .order("name")
    .limit(50);

  return (
    <div className="courts-page">
      <div className="courts-header">
        <h1 className="courts-title">Courts</h1>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/games/new" className="btn btn-primary">
            Post a game
          </Link>
          <Link href="/tournaments/new" className="btn btn-secondary">
            Create tournament
          </Link>
        </div>
      </div>

      <div className="courts-map">
        {courts && courts.length > 0 ? (
          <CourtMapClient
            courts={courts.map((c: any) => ({
              id: c.id,
              name: c.name,
              lat: c.lat,
              lng: c.lng,
              address: c.address,
              num_courts: c.num_courts,
              indoor: c.indoor,
              surface_type: c.surface_type,
            }))}
            height="400px"
            center={BACOLOD_CENTER}
            zoom={12.5}
          />
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            No courts loaded yet. Seed the database with courts.
          </div>
        )}
      </div>

      <div className="courts-list">
        {courts?.map((court: any) => (
          <Link
            key={court.id}
            href={`/courts/${court.id}`}
            className="court-card card"
          >
            <div className="card-header">
              <h3 className="card-title">{court.name}</h3>
            </div>
            <p className="text-sm text-muted">{court.address}</p>
            <div className="court-card-meta">
              <span>{court.indoor ? "Indoor" : "Outdoor"}</span>
              <span className="capitalize">{court.surface_type}</span>
              <span>{court.num_courts} court{court.num_courts > 1 ? "s" : ""}</span>
            </div>
            {court.amenities?.length > 0 && (
              <div className="court-card-amenities">
                {court.amenities.map((a: string) => (
                  <span key={a} className="court-card-amenity">{a}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
