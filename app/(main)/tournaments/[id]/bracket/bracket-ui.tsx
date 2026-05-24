"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BracketMatch {
  id: string;
  player1_id: string | null;
  player2_id: string | null;
  winner_id?: string | null;
  score?: { player1: number; player2: number } | null;
}

interface BracketRound {
  round_number: number;
  matches: BracketMatch[];
}

interface BracketData {
  id: string;
  rounds: BracketRound[];
}

export default function BracketUI({
  bracket,
  tournamentId,
  playerMap,
  isOrganizer,
}: {
  bracket: BracketData;
  tournamentId: string;
  playerMap: Record<string, string>;
  isOrganizer: boolean;
}) {
  const router = useRouter();
  const [scores, setScores] = useState<Record<string, { player1: string; player2: string }>>({});

  async function handleSubmitScore(matchId: string, player1Id: string, player2Id: string) {
    const score = scores[matchId];
    if (!score || !score.player1 || !score.player2) return;

    const p1 = parseInt(score.player1);
    const p2 = parseInt(score.player2);
    if (isNaN(p1) || isNaN(p2)) return;

    const winnerId = p1 > p2 ? player1Id : player2Id;

    await fetch(`/api/tournaments/${tournamentId}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        match_id: matchId,
        score: { player1: p1, player2: p2 },
        winner_id: winnerId,
      }),
    });

    router.refresh();
  }

  if (!bracket.rounds || bracket.rounds.length === 0) {
    return (
      <div className="dashboard-empty card">
        <h3>No rounds yet</h3>
        <p>The bracket has not been generated yet.</p>
      </div>
    );
  }

  return (
    <div className="bracket-visual">
      {bracket.rounds.map((round) => (
        <div key={round.round_number} className="bracket-round">
          <div className="bracket-round-title">
            {round.round_number === 1
              ? "First Round"
              : `Round ${round.round_number}`}
          </div>

          {round.matches.map((match) => (
            <div key={match.id} className="bracket-match">
              <div className="bracket-match-players">
                {/* Player 1 */}
                <div className={`bracket-match-player ${match.winner_id === match.player1_id ? "winner" : ""}`}>
                  <span>{match.player1_id ? playerMap[match.player1_id] || "Player" : <span className="bracket-by">TBD</span>}</span>
                  {match.score && (
                    <span className="bracket-match-score">{match.score.player1}</span>
                  )}
                </div>

                {/* Player 2 */}
                <div className={`bracket-match-player ${match.winner_id === match.player2_id ? "winner" : ""}`}>
                  <span>{match.player2_id ? playerMap[match.player2_id] || "Player" : <span className="bracket-by">TBD</span>}</span>
                  {match.score && (
                    <span className="bracket-match-score">{match.score.player2}</span>
                  )}
                </div>
              </div>

              {isOrganizer && match.player1_id && match.player2_id && !match.winner_id && (
                <div className="bracket-score-form">
                  <input
                    type="number"
                    className="bracket-score-input"
                    placeholder="P1"
                    value={scores[match.id]?.player1 || ""}
                    onChange={(e) =>
                      setScores({
                        ...scores,
                        [match.id]: { ...scores[match.id], player1: e.target.value },
                      })
                    }
                  />
                  <span style={{ fontSize: "var(--text-xs)" }}>-</span>
                  <input
                    type="number"
                    className="bracket-score-input"
                    placeholder="P2"
                    value={scores[match.id]?.player2 || ""}
                    onChange={(e) =>
                      setScores({
                        ...scores,
                        [match.id]: { ...scores[match.id], player2: e.target.value },
                      })
                    }
                  />
                  <button
                    onClick={() => handleSubmitScore(match.id, match.player1_id!, match.player2_id!)}
                    className="btn btn-primary btn-sm"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
