import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_B4iWt0jG.mjs";
import "piccolore";
import { $ as $$Layout } from "../chunks/Layout_BKMzyuNg.mjs";
import { renderers } from "../renderers.mjs";
const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="grid min-h-full place-items-center"> <div class="text-center"> <p class="text-base font-semibold text-red-500">404</p> <h1 class="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">
Page not found
</h1> <p class="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
Sorry, we couldn’t find the page you’re looking for.
</p> <div class="mt-10 flex items-center justify-center gap-x-6"> <a href="#" class="rounded-full px-5 py-2.5 text-sm font-semibold border border-gray-200 hover:bg-gray-200 hover:broder-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transtion-all duration-300">Go home</a> <a href="#" class="text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-gray-200 transition-all duration-300">Go back</a> </div> </div> </main> ` })}`;
}, "/home/ferdi/Projects/Astro-Clerk-Convex-Starter/src/pages/404.astro", void 0);
const $$file = "/home/ferdi/Projects/Astro-Clerk-Convex-Starter/src/pages/404.astro";
const $$url = "/404";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
