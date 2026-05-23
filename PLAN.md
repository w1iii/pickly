# Pickly — Project Plan

> The all-in-one pickleball web app: court finder, matchmaker, and tournament organizer.

---

## 1. Vision

Pickly is a web app for pickleball players to find courts, get matched with players at their skill level, and run or join tournaments — all in one place. It targets the fastest-growing sport in the US with a passionate, spending community and zero dominant platform owning all three features together.

**Tagline:** _Find a court. Find a game. Find your match._

---

## 2. The Problem

Pickleball players today juggle multiple tools to do basic things:

- Finding courts → Google Maps or word of mouth
- Finding people to play with → Facebook groups, group chats
- Running tournaments → spreadsheets, TournamentTiger, or Pickleballbrackets.com

No single platform connects all three. Pickly does.

---

## 3. Target Users

| Segment             | Who they are                                 | Primary need                            |
| ------------------- | -------------------------------------------- | --------------------------------------- |
| Casual players      | Weekend warriors, beginners                  | Find a court, find a game               |
| Competitive players | 3.5–5.0 rated, play multiple times/week      | Skill-matched games, tournament results |
| Organizers          | Club managers, rec center staff, event hosts | Run tournaments, manage registrations   |
| Courts & clubs      | Indoor facilities, HOAs, parks & rec         | List their courts, attract players      |

---

## 4. Core Features (MVP)

### 4.1 Court & Game Finder

- Map view of nearby pickleball courts (Google Maps integration)
- Court detail page: address, indoor/outdoor, surface type, amenities, photos
- "Post open play" — any user can post a game at a court with date, time, skill range, and open slots
- Feed view of upcoming games filterable by distance, skill level, and date
- Courts seeded from Google Places API + manual import at launch

### 4.2 Player Matchmaker

- Browse open games and request to join
- Host dashboard to accept or decline join requests
- Confirmed roster view for each game
- Player profile cards: name, skill level (DUPR rating or self-reported), location, games played
- Email notifications on request received, accepted, or declined

### 4.3 Tournament Organizer

- Create a tournament: name, date, location, format (singles / doubles / round robin / single elimination)
- Public registration page with player sign-up
- Auto-generate bracket from registered players
- Visual bracket UI with match results entry
- Auto-advance winners through the bracket
- Public shareable results page per tournament
- "Post a tournament here" shortcut from any court detail page

### 4.4 User Accounts & Profiles

- Sign up / log in via email or Google OAuth
- Onboarding: name, skill level, city / zip code
- Profile page: games joined, tournaments entered, win/loss (self-reported)
- Settings: notifications, location, skill level update

---

## 5. Post-MVP Features (Week 2+)

- Stripe payment integration for tournament entry fees
- DUPR API integration for verified skill ratings
- In-app messaging between matched players
- Court reviews and ratings
- Club / court owner dashboard (claimed listings)
- Mobile PWA polish
- Push notifications
- Leaderboards per city or court
- Affiliate gear recommendations (paddle finder)

---

## 6. User Flows

### Flow 1 — Finding and joining a game

1. User signs up → completes onboarding (skill level, location)
2. Lands on home dashboard → sees "Games near you" feed
3. Filters by skill level and date
4. Taps a game → sees court info, host, skill range, open slots
5. Taps "Request to join"
6. Host receives email notification
7. Host accepts → player receives confirmation email
8. Both see each other in the confirmed roster

### Flow 2 — Posting an open play session

1. Logged-in user taps "Post a game"
2. Selects a court from the map or searches by name
3. Sets date, time, skill range (e.g. 3.0–3.5), max players, optional notes
4. Game is published to the feed
5. Join requests come in → host manages from dashboard

### Flow 3 — Running a tournament

1. Organizer taps "Create tournament"
2. Fills in: name, date, location, format, max players, entry fee (optional)
3. Shares the public registration link
4. Players register → organizer sees the list
5. Organizer locks registration → bracket is auto-generated
6. Organizer enters scores match by match
7. Bracket auto-advances winners
8. Results page is publicly shareable

### Flow 4 — Discovering a court

1. User opens the map tab
2. Sees pins for nearby courts
3. Taps a pin → sees court detail: address, amenities, upcoming games posted there, upcoming tournaments
4. Can post a game or tournament directly from the court page

---

## 7. Data Model

### Users

- id, name, email, avatar
- skill_level (beginner / 3.0 / 3.5 / 4.0 / 4.5 / 5.0+)
- city, zip, lat, lng
- dupr_rating (optional)
- created_at

### Courts

- id, name, address, lat, lng
- indoor (boolean)
- surface_type (asphalt / concrete / sport court)
- num_courts
- amenities (lights, restrooms, parking)
- photos[]
- created_by, verified (boolean)

### Games

- id, court_id, host_id
- date, start_time
- skill_min, skill_max
- max_players, current_count
- notes
- status (open / full / completed / cancelled)

### Match Requests

- id, game_id, player_id
- status (pending / accepted / declined)
- created_at

### Tournaments

- id, name, court_id, organizer_id
- date, format (singles / doubles / round_robin / single_elim)
- max_players, entry_fee
- status (draft / registration_open / in_progress / completed)
- public_slug (for shareable URL)

### Registrations

- id, tournament_id, player_id
- registered_at, paid (boolean)

### Brackets

- id, tournament_id
- rounds (JSON — array of rounds, each with matches)
- Each match: player1_id, player2_id, winner_id, score

---

## 8. Tech Stack

| Layer           | Choice                          | Why                            |
| --------------- | ------------------------------- | ------------------------------ |
| Framework       | Next.js 14 (App Router)         | Full-stack, fast, great DX     |
| Language        | TypeScript                      | Type safety, fewer bugs        |
| Styling         | Tailwind CSS + shadcn/ui        | Fast, consistent UI            |
| Database        | Supabase (Postgres)             | Auth + DB + Realtime in one    |
| Auth            | Supabase Auth                   | Email + Google OAuth, built-in |
| Maps            | Google Maps JS API + Places API | Court pins, geocoding, search  |
| Email           | Resend                          | Transactional emails           |
| Hosting         | Vercel                          | Zero-config deploys            |
| Analytics       | Plausible                       | Lightweight, privacy-friendly  |
| Payments        | Stripe (post-MVP)               | Tournament entry fees          |
| Version control | GitHub                          | CI/CD via Vercel integration   |

---

## 9. Weekend Build Plan

### Friday night (2–3 hours) — Setup

- Init Next.js 14 project with TypeScript + Tailwind
- Set up Supabase project (auth, database, storage)
- Define and run DB schema migrations
- Deploy to Vercel, connect custom domain
- Set up GitHub repo with main + dev branches

### Saturday — Court finder + Matchmaker

**Morning (9am – 12pm)**

- Google Maps integration — court pins by location
- Seed 30–50 real courts via Places API or CSV
- Court detail page
- "Post a game" form

**Afternoon (1pm – 5pm)**

- Game feed with filters
- "Request to join" flow
- Host dashboard (accept/decline)
- Email notifications via Resend

**Evening (6pm – 8pm)**

- Mobile responsive check
- Empty states and loading states
- Auth edge case fixes

### Sunday — Tournament organizer + Launch

**Morning (9am – 1pm)**

- Tournament creation form
- Public registration page
- Bracket auto-generation logic
- Visual bracket UI
- Score entry + winner auto-advance
- Public shareable results page

**Afternoon (1pm – 4pm)**

- Connect features (court → post tournament, profile → history)
- Home dashboard (my games, my tournaments, courts near me)
- SEO basics (meta tags, OG image)

**Evening (4pm – 7pm)**

- Final deploy
- Post in r/pickleball and local Facebook groups
- Set up feedback form
- Analytics live

---

## 10. Monetization Strategy

### Phase 1 — Launch (free, build users)

- All core features free
- Focus on getting 100+ active players in one city first

### Phase 2 — Tournament fees (Month 1–2)

- Charge organizers $10–$25 flat per tournament, OR
- Take 3–5% of entry fees collected via Stripe
- Clearest near-term revenue, organizers already pay for tools

### Phase 3 — Pro subscription (Month 2–3)

- $5–$8/month for players
- Benefits: priority matching, verified DUPR badge, advanced stats, match history, early access to new features
- Freemium funnel: free discovery → upgrade when hooked

### Phase 4 — Court & club listings (Month 3+)

- $20–$50/month for courts to claim listing
- Add photos, post events, get "verified court" badge
- Works once player traffic is established

### Passive — Affiliate

- Paddle and gear recommendations with Amazon affiliate links
- Stack on top of other revenue, zero maintenance

---

## 11. Go-to-Market

### Day 1 launch

- Post in r/pickleball ("I built a free matchmaking tool for pickleball players")
- Post in 3–5 local city Facebook pickleball groups
- DM 10–20 local organizers and offer to run their next tournament free
- List on Product Hunt (schedule for a Monday)

### Week 1–2

- Reach out to local pickleball clubs and rec centers
- Offer to onboard their courts and first tournament for free
- Collect testimonials and screenshots

### Month 1

- Target one city and dominate it before expanding
- Weekly newsletter to registered users (upcoming games, new courts)
- SEO content: "pickleball courts in [city]" landing pages

---

## 12. Success Metrics

| Metric           | Week 1 | Month 1 | Month 3 |
| ---------------- | ------ | ------- | ------- |
| Registered users | 50     | 500     | 2,000   |
| Games posted     | 10     | 100     | 500     |
| Tournaments run  | 1      | 10      | 50      |
| Revenue          | $0     | $100    | $1,000  |

---

## 13. Risks & Mitigations

| Risk                               | Mitigation                                                             |
| ---------------------------------- | ---------------------------------------------------------------------- |
| Cold start — no courts, no players | Seed courts manually at launch; recruit a local club as launch partner |
| "Dink" name variants too crowded   | Using "Pickly" — distinct, available, memorable                        |
| Organizers won't pay               | Start free, charge only after they've run 1–2 tournaments successfully |
| DUPR API access delays             | Use self-reported skill levels at launch; integrate DUPR post-MVP      |
| Maps API costs at scale            | Cache geocoding results; set billing alerts from day 1                 |

---

_Last updated: May 2026_
