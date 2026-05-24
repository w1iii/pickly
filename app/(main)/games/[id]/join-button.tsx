"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function JoinRequestButton({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    setLoading(true);
    setError("");

    const { error: reqError } = await createClient()
      .from("match_requests")
      .insert({ game_id: gameId, player_id: userId });

    if (reqError) {
      setError(reqError.message);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <button
        onClick={handleJoin}
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Requesting..." : "Request to join"}
      </button>
      {error && <p className="form-error mt-1">{error}</p>}
    </div>
  );
}
