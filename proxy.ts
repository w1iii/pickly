import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages viewable without authentication
const PUBLIC_PREFIXES = [
  "/", "/login", "/signup", "/auth/callback", "/auth-error",
  "/courts", "/tournaments", "/dashboard", "/community", "/games/", "/games",
];

// Routes that require authentication (no viewable content for guests)
const PROTECTED_EXACT = new Set([
  "/settings",
  "/onboarding",
  "/games/new",
  "/games/manage",
  "/tournaments/new",
  "/notifications",
]);

const PROTECTED_PATTERNS = [
  /^\/tournaments\/[^/]+\/manage(\/|$)/,
  /^\/tournaments\/[^/]+\/bracket(\/|$)/,
];

function isProtected(pathname: string): boolean {
  if (PROTECTED_EXACT.has(pathname)) return true;
  return PROTECTED_PATTERNS.some((p) => p.test(pathname));
}

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images/")
  ) {
    return NextResponse.next();
  }

  // Allow API routes to handle auth themselves
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Protected routes check first (more specific than public prefixes)
  if (isProtected(pathname)) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Allow public paths and everything else
  return NextResponse.next();
}
