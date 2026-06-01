import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * GET /api/internal-ref
 * Returns the next sequential Korner Club internal reference (KC-XXXXX).
 * Uses the service role key to read ALL properties regardless of auth context.
 */
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("properties")
    .select("internal_reference")
    .like("internal_reference", "KC-%");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Parse the numeric part of every KC-XXXXX reference and find the max
  const max = (data ?? []).reduce((acc, row) => {
    const raw = row.internal_reference ?? "";
    if (!raw.startsWith("KC-")) return acc;
    const num = parseInt(raw.slice(3), 10);
    return isNaN(num) ? acc : Math.max(acc, num);
  }, 0);

  const next = `KC-${String(max + 1).padStart(5, "0")}`;
  return NextResponse.json({ ref: next });
}
