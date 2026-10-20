import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/links";
import { supabaseServer } from "@/lib/supabase/server";

// Landing URL for sign-in links:
//   ?token_hash=…&type=…&next=…   TOSS TMS emails (supabase/templates)
//   ?code=…                        PKCE password-reset links
// Email links don't sign in on GET: mail scanners (Outlook Safe Links and others) open every
// link by themselves and would use up the one-time code. They go to /auth/continue, where the
// person presses Continue (a POST back here).

const TYPES = new Set<EmailOtpType>(["invite", "recovery", "magiclink", "email", "signup", "email_change"]);

async function verify(origin: string, tokenHash: string | null, type: string | null, nextRaw: string | null) {
  const next = safeNext(nextRaw ?? "/");
  if (tokenHash && type && TYPES.has(type as EmailOtpType)) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.verifyOtp({ type: type as EmailOtpType, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL(next, origin), 303);
    console.warn(`[auth/confirm] ${type} link failed: ${error.code ?? ""} ${error.message}`);
  }
  const login = new URL("/login", origin);
  login.searchParams.set("error", "link");
  return NextResponse.redirect(login, 303);
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  if (code) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    const next = safeNext(url.searchParams.get("next") ?? "/");
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
    const login = new URL("/login", url.origin);
    login.searchParams.set("error", "link");
    return NextResponse.redirect(login);
  }
  const go = new URL("/auth/continue", url.origin);
  for (const k of ["token_hash", "type", "next"]) {
    const v = url.searchParams.get(k);
    if (v) go.searchParams.set(k, v);
  }
  return NextResponse.redirect(go);
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const s = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : null;
  };
  return verify(req.nextUrl.origin, s("token_hash"), s("type"), s("next"));
}
