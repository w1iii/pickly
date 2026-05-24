import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { match_id, score, winner_id } = await request.json();

  // Verify organizer
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (!tournament || tournament.organizer_id !== user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get current bracket
  const { data: bracket } = await supabase
    .from("brackets")
    .select("*")
    .eq("tournament_id", id)
    .single();

  if (!bracket) {
    return Response.json({ error: "Bracket not found" }, { status: 404 });
  }

  // Update the match in the bracket rounds
  const updatedRounds = bracket.rounds.map((round: any) => ({
    ...round,
    matches: round.matches.map((match: any) => {
      if (match.id === match_id) {
        return { ...match, score, winner_id };
      }
      // Advance winner to next round match if applicable
      if (winner_id) {
        const nextRound = bracket.rounds[round.round_number]; // next round index
        if (nextRound) {
          // Find which slot this match feeds into
          const matchIndex = round.matches.findIndex((m: any) => m.id === match_id);
          const nextMatchIndex = Math.floor(matchIndex / 2);
          const nextMatch = nextRound.matches[nextMatchIndex];
          if (nextMatch) {
            const isFirstLoser = matchIndex % 2 === 0;
            if (isFirstLoser) {
              nextMatch.player1_id = winner_id;
            } else {
              nextMatch.player2_id = winner_id;
            }
          }
        }
      }
      return match;
    }),
  }));

  const { error } = await supabase
    .from("brackets")
    .update({ rounds: updatedRounds })
    .eq("id", bracket.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Check if tournament is complete (last round has winner)
  const lastRound = updatedRounds[updatedRounds.length - 1];
  if (lastRound?.matches?.[0]?.winner_id) {
    await supabase
      .from("tournaments")
      .update({ status: "completed" })
      .eq("id", id);
  }

  revalidatePath(`/tournaments/${id}/bracket`);
  return Response.json({ success: true });
}
