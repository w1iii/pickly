import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Verify organizer
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (!tournament || tournament.organizer_id !== user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get all registrations
  const { data: registrations } = await supabase
    .from("registrations")
    .select("player_id")
    .eq("tournament_id", id);

  if (!registrations || registrations.length < 2) {
    return Response.json({ error: "Need at least 2 players" }, { status: 400 });
  }

  const playerIds = registrations.map((r) => r.player_id);

  // Generate bracket rounds
  const rounds: any[] = [];

  if (tournament.format === "single_elim") {
    // Shuffle player order
    const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
    const matches: any[] = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      matches.push({
        id: crypto.randomUUID(),
        player1_id: shuffled[i],
        player2_id: shuffled[i + 1] || null,
        winner_id: null,
        score: null,
      });
    }

    rounds.push({ round_number: 1, matches });

    // Generate subsequent rounds
    let roundNum = 2;
    let matchCount = Math.ceil(matches.length / 2);
    while (matchCount > 0) {
      const nextMatches: any[] = [];
      for (let i = 0; i < matchCount; i++) {
        nextMatches.push({
          id: crypto.randomUUID(),
          player1_id: null,
          player2_id: null,
          winner_id: null,
          score: null,
        });
      }
      rounds.push({ round_number: roundNum, matches: nextMatches });
      matchCount = Math.floor(matchCount / 2);
      roundNum++;
    }
  } else {
    // Round robin: each player plays every other
    const matches: any[] = [];
    for (let i = 0; i < playerIds.length; i++) {
      for (let j = i + 1; j < playerIds.length; j++) {
        matches.push({
          id: crypto.randomUUID(),
          player1_id: playerIds[i],
          player2_id: playerIds[j],
          winner_id: null,
          score: null,
        });
      }
    }
    rounds.push({ round_number: 1, matches });
  }

  // Upsert bracket
  const { error: bracketError } = await supabase.from("brackets").upsert({
    tournament_id: id,
    rounds,
  });

  if (bracketError) {
    return Response.json({ error: bracketError.message }, { status: 500 });
  }

  // Update tournament status
  await supabase
    .from("tournaments")
    .update({ status: "in_progress" })
    .eq("id", id);

  revalidatePath(`/tournaments/${id}`);
  revalidatePath(`/tournaments/${id}/manage`);
  revalidatePath(`/tournaments/${id}/bracket`);
  redirect(`/tournaments/${id}/bracket`);
}
