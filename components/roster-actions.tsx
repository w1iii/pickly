"use client";

import { useRouter } from "next/navigation";
import { leaveGame } from "@/lib/actions/leave-game";
import { removePlayer } from "@/lib/actions/remove-player";
import { useState } from "react";

export function LeaveGameButton({ gameId }: { gameId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handle() {
    if (!confirm("Leave this game?")) return;
    setBusy(true);
    await leaveGame(gameId);
    router.refresh();
  }

  return (
    <button onClick={handle} disabled={busy} className="btn btn-ghost btn-sm" style={{ color: "var(--color-danger, #ef4444)" }}>
      {busy ? "..." : "Leave"}
    </button>
  );
}

export function RemovePlayerButton({ gameId, playerId }: { gameId: string; playerId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handle() {
    if (!confirm("Remove this player from the game?")) return;
    setBusy(true);
    await removePlayer(gameId, playerId);
    router.refresh();
  }

  return (
    <button onClick={handle} disabled={busy} className="btn btn-ghost btn-sm" style={{ color: "var(--color-danger, #ef4444)" }}>
      {busy ? "..." : "Remove"}
    </button>
  );
}
