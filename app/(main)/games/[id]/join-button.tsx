"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinGame, joinWaitlist } from "@/lib/actions/join-game";

export default function JoinRequestButton({
  gameId,
  isFull,
}: {
  gameId: string;
  isFull: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    setLoading(true);
    setError("");

    const result = isFull ? await joinWaitlist(gameId) : await joinGame(gameId);

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
        {loading ? "Please wait..." : isFull ? "Join waitlist" : "Request to join"}
      </button>
      {error && <p className="form-error mt-1">{error}</p>}
    </div>
  );
}
