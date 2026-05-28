"use client";

import { deleteGame } from "@/lib/actions/delete-game";
import { useState } from "react";

export default function DeleteGameButton({ gameId }: { gameId: string }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (deleting) return;
    if (!confirm("Delete this game? This cannot be undone.")) return;

    setDeleting(true);
    try {
      await deleteGame(gameId);
      window.location.reload();
    } catch {
      alert("Failed to delete game.");
      setDeleting(false);
    }
  }

  return (
    <button onClick={handleDelete} disabled={deleting} className="btn btn-ghost btn-sm" title="Delete game" style={{ color: "var(--color-danger, #ef4444)" }}>
      {deleting ? "..." : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      )}
    </button>
  );
}
