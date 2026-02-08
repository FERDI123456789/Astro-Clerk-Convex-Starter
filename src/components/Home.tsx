import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { withConvexClerkProvider } from "../lib/withConvexClerkProvider";
import { ThumbsDown, ThumbsUp, Trash2, User } from "lucide-react";
import "@/styles/global.css";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/astro/react";
import { toast } from "sonner";
import { useState } from "react";
import SearchInput from "@/components/SearchInput";
import { highlightText } from "@/helpers/highLightText";

import { viewMode } from "@/stores/viewStore";

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
            <div className="h-4 w-full bg-gray-200 rounded" />
          </div>
          <div className="flex flex-row gap-x-5">
            <div className="h-4 w-8 bg-gray-200 rounded" />
            <div className="h-4 w-8 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function HomeComponent() {
  const publicMessages = useQuery(api.messages.listPublicMessages);
  const loading = publicMessages === undefined;
  const upvote = useMutation(api.messages.toggleUpvote);
  const downvote = useMutation(api.messages.toggleDownvote);
  const deleteMessage = useMutation(api.messages.deleteMessage);

  const [search, setSearch] = useState("");
  const [showOnlyUpvoted, setShowOnlyUpvoted] = useState(false);
  const [showOnlyDownvoted, setShowOnlyDownvoted] = useState(false);

  const isMessageVisible = (msg: any) => {
    if (
      search.trim() &&
      !msg.text.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    if (showOnlyUpvoted && !msg.upVoted) return false;
    if (showOnlyDownvoted && !msg.downVoted) return false;

    return true;
  };

  const visibleMessages = (publicMessages || []).filter(isMessageVisible);

  const { isSignedIn } = useAuth(); // Check if user is signed in

  console.log(viewMode.value);

  return (
    <main className="w-full mx-auto bg-white h-full flex flex-col overflow-hidden relative">
      <div className="w-full p-2 font-bold text-center">
        All Public Messages
      </div>
      <div className="flex w-full items-center justify-center px-2 border-r border-gray-100 pb-2">
        <SearchInput
          search={search}
          setSearch={setSearch}
          placeholder="Search for a message…"
        />
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowOnlyUpvoted((prev) => !prev);
              setShowOnlyDownvoted(false);
            }}
            className={`p-3 rounded-md ${showOnlyUpvoted ? "bg-green-500 text-white" : "shadow-sm hover:bg-green-200 hover:text-green-700"} cursor-pointer transition-all duration-300`}
          >
            <ThumbsUp />
          </button>
          <button
            onClick={() => {
              setShowOnlyDownvoted((prev) => !prev);
              setShowOnlyUpvoted(false);
            }}
            className={`p-3 rounded-md ${showOnlyDownvoted ? "bg-red-500 text-white" : "shadow-sm hover:bg-red-200 hover:text-red-700"} cursor-pointer transition-all duration-300`}
          >
            <ThumbsDown />
          </button>
        </div>
      </div>
      {/* Main scrollable area */}
      <div className="flex-1 overflow-y-auto border-r border-gray-100 no-scrollbar pb-12">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonMessage key={i} />)
        ) : publicMessages?.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="max-w-md">
              <p className="text-2xl font-medium text-gray-800 mb-3">
                Nothing here yet
              </p>
              <p className="text-gray-600">
                Be the first one to post something.
              </p>
            </div>
          </div>
        ) : visibleMessages?.length === 0 ? (
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
                    {/* Avatar / placeholder */}
                    {message.userProfilePic ? (
                      <img
                        src={message.userProfilePic}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 ring-1 ring-gray-200">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {/* User Display */}
                      <div className="flex flex-wrap items-center justify-between gap-y-1 mb-1.5">
                        <div className="flex gap-x-2 justify-center items-center">
                          {message.userId ? (
                            <a
                              href={`/users/${message.userId}/public-messages?from=${message._id}`} // Add query param
                              className="font-medium text-gray-900 hover:text-indigo-700 transition-colors"
                            >
                              {message.userName || "Anonymous"}
                            </a>
                          ) : (
                            <span className="font-medium text-gray-900">
                              Anonymous
                            </span>
                          )}
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
                          {message.userRole === "admin" && (
                            <span className="inline-flex items-center rounded-full bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-700">
                              Admin
                            </span>
                          )}
                        </div>

                        {message.canDelete && (
                          <span
                            onClick={() =>
                              deleteMessage({ messageId: message._id })
                            }
                            className="inline-flex items-center rounded-full cursor-pointer bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 hover:bg-red-300 transition-all duration-300"
                          >
                            <Trash2 className="size-4" />
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <p className="text-gray-800 leading-relaxed wrap-break-word whitespace-pre-wrap">
                        {highlightText(message.text, search)}
                      </p>

                      {/* Voting */}
                      <div className="flex gap-6 mt-3 text-sm">
                        <button
                          onClick={() => {
                            if (!isSignedIn) {
                              toast.warning("Sign Up Or Sign In To Vote!");
                              return;
                            }
                            upvote({ messageId: message._id });
                          }}
                          className={`flex items-center cursor-pointer gap-1.5 transition-colors ${
                            message.upVoted
                              ? "text-green-600"
                              : "text-gray-500 hover:text-green-600"
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{message.upVotes ?? 0}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (!isSignedIn) {
                              toast.warning(`Sign Up Or Sign In To Vote!`, {});
                              return;
                            }
                            downvote({ messageId: message._id });
                          }}
                          className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                            message.downVoted
                              ? "text-red-600"
                              : "text-gray-500 hover:text-red-600"
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>{message.downVotes ?? 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}

const Home = withConvexClerkProvider(HomeComponent);
export default Home;
