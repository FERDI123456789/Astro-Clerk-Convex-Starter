import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import Home from "./Home"; // Adjust paths as needed
import PrivateMessages from "./PrivateMessages";
import { viewMode } from "../stores/viewStore";

const MessageViewer: React.FC = () => {
  const currentMode = useStore(viewMode);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Threshold for mobile (e.g., < md breakpoint)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    // On mobile: Show only one based on viewMode
    return currentMode === "public" ? <Home /> : <PrivateMessages />;
  }

  // On desktop: Show both side-by-side
  return (
    <div className="flex-1 grid grid-cols-2 overflow-hidden">
      <Home />
      <PrivateMessages />
    </div>
  );
};

export default MessageViewer;
