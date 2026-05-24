"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function RegisterButton({
  tournamentId,
  userId,
}: {
  tournamentId: string;
  userId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    setLoading(true);
    setError("");

    const { error: regError } = await createClient()
      .from("registrations")
      .insert({ tournament_id: tournamentId, player_id: userId });

    if (regError) {
      setError(regError.message);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <button
        onClick={handleRegister}
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register for tournament"}
      </button>
      {error && <p className="form-error mt-1">{error}</p>}
    </div>
  );
}
