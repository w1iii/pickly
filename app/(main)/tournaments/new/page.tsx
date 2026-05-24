"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import "./page.css";

const FORMATS = [
  { value: "singles", label: "Singles" },
  { value: "doubles", label: "Doubles" },
  { value: "round_robin", label: "Round Robin" },
  { value: "single_elim", label: "Single Elimination" },
];

export default function NewTournamentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    court_id: "",
    date: "",
    format: "single_elim",
    max_players: 8,
    entry_fee: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
  }

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

    const slug = generateSlug(formData.name) + "-" + Date.now().toString(36);

    const { error: insertError } = await supabase.from("tournaments").insert({
      name: formData.name,
      court_id: formData.court_id,
      organizer_id: user.id,
      date: formData.date,
      format: formData.format,
      max_players: formData.max_players,
      entry_fee: formData.entry_fee ? parseFloat(formData.entry_fee) : null,
      status: "registration_open",
      public_slug: slug,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    router.push(`/tournaments`);
    router.refresh();
  }

  return (
    <div className="new-tournament-page">
      <h1 className="new-tournament-title">Create Tournament</h1>

      <form onSubmit={handleSubmit} className="new-tournament-form card">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Tournament Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Austin Open 2026"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="court_id" className="form-label">Court ID</label>
          <input
            id="court_id"
            name="court_id"
            type="text"
            className="form-input"
            value={formData.court_id}
            onChange={(e) => setFormData({ ...formData, court_id: e.target.value })}
            placeholder="Court UUID (find on courts page)"
            required
          />
        </div>

        <div className="new-tournament-row">
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
            <label htmlFor="format" className="form-label">Format</label>
            <select
              id="format"
              name="format"
              className="form-select"
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
            >
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="new-tournament-row">
          <div className="form-group">
            <label htmlFor="max_players" className="form-label">Max Players</label>
            <input
              id="max_players"
              name="max_players"
              type="number"
              min={2}
              max={64}
              className="form-input"
              value={formData.max_players}
              onChange={(e) => setFormData({ ...formData, max_players: parseInt(e.target.value) })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="entry_fee" className="form-label">Entry Fee ($)</label>
            <input
              id="entry_fee"
              name="entry_fee"
              type="number"
              min={0}
              step="0.01"
              className="form-input"
              value={formData.entry_fee}
              onChange={(e) => setFormData({ ...formData, entry_fee: e.target.value })}
              placeholder="0 = free"
            />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting ? "Creating..." : "Create tournament"}
        </button>
      </form>
    </div>
  );
}
