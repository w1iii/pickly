"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import "./page.css";

const SKILL_LEVELS = ["beginner", "3.0", "3.5", "4.0", "4.5", "5.0+"];

export default function OnboardingPage() {
  const router = useRouter();
  const [skillLevel, setSkillLevel] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { error: updateError } = await createClient()
      .from("profiles")
      .update({ skill_level: skillLevel, city, zip })
      .eq("id", (await createClient().auth.getUser()).data.user?.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-card card">
        <div className="onboarding-header">
          <h1 className="onboarding-title">Welcome to Pickly!</h1>
          <p className="onboarding-subtitle">Tell us about yourself to find the right games and players.</p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group">
            <label className="form-label">Skill Level</label>
            <div className="onboarding-skill-options">
              {SKILL_LEVELS.map((level) => (
                <label
                  key={level}
                  className={`onboarding-skill-option ${skillLevel === level ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="skill_level"
                    value={level}
                    checked={skillLevel === level}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    required
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="city" className="form-label">City</label>
            <input
              id="city"
              name="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="form-input"
              placeholder="e.g. Austin, TX"
            />
          </div>

          <div className="form-group">
            <label htmlFor="zip" className="form-label">ZIP Code</label>
            <input
              id="zip"
              name="zip"
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
              className="form-input"
              placeholder="e.g. 78701"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary w-full">
            Get started
          </button>
        </form>
      </div>
    </div>
  );
}
