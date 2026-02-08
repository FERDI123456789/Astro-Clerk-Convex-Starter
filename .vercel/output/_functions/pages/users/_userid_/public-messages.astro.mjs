import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from "../../../chunks/astro/server_B4iWt0jG.mjs";
import "piccolore";
import { $ as $$Layout } from "../../../chunks/Layout_BKMzyuNg.mjs";
import { renderers } from "../../../renderers.mjs";
const $$Astro = createAstro();
const $$PublicMessages = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PublicMessages;
  const { userId } = Astro2.params;
  if (!userId) {
    return Astro2.redirect("/");
  }
  const fromId = Astro2.url.searchParams.get("from");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col h-full max-w-5xl mx-auto overflow-hidden"> ${renderComponent($$result2, "UserPublicMessages", null, { "userId": userId, "client:only": true, "fromId": fromId, "client:component-hydration": "only", "client:component-path": "@/components/UserPublicMessages.tsx", "client:component-export": "default" })} </div> ` })}`;
}, "/home/ferdi/Projects/Astro-Clerk-Convex-Starter/src/pages/users/[userId]/public-messages.astro", void 0);
const $$file = "/home/ferdi/Projects/Astro-Clerk-Convex-Starter/src/pages/users/[userId]/public-messages.astro";
const $$url = "/users/[userId]/public-messages";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$PublicMessages,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
