import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNotification } from "@/lib/notifications";

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
    .select("*, games!inner(*, courts(name)), player:profiles!player_id(name)")
    .eq("id", requestId)
    .single();

  if (!matchRequest || matchRequest.games.host_id !== user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const game = matchRequest.games as any;
  const courtName = game.courts?.name || "Unknown court";

  if (action === "accepted") {
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

    if (game.current_count + 1 >= game.max_players) {
      await supabase
        .from("games")
        .update({ status: "full" })
        .eq("id", matchRequest.game_id);
    }

    await createNotification({
      userId: matchRequest.player_id,
      type: "request_accepted",
      title: `Your request to join ${courtName} was accepted!`,
      body: `${game.date} at ${game.start_time?.slice(0, 5)}`,
      link: `/games/${matchRequest.game_id}`,
    });
  } else {
    const admin = createAdminClient();

    await supabase
      .from("match_requests")
      .update({ status: "declined" })
      .eq("id", requestId);

    await createNotification({
      userId: matchRequest.player_id,
      type: "request_declined",
      title: `Your request to join ${courtName} was declined`,
      link: "/games",
    });

    // Auto-accept the oldest waitlisted player
    const { data: waitlisted } = await supabase
      .from("match_requests")
      .select("id, player_id")
      .eq("game_id", matchRequest.game_id)
      .eq("status", "waitlisted")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (waitlisted && game.current_count < game.max_players) {
      await supabase
        .from("match_requests")
        .update({ status: "accepted" })
        .eq("id", waitlisted.id);

      await supabase
        .from("games")
        .update({ current_count: game.current_count + 1 })
        .eq("id", matchRequest.game_id);

      const newCount = game.current_count + 1;
      if (newCount >= game.max_players) {
        await supabase
          .from("games")
          .update({ status: "full" })
          .eq("id", matchRequest.game_id);
      }

      await createNotification({
        userId: waitlisted.player_id,
        type: "waitlist_accepted",
        title: `A spot opened up at ${courtName}!`,
        body: `You were auto-accepted from the waitlist. ${game.date} at ${game.start_time?.slice(0, 5)}`,
        link: `/games/${matchRequest.game_id}`,
      });
    }
  }

  revalidatePath("/games/manage");
  revalidatePath(`/games/${matchRequest.game_id}`);
  redirect(`/games/${matchRequest.game_id}`);
}
