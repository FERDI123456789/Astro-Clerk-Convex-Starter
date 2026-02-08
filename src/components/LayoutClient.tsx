// components/LayoutClient.tsx
import React from "react";
import { useStore } from "@nanostores/react";
import { viewMode } from "@/stores/viewStore";
import { HomeComponent } from "@/components/Home"; // Unwrapped
import { PrivateMessagesComponent } from "@/components/PrivateMessages"; // Unwrapped
import { MessageInput } from "@/components/MessageInput"; // Unwrapped

// Providers
import { ClerkProvider } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/clerk-react";

const LayoutClient: React.FC = () => {
  const mode = useStore(viewMode);
  const [isMobile, setIsMobile] = React.useState(true); // Default to true for SSR/mobile-first

  // Create Convex client once (memoized to avoid recreation on re-renders)
  const convex = React.useMemo(
    () => new ConvexReactClient(import.meta.env.PUBLIC_CONVEX_URL),
    [],
  );

  React.useEffect(() => {
    // Use matchMedia for accurate breakpoint detection (matches Tailwind's md: 768px)
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ClerkProvider
      publishableKey={import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <div className="flex flex-col h-full overflow-hidden">
          <MessageInput />
          <div className="flex-1 overflow-hidden">
            {isMobile ? (
              mode === "public" ? (
                <HomeComponent />
              ) : (
                <PrivateMessagesComponent />
              )
            ) : (
              <div className="grid grid-cols-2 h-full overflow-hidden">
                <HomeComponent />
                <PrivateMessagesComponent />
              </div>
            )}
          </div>
        </div>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default LayoutClient;
