import React, { useState } from "react";
import {
  SignInButton,
  UserButton,
  SignedIn,
  ClerkLoading,
  SignedOut,
  SignUpButton,
} from "@clerk/astro/react";
import { Pin, Trash, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { withConvexClerkProvider } from "../lib/withConvexClerkProvider";
import { useConvexAuth } from "convex/react"; // Add this
import { User } from "lucide-react";
import "@/styles/global.css";
import { AnimatePresence, motion } from "framer-motion";
import { highlightText } from "@/helpers/highLightText";
import { useCallback } from "react"; // Add useCallback for getText memoization

function SkeletonMessage() {
  return (
    <article className="p-2">
      <div className="p-4 animate-pulse flex gap-4 shadow-sm rounded-xl">
        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-baseline">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3.5 w-8 bg-gray-200 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-11/12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function PrivateMessagesSignedIn() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  // Always call useQuery, but skip if not ready
  const privateMessages = useQuery(
    api.messages.listPrivateMessages,
    isLoading || !isAuthenticated ? "skip" : undefined,
  );
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const togglePin = useMutation(api.messages.togglePin);

  const [search, setSearch] = useState("");
  const [showOnlyPinned, setShowOnlyPinned] = useState(false);
  // Note: Don't initialize with privateMessages here—it may be undefined initially.
  // Use an effect if you need to sync it, but your current usage seems fine without this state.
  const [filteredMessages, setFilteredMessages] = useState([]);

  const messagesToRender = privateMessages || [];

  const isMessageVisible = (msg: any) => {
    if (
      search.trim() &&
      !msg.text.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    if (showOnlyPinned && !msg.pinned) return false;

    return true;
  };

  const visibleMessages = (privateMessages || []).filter(isMessageVisible);

  // Memoize getText to prevent new reference on each render
  const getText = useCallback((message: any) => message.text, []);

  return (
    <main className="w-full mx-auto bg-white h-full flex flex-col overflow-hidden">
      <div className="flex w-full items-center justify-center px-2 pb-2">
        <SearchInput
          search={search}
          setSearch={setSearch}
          placeholder="Search for a message…"
        />
        <button
          onClick={() => {
            setShowOnlyPinned(!showOnlyPinned);
          }}
          className={`p-3 rounded-full ${showOnlyPinned ? "bg-blue-500 text-white" : "shadow-sm hover:bg-blue-100 hover:text-blue-700"} cursor-pointer transition-all duration-300`}
        >
          <Pin />
        </button>
      </div>
      {privateMessages === undefined ? (
        Array.from({ length: 8 }).map((_, i) => <SkeletonMessage key={i} />)
      ) : privateMessages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-md">
            <p className="text-2xl font-medium text-gray-800 mb-3">
              Nothing here yet
            </p>
            <p className="text-gray-600">Post your first private message!</p>
          </div>
        </div>
      ) : visibleMessages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-md">
            <p className="text-2xl font-medium text-gray-800 mb-3">
              No messages found
            </p>
            <p className="text-gray-600">
              Try changing your search or filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
          <motion.div layout="position">
            {visibleMessages.map((message) => (
              <motion.article
                key={message._id}
                layout
                initial={false}
                animate={{
                  opacity: isMessageVisible(message) ? 1 : 0,
                  height: isMessageVisible(message) ? "auto" : 0,
                }}
                transition={{ duration: 0.15 }}
                style={{ overflow: "hidden" }}
              >
                {/* padding goes INSIDE */}
                <div className="p-2">
                  <div className="flex gap-4 p-4 rounded-xl shadow-sm bg-white">
                    <div className="flex-1 min-w-0">
                      {/* Meta line */}
                      <div className="flex flex-wrap justify-between items-baseline">
                        <div className="flex gap-x-3 gap-y-1 items-center">
                          <span className="font-medium text-gray-900">You</span>
                          <span className="text-sm text-gray-500">
                            {new Date(message.creationTime).toLocaleDateString(
                              [],
                              {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex justify-center items-center space-x-2">
                          <span
                            onClick={() =>
                              togglePin({ messageId: message._id })
                            }
                            className={`group inline-flex items-center rounded-full cursor-pointer px-2 py-0.5 text-xs font-medium ${message.pinned ? "bg-blue-500 text-white" : "bg-blue-100 hover:bg-blue-300 text-blue-700"} transition-all duration-300`}
                          >
                            <Pin
                              className={`size-4 ${message.pinned ? "rotate-0" : "-rotate-32 group-hover:rotate-0"} transition-all duration-300`}
                            />
                          </span>
                          <span
                            onClick={() =>
                              deleteMessage({ messageId: message._id })
                            }
                            className="inline-flex items-center rounded-full cursor-pointer bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 hover:bg-red-300 transition-all duration-300"
                          >
                            <Trash2 className="size-4" />
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-gray-800 leading-relaxed wrap-break-word whitespace-pre-wrap">
                        {highlightText(message.text, search)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      )}
    </main>
  );
}

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import SearchInput from "./SearchInput";

function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No Private Messages Yet</EmptyTitle>
        <EmptyDescription>
          Sign In or Sign Up to see or create your private messages
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function PrivateMessagesComponent() {
  return (
    <main className="w-full mx-auto bg-white h-full flex flex-col overflow-hidden">
      <div className="w-full p-2 font-bold text-center">
        Your Private Messages
      </div>
      <SignedIn>
        <PrivateMessagesSignedIn />
      </SignedIn>
      <SignedOut>
        <EmptyDemo />
      </SignedOut>
    </main>
  );
}

const PrivateMessages = withConvexClerkProvider(PrivateMessagesComponent);
export default PrivateMessages;
