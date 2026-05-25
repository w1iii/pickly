"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/actions/notifications";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export default function NotificationList({ initial }: { initial: Notification[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "unread" ? items.filter((n) => !n.read) : items;
  const unreadCount = items.filter((n) => !n.read).length;

  async function handleClick(n: Notification) {
    if (!n.read) {
      await markNotificationAsRead(n.id);
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    }
    if (n.link) router.push(n.link);
  }

  async function handleMarkAll() {
    await markAllNotificationsAsRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const typeIcon: Record<string, string> = {
    join_request: "person_add",
    request_accepted: "check_circle",
    request_declined: "cancel",
    tournament_update: "emoji_events",
  };

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div className="notif-list-container">
      <div className="notif-list-header">
        <div className="notif-list-tabs">
          <button
            className={`notif-tab ${filter === "all" ? "notif-tab-active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`notif-tab ${filter === "unread" ? "notif-tab-active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
        {unreadCount > 0 && (
          <button className="notif-mark-all-btn" onClick={handleMarkAll}>
            Mark all as read
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="notif-empty">
          <span className="material-symbols-outlined">notifications_off</span>
          <p>{filter === "unread" ? "No unread notifications" : "No notifications yet"}</p>
        </div>
      ) : (
        <div className="notif-list">
          {filtered.map((n) => (
            <button
              key={n.id}
              className={`notif-item ${!n.read ? "notif-item-unread" : ""}`}
              onClick={() => handleClick(n)}
            >
              <span className="material-symbols-outlined notif-item-type-icon">
                {typeIcon[n.type] || "notifications"}
              </span>
              <div className="notif-item-body">
                <p className="notif-item-title">{n.title}</p>
                {n.body && <p className="notif-item-text">{n.body}</p>}
              </div>
              <span className="notif-item-time">{formatDate(n.created_at)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
