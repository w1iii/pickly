"use server";

import { createClient } from "@/lib/supabase-server";
import { createNotification } from "@/lib/notifications";

export async function joinGame(gameId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, skill_level")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { error: "Profile not found." };
  }

  const { data: game } = await supabase
    .from("games")
    .select("*, courts(name)")
    .eq("id", gameId)
    .single();

  if (!game) {
    return { error: "Game not found." };
  }

  if (game.status !== "open") {
    return { error: "This game is no longer accepting requests." };
  }

  if (game.current_count >= game.max_players) {
    return { error: "This game is full." };
  }

  const { data: existingRequest } = await supabase
    .from("match_requests")
    .select("id, status")
    .eq("game_id", gameId)
    .eq("player_id", user.id)
    .maybeSingle();

  if (existingRequest) {
    if (existingRequest.status === "pending") {
      return { error: "You already requested to join this game." };
    }
    if (existingRequest.status === "accepted") {
      return { error: "You are already in this game." };
    }
    if (existingRequest.status === "declined") {
      return { error: "Your previous request was declined. The host is not accepting new requests from you." };
    }
  }

  const { error: insertError } = await supabase
    .from("match_requests")
    .insert({ game_id: gameId, player_id: user.id });

  if (insertError) {
    if (insertError.code === "23505") {
      return { error: "You already requested to join this game." };
    }
    return { error: insertError.message };
  }

  const courtName = game.courts?.name || "Unknown court";
  const playerName = profile.name || "Someone";
  const playerSkill = profile.skill_level || "Unknown skill";

  await createNotification({
    userId: game.host_id,
    type: "join_request",
    title: `${playerName} (${playerSkill}) wants to join ${courtName}`,
    body: `Game on ${game.date} at ${game.start_time?.slice(0, 5)}`,
    link: `/games/${gameId}`,
  });

  return { success: true };
}
