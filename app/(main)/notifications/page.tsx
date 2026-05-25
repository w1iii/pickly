import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import NotificationList from "./notification-list";
import "./page.css";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="notif-page">
      <h1 className="notif-page-title">Notifications</h1>
      <NotificationList initial={notifications ?? []} />
    </div>
  );
}
