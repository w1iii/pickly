"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchUnreadCount, fetchRecentNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/actions/notifications";
import "./notification-dropdown.css";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export default function NotificationDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUnread();
    const interval = setInterval(loadUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function loadUnread() {
    const count = await fetchUnreadCount();
    setUnread(count);
  }

  async function toggle() {
    if (!open) {
      const items = await fetchRecentNotifications(8);
      setNotifications(items);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  async function handleClick(n: Notification) {
    if (!n.read) {
      await markNotificationAsRead(n.id);
      setUnread((prev) => Math.max(0, prev - 1));
    }
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  async function handleMarkAllRead() {
    await markAllNotificationsAsRead();
    setUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const typeIcon: Record<string, string> = {
    join_request: "person_add",
    request_accepted: "check_circle",
    request_declined: "cancel",
    tournament_update: "emoji_events",
  };

  return (
    <div className="notif-dropdown" ref={ref}>
      <button className="main-icon-btn" onClick={toggle} aria-label="Notifications">
        <span className="material-symbols-outlined">notifications</span>
        {unread > 0 && <span className="notif-badge">{unread > 99 ? "99+" : unread}</span>}
      </button>

      {open && (
        <div className="notif-dropdown-menu">
          <div className="notif-dropdown-header">
            <span className="notif-dropdown-title">Notifications</span>
            {unread > 0 && (
              <button className="notif-mark-read" onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-dropdown-list">
            {notifications.length === 0 ? (
              <div className="notif-dropdown-empty">
                <span className="material-symbols-outlined">notifications_off</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  className={`notif-dropdown-item ${!n.read ? "notif-unread" : ""}`}
                  onClick={() => handleClick(n)}
                >
                  <span className="material-symbols-outlined notif-item-icon">
                    {typeIcon[n.type] || "notifications"}
                  </span>
                  <div className="notif-item-content">
                    <p className="notif-item-title">{n.title}</p>
                    {n.body && <p className="notif-item-body">{n.body}</p>}
                  </div>
                </button>
              ))
            )}
          </div>

          <Link href="/notifications" className="notif-dropdown-footer" onClick={() => setOpen(false)}>
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
