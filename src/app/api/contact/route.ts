import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: NextRequest) {
  const { name, email, phone, purpose } = await request.json();

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("contact_requests")
    .insert({ name: name.trim(), email: email.trim(), phone: phone?.trim() || null, purpose })
    .select("id")
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "Could not save request" }, { status: 500 });
  }

  const requestNumber = String(data.id).padStart(7, "0");
  const subject = `Solicitud ${requestNumber}`;

  const body = [
    `Nombre: ${name.trim()}`,
    `Email: ${email.trim()}`,
    `Teléfono: ${phone?.trim() || "No proporcionado"}`,
    `Motivo: ${purpose}`,
  ].join("\n");

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "Korner Club <noreply@kornerclub.es>",
      to: ["agentes@kornerclub.es"],
      subject,
      text: body,
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text();
    console.error("Resend error:", detail);
    return NextResponse.json({ error: "Could not send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true, requestNumber });
}
