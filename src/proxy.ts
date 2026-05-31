import { NextRequest, NextResponse } from "next/server";

// Auth for /admin routes is handled client-side in src/app/admin/layout.tsx
// (Supabase with implicit flow stores sessions in localStorage, not cookies,
// so server-side middleware cannot reliably read the session.)
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
