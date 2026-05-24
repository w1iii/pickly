import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const formData = await request.formData();
  const requestId = formData.get("request_id") as string;
  const action = formData.get("action") as "accepted" | "declined";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the user is the host of the game
  const { data: matchRequest } = await supabase
    .from("match_requests")
    .select("*, games!inner(host_id, current_count, max_players)")
    .eq("id", requestId)
    .single();

  if (!matchRequest || matchRequest.games.host_id !== user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (action === "accepted") {
    const game = matchRequest.games as any;
    if (game.current_count >= game.max_players) {
      return Response.json({ error: "Game is full" }, { status: 400 });
    }

    await supabase
      .from("match_requests")
      .update({ status: "accepted" })
      .eq("id", requestId);

    await supabase
      .from("games")
      .update({ current_count: game.current_count + 1 })
      .eq("id", matchRequest.game_id);

    // Check if game is now full
    if (game.current_count + 1 >= game.max_players) {
      await supabase
        .from("games")
        .update({ status: "full" })
        .eq("id", matchRequest.game_id);
    }
  } else {
    await supabase
      .from("match_requests")
      .update({ status: "declined" })
      .eq("id", requestId);
  }

  revalidatePath("/games/manage");
  revalidatePath(`/games/${matchRequest.game_id}`);
  redirect(`/games/${matchRequest.game_id}`);
}
