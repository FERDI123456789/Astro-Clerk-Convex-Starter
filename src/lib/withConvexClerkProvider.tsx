import type { FunctionComponent, JSX } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/astro/react";

if (!import.meta.env.PUBLIC_CONVEX_URL) {
  throw new Error("Missing PUBLIC_CONVEX_URL in your .env.local file");
}

const convex = new ConvexReactClient(import.meta.env.PUBLIC_CONVEX_URL);

export function withConvexClerkProvider<Props>(
  Component: FunctionComponent<Props>,
) {
  function WithConvexClerkProvider(props: Props & JSX.IntrinsicAttributes) {
    return (
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Component {...props} />
      </ConvexProviderWithClerk>
    );
  }
  return WithConvexClerkProvider;
}
