import type { FunctionComponent, JSX } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/astro/react";

const CONVEX_URL =
  import.meta.env.PUBLIC_CONVEX_URL || process.env.PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error(
    "Missing PUBLIC_CONVEX_URL. Please set it in your environment variables.",
  );
}

const convex = new ConvexReactClient(CONVEX_URL);

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
