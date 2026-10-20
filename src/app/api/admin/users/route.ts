import type { NextRequest } from "next/server";
import { adminConfigured, errorResponse, inviteUser, isPreview, listUsers, previewUsers, siteBase, requireSuperAdmin, type InviteInput } from "@/lib/server/admin";

export const runtime = "nodejs";

/** GET: everyone with a login and their role. */
export async function GET() {
  try {
    if (await isPreview()) return Response.json({ configured: true, preview: true, users: previewUsers(), me: "demo-me" });
    const me = await requireSuperAdmin();
    if (!adminConfigured()) return Response.json({ configured: false, users: [], me: me.id });
    return Response.json({ configured: true, users: await listUsers(), me: me.id });
  } catch (e) {
    return errorResponse(e);
  }
}

/** POST: invite someone (email, name, position, role). */
export async function POST(req: NextRequest) {
  try {
    if (await isPreview()) return Response.json({ id: `demo-${Date.now()}`, preview: true });
    const me = await requireSuperAdmin();
    const body = (await req.json()) as InviteInput;
    const id = await inviteUser(me, body, siteBase(req));
    return Response.json({ id });
  } catch (e) {
    return errorResponse(e);
  }
}
