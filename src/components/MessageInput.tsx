import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Globe, Lock, Rocket, WholeWord } from "lucide-react";
import { viewMode } from "@/stores/viewStore";
import { withConvexClerkProvider } from "@/lib/withConvexClerkProvider";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/astro/react";
import { useAuth } from "@clerk/astro/react";
import { toast } from "sonner"; // Import toast for warnings

export const MessageInput: React.FC = () => {
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState<"public" | "private">(
    "public",
  );

  const { userId } = useAuth();

  const createMessage = useMutation(api.messages.createMessage);

  // Define a list of bad words (expand as needed; case-insensitive check)
  const badWords = [
    "bitch",
    "asshole",
    "nigger",
    "nigga",
    "n!gger",
    "n!gga",
    "n1gger",
    "n1gga",
    "nigg3r",
    "nigg@",
    "fuck",
    "fucker",
    "fuk",
    "f*ck",
    "shit",
    "sh1t",
    "sh!t",
    "cunt",
    "dick",
    "pussy",
    "cock",
    "bastard",
    "whore",
    "slut",
    "damn",
    "piss",
    "twat",
    "wanker",
    "bollocks",
    "arse",
    "prick",
    // Add more as needed; this list can be expanded without performance issues
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    // Check for bad words (case-insensitive)
    const lowerText = messageText.toLowerCase();
    const hasBadWord = badWords.some((word) => lowerText.includes(word));

    if (hasBadWord) {
      toast.warning("Message contains inappropriate language.");
      return;
    }

    await createMessage({
      text: messageText,
      type: messageType,
      downVotes: 0,
      upVotes: 0,
      pinned: false,
    });

    // Clear the input after successful send
    setMessageText("");
  };

  const handleTypeChange = (newType: "public" | "private") => {
    setMessageType(newType);
    viewMode.set(newType); // Sync with display
    console.log(viewMode.value);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="px-3 sm:px-4 mb-0 sm:mb-3 mt-2 sm:mt-3"
      >
        <div className="flex flex-col gap-2 sm:gap-4">
          <textarea
            className="
  w-full border border-gray-300 rounded-xl
  text-base sm:text-lg
  placeholder-gray-500 resize-none
  h-28 sm:h-32
  p-3 sm:p-4
  focus:outline-none focus:ring-2 focus:ring-blue-500
  transition-shadow
"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Post a message..."
            autoComplete="off"
          />

          {/* Segmented control + Submit */}
          <div className="flex justify-center items-center w-full">
            {/* Fancy segmented toggle */}
            <div className="flex flex-col justify-center items-center sm:flex-row rounded-2xl sm:rounded-full gap-2 bg-gray-100 p-2 w-full sm:w-fit sm:max-w-none">
              <button
                type="button"
                onClick={() => handleTypeChange("public")}
                className={`
                  px-3 sm:px-12 py-4 text-xs w-full shadow-sm sm:text-sm rounded-full font-medium transition-all duration-200 flex justify-center items-center text-center space-x-1
                  ${
                    messageType === "public"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                <Globe className="inline-block size-4" />
                <div className="inline-block">Public</div>
              </button>
              <button
                type="submit"
                disabled={
                  !messageText.trim() || (!userId && messageType === "private")
                }
                className={`
                  group relative flex items-center justify-center gap-2
                  w-full sm:w-auto
                  px-4 sm:px-16 py-3.5
                  rounded-full font-semibold
                  text-base sm:text-base
                  text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  overflow-hidden
                  ${
                    !messageText.trim() ||
                    (!userId && messageType === "private")
                      ? "bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                  transition-all duration-300
                `}
              >
                <span className="whitespace-nowrap inline-block">
                  Post <Rocket className="inline-block size-4 mb-1 ml-1" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("private")}
                className={`
                  px-3 sm:px-12 py-4 w-full shadow-sm text-xs sm:text-sm rounded-full font-medium flex justify-center items-center text-center space-x-1
                  ${
                    messageType === "private"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }
                transition-all duration-200`}
              >
                <Lock className="inline-block size-4" />
                <div className="inline-block">Private</div>
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

const MessageInputOP = withConvexClerkProvider(MessageInput);
export default MessageInputOP;
