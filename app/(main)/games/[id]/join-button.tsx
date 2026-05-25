"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinGame } from "@/lib/actions/join-game";

export default function JoinRequestButton({
  gameId,
}: {
  gameId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    setLoading(true);
    setError("");

    const result = await joinGame(gameId);

    if (result.error) {
      setError(result.error);
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
