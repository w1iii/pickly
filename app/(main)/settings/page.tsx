"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import "./page.css";

const SKILL_LEVELS = ["beginner", "3.0", "3.5", "4.0", "4.5", "5.0+"];

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [skillLevel, setSkillLevel] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setSkillLevel(data.skill_level || "");
        setCity(data.city || "");
        setZip(data.zip || "");
      }
    }
    load();
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ skill_level: skillLevel, city, zip })
      .eq("id", profile?.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (!profile) return <div className="settings-page"><p className="text-muted">Loading...</p></div>;

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      <form onSubmit={handleSave} className="settings-form card">
        <div className="form-group">
          <label className="form-label">Email</label>
          <p className="text-sm text-muted">{profile.email}</p>
        </div>

        <div className="form-group">
          <label className="form-label">Name</label>
          <p className="text-sm text-muted">{profile.name}</p>
        </div>

        <div className="form-group">
          <label className="form-label">Skill Level</label>
          <select
            className="form-select"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
          >
            {SKILL_LEVELS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="city" className="form-label">City</label>
          <input
            id="city"
            type="text"
            className="form-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="zip" className="form-label">ZIP Code</label>
          <input
            id="zip"
            type="text"
            className="form-input"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
          {saved && <span style={{ color: "var(--color-success)", fontSize: "var(--text-sm)" }}>Saved!</span>}
        </div>
      </form>
    </div>
  );
}
