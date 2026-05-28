"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "@/lib/auth-actions";
import "./user-dropdown.css";

interface UserDropdownProps {
  initials: string;
}

export default function UserDropdown({ initials }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="user-dropdown" ref={ref}>
      <button
        className="user-dropdown-trigger"
        onClick={() => setOpen(!open)}
        aria-label="Account menu"
      >
        <div className="user-avatar">{initials}</div>
      </button>

      {open && (
        <div className="user-dropdown-menu">
          <Link
            href="/settings"
            className="user-dropdown-item"
            onClick={() => setOpen(false)}
          >
            <span className="material-symbols-outlined user-dropdown-icon">settings</span>
            Settings
          </Link>
          <form action={signOut}>
            <button type="submit" className="user-dropdown-item user-dropdown-signout">
              <span className="material-symbols-outlined user-dropdown-icon">logout</span>
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
