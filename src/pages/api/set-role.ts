import type { APIRoute } from "astro";
import { clerkClient } from "@clerk/astro/server";

export const POST: APIRoute = async (context) => {
  const { request, locals } = context;

  const { userId, sessionClaims } = locals.auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 👇 ADD THIS BLOCK HERE
  type Role = "admin" | "standard";

  const roleFromSession = (
    sessionClaims?.publicMetadata as {
      role?: Role;
    }
  )?.role;

  if (roleFromSession !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }
  // 👆 END ADMIN CHECK

  const { targetUserId, role } = await request.json();

  if (!targetUserId || !role) {
    return new Response("Missing data", { status: 400 });
  }

  const client = clerkClient(context);

  await client.users.updateUser(targetUserId, {
    publicMetadata: { role },
  });

  return new Response(JSON.stringify({ ok: true }));
};
