import { e as createComponent, g as addAttribute, l as renderScript, r as renderTemplate, h as createAstro, k as renderComponent, n as renderHead, o as renderSlot } from "./astro/server_B4iWt0jG.mjs";
import "piccolore";
/* empty css                         */
import { jsx } from "react/jsx-runtime";
import { useTheme } from "next-themes";
import { Toaster as Toaster$1 } from "sonner";
import { Loader2Icon, OctagonXIcon, TriangleAlertIcon, InfoIcon, CircleCheckIcon } from "lucide-react";
import "clsx";
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      theme,
      icons: {
        success: /* @__PURE__ */ jsx(CircleCheckIcon, { className: "size-4" }),
        info: /* @__PURE__ */ jsx(InfoIcon, { className: "size-4" }),
        warning: /* @__PURE__ */ jsx(TriangleAlertIcon, { className: "size-4" }),
        // Already set, but you can customize color if needed
        error: /* @__PURE__ */ jsx(OctagonXIcon, { className: "size-4" }),
        loading: /* @__PURE__ */ jsx(Loader2Icon, { className: "size-4 animate-spin" })
      },
      className: "items-end",
      position: "bottom-right",
      toastOptions: {
        unstyled: true,
        classNames: {
          title: "text-sm",
          toast: "text-sm toast-item flex items-center gap-2 py-3 px-4 backdrop-blur-sm text-dark shadow-lg rounded-lg overflow-hidden",
          description: "text-xs",
          actionButton: "",
          cancelButton: "",
          error: "bg-danger/90 backdrop-blur-sm",
          success: "bg-success/90 backdrop-blur-sm",
          warning: "bg-red-500 ring-2 ring-red-400 backdrop-blur-sm text-white",
          info: "bg-info/90 backdrop-blur-sm"
        }
      },
      ...props
    }
  );
};
const $$Astro = createAstro();
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "/home/ferdi/Projects/Astro-Clerk-Convex-Starter/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/ferdi/Projects/Astro-Clerk-Convex-Starter/node_modules/astro/components/ClientRouter.astro", void 0);
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>Convex + Clerk</title>${renderComponent($$result, "ClientRouter", $$ClientRouter, {})}${renderHead()}</head> <body class="font-sans text-base antialiased w-full"> <div class="max-w-5xl mx-auto h-screen overflow-hidden"> ${renderComponent($$result, "Navbar", null, { "client:only": true, "client:component-hydration": "only", "client:component-path": "@/components/Navbar", "client:component-export": "default" })} ${renderSlot($$result, $$slots["default"])} </div> <div> ${renderComponent($$result, "Toaster", Toaster, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/ui/sonner", "client:component-export": "Toaster" })} </div> </body></html>`;
}, "/home/ferdi/Projects/Astro-Clerk-Convex-Starter/src/layouts/Layout.astro", void 0);
export {
  $$Layout as $
};
