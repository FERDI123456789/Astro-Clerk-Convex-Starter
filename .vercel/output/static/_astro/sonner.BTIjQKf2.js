import{c,j as o}from"./createLucideIcon.DJhnDDIa.js";import{r as m}from"./index.DeO6U63H.js";import{T as N}from"./index.CXYkOuos.js";import"./index.DrlE4MoQ.js";var z=(t,a,p,n,i,s,u,h)=>{let r=document.documentElement,g=["light","dark"];function l(e){(Array.isArray(t)?t:[t]).forEach(d=>{let y=d==="class",b=y&&s?i.map(k=>s[k]||k):i;y?(r.classList.remove(...b),r.classList.add(s&&s[e]?s[e]:e)):r.setAttribute(d,e)}),x(e)}function x(e){h&&g.includes(e)&&(r.style.colorScheme=e)}function f(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(n)l(n);else try{let e=localStorage.getItem(a)||p,d=u&&e==="system"?f():e;l(d)}catch{}},_=m.createContext(void 0),v={setTheme:t=>{},themes:[]},w=()=>{var t;return(t=m.useContext(_))!=null?t:v};m.memo(({forcedTheme:t,storageKey:a,attribute:p,enableSystem:n,enableColorScheme:i,defaultTheme:s,value:u,themes:h,nonce:r,scriptProps:g})=>{let l=JSON.stringify([p,a,s,t,h,u,n,i]).slice(1,-1);return m.createElement("script",{...g,suppressHydrationWarning:!0,nonce:typeof window>"u"?r:"",dangerouslySetInnerHTML:{__html:`(${z.toString()})(${l})`}})});/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],M=c("circle-check",j);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],S=c("info",A);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],$=c("loader-circle",T);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",key:"2d38gg"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],E=c("octagon-x",C);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],I=c("triangle-alert",L),R=({...t})=>{const{theme:a="system"}=w();return o.jsx(N,{theme:a,icons:{success:o.jsx(M,{className:"size-4"}),info:o.jsx(S,{className:"size-4"}),warning:o.jsx(I,{className:"size-4"}),error:o.jsx(E,{className:"size-4"}),loading:o.jsx($,{className:"size-4 animate-spin"})},className:"items-end",position:"bottom-right",toastOptions:{unstyled:!0,classNames:{title:"text-sm",toast:"text-sm toast-item flex items-center gap-2 py-3 px-4 backdrop-blur-sm text-dark shadow-lg rounded-lg overflow-hidden",description:"text-xs",actionButton:"",cancelButton:"",error:"bg-danger/90 backdrop-blur-sm",success:"bg-success/90 backdrop-blur-sm",warning:"bg-red-500 ring-2 ring-red-400 backdrop-blur-sm text-white",info:"bg-info/90 backdrop-blur-sm"}},...t})};export{R as Toaster};
