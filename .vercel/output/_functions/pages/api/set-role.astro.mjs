import { a as clerkClient } from "../../chunks/index_CXFyMHbu.mjs";
import { renderers } from "../../renderers.mjs";
const POST = async (context) => {
  const { request, locals } = context;
  const { userId, sessionClaims } = locals.auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const roleFromSession = sessionClaims?.publicMetadata?.role;
  if (roleFromSession !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }
  const { targetUserId, role } = await request.json();
  if (!targetUserId || !role) {
    return new Response("Missing data", { status: 400 });
  }
  const client = clerkClient(context);
  await client.users.updateUser(targetUserId, {
    publicMetadata: { role }
  });
  return new Response(JSON.stringify({ ok: true }));
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
