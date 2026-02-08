import { e as createComponent, k as renderComponent, r as renderTemplate } from "../chunks/astro/server_B4iWt0jG.mjs";
import "piccolore";
/* empty css                                 */
import { $ as $$Layout } from "../chunks/Layout_BKMzyuNg.mjs";
import { renderers } from "../renderers.mjs";
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ClientLayout", null, { "client:only": true, "client:component-hydration": "only", "client:component-path": "@/components/LayoutClient", "client:component-export": "default" })} ` })}`;
}, "/home/ferdi/Projects/Astro-Clerk-Convex-Starter/src/pages/index.astro", void 0);
const $$file = "/home/ferdi/Projects/Astro-Clerk-Convex-Starter/src/pages/index.astro";
const $$url = "";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
