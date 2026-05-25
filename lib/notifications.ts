import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

// Uses admin client (service_role) to bypass RLS — inserts are always for a different user
export async function createNotification(params: {
  userId: string;
  type: "join_request" | "request_accepted" | "request_declined" | "tournament_update";
  title: string;
  body?: string;
  link?: string;
}) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("notifications").insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    body: params.body || null,
    link: params.link || null,
  });

  if (error) {
    console.error("Failed to create notification:", error.message);
  }
}

// Uses regular client — RLS policies handle per-user access
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);

  return count ?? 0;
}

export async function getRecentNotifications(userId: string, limit = 10) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function markAsRead(notificationId: string) {
  const supabase = await createClient();

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
}

export async function markAllAsRead(userId: string) {
  const supabase = await createClient();

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
}
