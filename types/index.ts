/**
 * Core TypeScript type definitions for Pickly
 * Aligned with PLAN.md data model (section 7)
 */

/** User profile (extends Supabase auth.users) */
export interface Profile {
  id: string;
  name: string;
  avatar?: string;
  skill_level: "beginner" | "3.0" | "3.5" | "4.0" | "4.5" | "5.0+";
  city?: string;
  zip?: string;
  lat?: number;
  lng?: number;
  dupr_rating?: number;
  created_at: string;
}

/** Pickleball court location */
export interface Court {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  indoor: boolean;
  surface_type: "asphalt" | "concrete" | "sport_court";
  num_courts: number;
  amenities: string[]; // e.g., ["lights", "restrooms", "parking"]
  photos: string[];
  created_by: string;
  verified: boolean;
}

/** Open play game session */
export interface Game {
  id: string;
  court_id: string;
  host_id: string;
  date: string; // ISO date
  start_time: string; // HH:MM format
  skill_min: string; // e.g., "3.0"
  skill_max: string; // e.g., "3.5"
  max_players: number;
  current_count: number;
  notes?: string;
  status: "open" | "full" | "completed" | "cancelled";
}

/** Request to join a game */
export interface MatchRequest {
  id: string;
  game_id: string;
  player_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

/** Tournament event */
export interface Tournament {
  id: string;
  name: string;
  court_id: string;
  organizer_id: string;
  date: string; // ISO date
  format: "singles" | "doubles" | "round_robin" | "single_elim";
  max_players: number;
  entry_fee?: number;
  status: "draft" | "registration_open" | "in_progress" | "completed";
  public_slug: string; // URL-safe identifier
}

/** Tournament registration */
export interface Registration {
  id: string;
  tournament_id: string;
  player_id: string;
  registered_at: string;
  paid: boolean;
}

/** Tournament bracket with matches and results */
export interface Bracket {
  id: string;
  tournament_id: string;
  rounds: BracketRound[];
}

export interface BracketRound {
  round_number: number;
  matches: BracketMatch[];
}

export interface BracketMatch {
  id: string;
  player1_id: string;
  player2_id: string;
  winner_id?: string;
  score?: {
    player1: number;
    player2: number;
  };
}
