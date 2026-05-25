import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import "./page.css";

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: players } = await supabase
    .from("profiles")
    .select("name, skill_level, city")
    .order("name")
    .limit(12);

  return (
    <div className="community-page">
      <div className="community-hero">
        <h1 className="community-hero-title">Community</h1>
        <p className="community-hero-subtitle">
          Connect with pickleball players near you. Share tips, organize games, and grow the sport together.
        </p>
        {user ? (
          <Link href="#" className="btn btn-accent">Start a discussion</Link>
        ) : (
          <Link href="/signup" className="btn btn-accent">Join the community</Link>
        )}
      </div>

      <div className="community-grid">
        <section className="community-section card">
          <h2 className="community-section-title">Recent Discussions</h2>
          <div className="community-empty-state">
            <span className="community-empty-icon material-symbols-outlined">forum</span>
            <p>No discussions yet. Be the first to start one!</p>
            {user ? (
              <Link href="#" className="btn btn-primary btn-sm">Start a discussion</Link>
            ) : (
              <Link href="/signup" className="btn btn-primary btn-sm">Sign up to post</Link>
            )}
          </div>
        </section>

        <section className="community-section card">
          <h2 className="community-section-title">Players Near You</h2>
          {players && players.length > 0 ? (
            <div className="community-players-list">
              {players.map((p, i) => (
                <div key={i} className="community-player-card">
                  <div className="community-player-avatar">
                    {p.name?.charAt(0) || "?"}
                  </div>
                  <div className="community-player-info">
                    <p className="community-player-name">{p.name || "Anonymous"}</p>
                    <p className="community-player-detail">
                      {p.skill_level || "Any skill"} {p.city ? `· ${p.city}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No players registered yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
