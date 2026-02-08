import "piccolore";
import { p as decodeKey } from "./chunks/astro/server_B4iWt0jG.mjs";
import "clsx";
import "./chunks/astro-designed-error-pages_DJETm1HC.mjs";
import "es-module-lexer";
import { N as NOOP_MIDDLEWARE_FN } from "./chunks/noop-middleware_BzAkynu4.mjs";
function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}
function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}
function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}
const manifest = deserializeManifest({"hrefRoot":"file:///home/ferdi/Projects/Astro-Clerk-Convex-Starter/","cacheDir":"file:///home/ferdi/Projects/Astro-Clerk-Convex-Starter/node_modules/.astro/","outDir":"file:///home/ferdi/Projects/Astro-Clerk-Convex-Starter/dist/","srcDir":"file:///home/ferdi/Projects/Astro-Clerk-Convex-Starter/src/","publicDir":"file:///home/ferdi/Projects/Astro-Clerk-Convex-Starter/public/","buildClientDir":"file:///home/ferdi/Projects/Astro-Clerk-Convex-Starter/dist/client/","buildServerDir":"file:///home/ferdi/Projects/Astro-Clerk-Convex-Starter/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BxVPUcVC.js"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BxVPUcVC.js"}],"styles":[{"type":"external","src":"/_astro/index.D7lD85h2.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BxVPUcVC.js"}],"styles":[],"routeData":{"route":"/api/set-role","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/set-role\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"set-role","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/set-role.ts","pathname":"/api/set-role","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BxVPUcVC.js"}],"styles":[{"type":"external","src":"/_astro/index.D7lD85h2.css"}],"routeData":{"route":"/users/[userid]/public-messages","isIndex":false,"type":"page","pattern":"^\\/users\\/([^/]+?)\\/public-messages\\/?$","segments":[[{"content":"users","dynamic":false,"spread":false}],[{"content":"userId","dynamic":true,"spread":false}],[{"content":"public-messages","dynamic":false,"spread":false}]],"params":["userId"],"component":"src/pages/users/[userId]/public-messages.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BxVPUcVC.js"}],"styles":[{"type":"external","src":"/_astro/index.D7lD85h2.css"},{"type":"external","src":"/_astro/index.BtfL2ybY.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/ferdi/Projects/Astro-Clerk-Convex-Starter/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/home/ferdi/Projects/Astro-Clerk-Convex-Starter/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/home/ferdi/Projects/Astro-Clerk-Convex-Starter/src/pages/users/[userId]/public-messages.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/api/set-role@_@ts":"pages/api/set-role.astro.mjs","\u0000@astro-page:src/pages/users/[userId]/public-messages@_@astro":"pages/users/_userid_/public-messages.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DwHU4vjn.mjs","/home/ferdi/Projects/Astro-Clerk-Convex-Starter/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BFSAcLvQ.mjs","astro:scripts/before-hydration.js":"_astro/astro_scripts/before-hydration.js.BBgqUPb3.js","@/components/UserPublicMessages.tsx":"_astro/UserPublicMessages.oB7-nUYu.js","/home/ferdi/Projects/Astro-Clerk-Convex-Starter/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.DyiBScex.js","astro:scripts/page.js":"_astro/page.BxVPUcVC.js","@/components/Navbar":"_astro/Navbar.BfhWz0-D.js","@/components/ui/sonner":"_astro/sonner.BTIjQKf2.js","@astrojs/react/client.js":"_astro/client.PWbBjEwf.js","@/components/LayoutClient":"_astro/LayoutClient.DSQLKq72.js"},"inlinedScripts":[],"assets":["/_astro/index.D7lD85h2.css","/favicon.svg","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.DyiBScex.js","/_astro/LayoutClient.DSQLKq72.js","/_astro/Navbar.BfhWz0-D.js","/_astro/UserPublicMessages.oB7-nUYu.js","/_astro/chunk-5RWUYJKV.DT1PUBwP.js","/_astro/client.C6KTHUnA.js","/_astro/client.PWbBjEwf.js","/_astro/createLucideIcon.DJhnDDIa.js","/_astro/highLightText.wLjQsNB6.js","/_astro/index.BtfL2ybY.css","/_astro/index.Buf-CL2u.js","/_astro/index.CXYkOuos.js","/_astro/index.DeO6U63H.js","/_astro/index.DrlE4MoQ.js","/_astro/loadClerkJsScript-Dz_r2Obb.DorIIEnD.js","/_astro/page.BxVPUcVC.js","/_astro/sonner.BTIjQKf2.js","/_astro/withConvexClerkProvider.Bgm_kGJw.js","/_astro/astro_scripts/before-hydration.js.BBgqUPb3.js","/_astro/page.BxVPUcVC.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"hruki2dfJ004xGYBPNlnLClLVzK4fqb4v7dPfRSJGhU="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;
export {
  manifest
};
