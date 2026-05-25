"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import "./page.css";

const SKILLS = ["beginner", "3.0", "3.5", "4.0", "4.5", "5.0+"];

function NewGameForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCourt = searchParams.get("court") || "";

  const [formData, setFormData] = useState({
    court_id: preselectedCourt,
    date: "",
    start_time: "",
    skill_min: "3.0",
    skill_max: "4.0",
    max_players: 4,
    notes: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in.");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("games").insert({
      court_id: formData.court_id,
      host_id: user.id,
      date: formData.date,
      start_time: formData.start_time,
      skill_min: formData.skill_min,
      skill_max: formData.skill_max,
      max_players: formData.max_players,
      current_count: 1,
      notes: formData.notes || null,
      status: "open",
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    router.push("/games");
    router.refresh();
  }

  return (
    <div className="new-game-page">
      <h1 className="new-game-title">Post a Game</h1>

      <form onSubmit={handleSubmit} className="new-game-form card">
        <div className="form-group">
          <label htmlFor="court_id" className="form-label">Court</label>
          <input
            id="court_id"
            name="court_id"
            type="text"
            className="form-input"
            placeholder="Court ID (search courts page)"
            value={formData.court_id}
            onChange={(e) => setFormData({ ...formData, court_id: e.target.value })}
            required
          />
        </div>

        <div className="new-game-form-row">
          <div className="form-group">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              className="form-input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="start_time" className="form-label">Time</label>
            <input
              id="start_time"
              name="start_time"
              type="time"
              className="form-input"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="new-game-form-row">
          <div className="form-group">
            <label htmlFor="skill_min" className="form-label">Min Skill</label>
            <select
              id="skill_min"
              name="skill_min"
              className="form-select"
              value={formData.skill_min}
              onChange={(e) => setFormData({ ...formData, skill_min: e.target.value })}
            >
              {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="skill_max" className="form-label">Max Skill</label>
            <select
              id="skill_max"
              name="skill_max"
              className="form-select"
              value={formData.skill_max}
              onChange={(e) => setFormData({ ...formData, skill_max: e.target.value })}
            >
              {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="max_players" className="form-label">Max Players</label>
          <input
            id="max_players"
            name="max_players"
            type="number"
            min={2}
            max={20}
            className="form-input"
            value={formData.max_players}
            onChange={(e) => setFormData({ ...formData, max_players: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            className="form-textarea"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Bring your own balls, water available"
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting ? "Posting..." : "Post game"}
        </button>
      </form>
    </div>
  );
}

export default function NewGamePage() {
  return (
    <Suspense fallback={<div className="new-game-page"><p className="text-muted">Loading...</p></div>}>
      <NewGameForm />
    </Suspense>
  );
}
