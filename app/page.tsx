import Link from "next/link";
import "./page.css";

export default function Home() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <span className="landing-logo">Pickly</span>
        <div className="landing-nav-links">
          <Link href="/login" className="btn btn-ghost">Sign in</Link>
          <Link href="/signup" className="btn btn-primary">Get started</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <h1>Find a court. Find a game. Find your match.</h1>
        <p>
          The all-in-one pickleball app. Discover courts, connect with players at your level, and run tournaments — all for free.
        </p>
        <div className="landing-hero-actions">
          <Link href="/signup" className="btn btn-primary btn-lg">Get started free</Link>
          <Link href="/login" className="btn btn-secondary btn-lg">Sign in</Link>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-feature">
          <div className="landing-feature-icon">🗺️</div>
          <h3>Court Finder</h3>
          <p>Discover pickleball courts near you on an interactive map. See amenities, photos, and available games.</p>
        </div>
        <div className="landing-feature">
          <div className="landing-feature-icon">🤝</div>
          <h3>Player Matchmaker</h3>
          <p>Post open play sessions, browse games by skill level, and request to join. Find your perfect match.</p>
        </div>
        <div className="landing-feature">
          <div className="landing-feature-icon">🏆</div>
          <h3>Tournament Organizer</h3>
          <p>Create and run tournaments with auto-generated brackets, score entry, and shareable results pages.</p>
        </div>
      </section>

      <footer className="landing-footer">
        &copy; {new Date().getFullYear()} Pickly. All rights reserved.
      </footer>
    </div>
  );
}
