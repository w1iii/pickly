import Link from "next/link";
import "./page.css";

export default function Home() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">Pickly</div>
          <nav className="landing-nav">
            <Link className="landing-nav-link active" href="/courts">Find Courts</Link>
            <Link className="landing-nav-link" href="/tournaments">Tournaments</Link>
            <Link className="landing-nav-link" href="/dashboard">Dashboard</Link>
            <Link className="landing-nav-link" href="/community">Community</Link>
          </nav>
          <div className="landing-header-actions">
            <div className="landing-search">
              <span className="material-symbols-outlined">search</span>
              <input className="landing-search-input" placeholder="Search matches..." type="text" />
            </div>
            <button className="landing-icon-btn" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link href="/login" className="landing-icon-btn" aria-label="Account">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
            <Link href="/signup" className="btn-join">Join Match</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-gradient"></div>
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-badge">THE FUTURE OF PICKLEBALL</span>
              <h1 className="hero-title">Find a court. Find a game. Find your match.</h1>
              <p className="hero-subtitle">Join the fastest-growing pickleball community. Whether you&apos;re a 5.0 pro or just picked up a paddle, we make finding competitive matches effortless.</p>
              <div className="hero-actions">
                <Link href="/signup" className="btn-primary-lg">Join the Game</Link>
                <Link href="/courts" className="btn-secondary-lg">Explore Courts</Link>
              </div>
            </div>
          </div>
          <div className="hero-social-proof">
            <div className="social-proof-avatars">
              <img
                alt="Player"
                className="social-proof-avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFhkJeapS_hcKKxKidEoBO_3xofaKPHmjTVyBwZPdSXj-JviI9SW60EKDuWwcFAPNF32sVY7gIJQZbQV2Iq8X9WZd-mok13lfCPAMm2f4oV48vcpFTebPCNxkPUmTDLLqfPCSApm4gkjoUxN9nr1NnB3Kb8is6PejvTv_UQ1eT5MJVg1j3mm8z__qzdH6TxTXmffV4eanKvq-1aAHcHX_K2qU8RMUv-tTA-_y2mYdi2Roz76IuAn3c1J38Qe0C2d382Rix6C35H3Mh"
              />
              <img
                alt="Player"
                className="social-proof-avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnohihLXyN1IIqLEclihSJDl8LzKJw4thJHumb6xLTwv4iWktjBRBcdh4goT9fXP7TcBIBmYgkC5ZukhZkqm7NaIFVCpSuMMmKExKC_WV3BZmvARjn8bDWKmRSxppkIdEpgTvMsUeRTrvKUo6Fr4om-mjmpWBl1DDcPsxCXA2bctu-R9Xw06NlnhGtEykmwuktBlgnT-Z1MpwVxdZ6-IImjqyiaqG2pofaFEe0IFQcALyOFUXxjM-geW5a0R7V4joD1LFcx9qegisR"
              />
              <img
                alt="Player"
                className="social-proof-avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuArQUrwcv3sw6HeJ1ccdEr77sWPWmxqh9gEeznwkEd2XPQ8FERpteHbgPZCMH5UWmrVvDd0hfIYOdTQRpTcn7dTqsdxk21ly1xRQlJzGkW9mio5Z7gEsY-Tce820QJycrs7s9IUmp4dD3kfbDn_TTP7WBOeQsBbkXrmOJcR0FPl7BKx4IIy6ovdsT-IfoVNn3qZ_LoSjK-nry4sa5UEaL_uQ1-hAbDUQeKmBPAGE_I8CJZZok_8KMG4Z9PI4hZQrSDY1R0r5eupRLic"
              />
            </div>
            <div className="social-proof-text">
              <p className="social-proof-count">10,000+ players</p>
              <p className="social-proof-label">Active across the country</p>
            </div>
          </div>
        </section>

        <section className="bento-section">
          <div className="bento-section-inner">
            <div className="bento-header">
              <h2 className="bento-title">Built for the Court</h2>
              <p className="bento-subtitle">Everything you need to spend less time organizing and more time playing the sport you love.</p>
            </div>
            <div className="bento-grid">
              <div className="bento-card bento-card-wide">
                <div className="bento-card-body">
                  <div className="bento-card-icon navy">
                    <span className="material-symbols-outlined">map</span>
                  </div>
                  <h3 className="bento-card-title">Discover Local Courts</h3>
                  <p className="bento-card-desc">Access a real-time map of public and private courts. Check court conditions, availability, and lighting status before you leave home.</p>
                  <Link className="bento-card-link" href="/courts">
                    Find courts near you <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
                <div className="bento-card-map">
                  <div className="map-pulse"></div>
                </div>
              </div>
              <div className="bento-card bento-card-dark">
                <div>
                  <div className="bento-card-icon lime">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                  <h3 className="bento-card-title light">Matchmaking 2.0</h3>
                  <p className="bento-card-desc light">No more lopsided games. Our DUPR-integrated rating system ensures every game is competitive and fun.</p>
                </div>
                <div className="bento-card-stats">
                  <div className="stat-row">
                    <span className="stat-label">Average Skill Match</span>
                    <span className="stat-value">94%</span>
                  </div>
                  <div className="stat-bar">
                    <div className="stat-bar-fill" style={{ width: "94%" }}></div>
                  </div>
                </div>
              </div>
              <div className="bento-card bento-card-center">
                <div>
                  <div className="bento-card-icon white">
                    <span className="material-symbols-outlined">trophy</span>
                  </div>
                  <h3 className="bento-card-title">Pro Tournaments</h3>
                  <p className="bento-card-desc">Organize or join brackets effortlessly. From local round-robins to national qualifiers.</p>
                </div>
                <img
                  alt="Tournament Bracket"
                  className="bento-card-img"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO7eNmbKZagAiZzaIoL9EFAnCWUoyhXD4o6JsQghR_gzKCj18VzEixr-CqH1r39Fp8J8PAK8kfUagcO9upQvk0W0B7YPQiNlB-atieJT7Yj0B2cxJFT4JMmPtoL-8O84JOcYzqfrOpSICL3I2N-t-biO7e02ofce-AmwWxDwUTKVvDg_bVDxuM73KjY8KGSRwvDpxCxRmJuIIZr5dJp1qr8eJ58355K3IxumX1D_9kWfFy6ThHJg7AzKuHaxRiua7PqC1uTXcRdBQr"
                />
              </div>
              <div className="bento-card bento-card-gradient bento-card-wide">
                <div className="bento-card-body">
                  <h3 className="bento-card-title light">Build Your Crew</h3>
                  <p className="bento-card-desc light">Follow players, join clubs, and get notified when your favorite group hits the court.</p>
                  <div className="crew-stats">
                    <div className="crew-stat">
                      <span className="crew-stat-number">250+</span>
                      <span className="crew-stat-label">Local Clubs</span>
                    </div>
                    <div className="crew-stat">
                      <span className="crew-stat-number">12k</span>
                      <span className="crew-stat-label">Messages Daily</span>
                    </div>
                  </div>
                </div>
                <div className="bento-card-community-icon">
                  <span className="material-symbols-outlined">diversity_3</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="scoreboard-section">
          <div className="scoreboard-bg-pattern"></div>
          <div className="scoreboard-inner">
            <div className="scoreboard-content">
              <h2 className="scoreboard-title">Real-Time Competition</h2>
              <p className="scoreboard-desc">Stay updated with live scoring from ongoing tournaments. Pickly brings professional-grade tracking to your local park.</p>
              <ul className="scoreboard-features">
                <li className="scoreboard-feature">
                  <span className="material-symbols-outlined check">check_circle</span>
                  <span>Instant Score Updates</span>
                </li>
                <li className="scoreboard-feature">
                  <span className="material-symbols-outlined check">check_circle</span>
                  <span>Live Stream Integration</span>
                </li>
                <li className="scoreboard-feature">
                  <span className="material-symbols-outlined check">check_circle</span>
                  <span>Automated Tie-Breakers</span>
                </li>
              </ul>
            </div>
            <div className="scoreboard-card">
              <div className="scoreboard-card-header">
                <div className="scoreboard-card-live">
                  <span className="live-dot"></span>
                  <span className="live-label">LIVE: COURT 04 &bull; SEMI-FINALS</span>
                </div>
                <span className="scoreboard-card-series">Pickly Pro Series</span>
              </div>
              <div className="scoreboard-card-body">
                <div className="score-display">
                  <div className="score-team score-team-lead">
                    <p className="score-team-name">SMITH / JONES</p>
                    <div className="score-number">11</div>
                    <p className="score-team-status">Serving</p>
                  </div>
                  <div className="score-team score-team-trail">
                    <p className="score-team-name">DAVIS / REED</p>
                    <div className="score-number">08</div>
                    <p className="score-team-status">Receiver</p>
                  </div>
                </div>
                <div className="scoreboard-card-footer">
                  <span>GAME 3 OF 3</span>
                  <span>DURATION: 22M 14S</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-inner">
            <div className="cta-glow cta-glow-1"></div>
            <div className="cta-glow cta-glow-2"></div>
            <h2 className="cta-title">Ready to Take the Court?</h2>
            <p className="cta-desc">Download the app and find your first match in minutes. The community is waiting for you.</p>
            <div className="cta-actions">
              <button className="btn-store">
                <span className="material-symbols-outlined">smartphone</span>
                App Store
              </button>
              <button className="btn-store">
                <span className="material-symbols-outlined">shop</span>
                Google Play
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">Pickly</div>
            <p className="footer-desc">High-energy pickleball for everyone. Connect, play, and compete in the modern era of social sports.</p>
            <div className="footer-social">
              <span className="material-symbols-outlined">social_leaderboard</span>
              <span className="material-symbols-outlined">camera_alt</span>
              <span className="material-symbols-outlined">close</span>
            </div>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-links">
              <li><Link href="#">Find Courts</Link></li>
              <li><Link href="/tournaments">Tournaments</Link></li>
              <li><Link href="#">Rankings</Link></li>
              <li><Link href="#">Community</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><Link href="#">About Us</Link></li>
              <li><Link href="#">Player Safety</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Support</h4>
            <ul className="footer-links">
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
              <li><Link href="#">Cookie Settings</Link></li>
              <li><Link href="#">Help Center</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Pickly. All rights reserved. High-energy pickleball for everyone.</p>
          <div className="footer-bottom-links">
            <span>English (US)</span>
            <span>USD ($)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
