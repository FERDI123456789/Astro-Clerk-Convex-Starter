import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { withConvexClerkProvider } from "../lib/withConvexClerkProvider";
import {
  ThumbsDown,
  ThumbsUp,
  MessageSquare,
  User,
  Trash2,
  Pin,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@clerk/astro/react";
import SearchInput from "@/components/SearchInput"; // Adjust path as needed
import { highlightText } from "@/helpers/highLightText";

interface UserProfileComponentProps {
  userId: string;
  fromId?: string | null; // New optional prop from Astro
}

function SkeletonMessage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 py-5 animate-pulse flex gap-4 border-b border-gray-100/50"
    >
      <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-baseline">
          <div className="h-4 w-32 bg-gray-100 rounded" />
          <div className="h-3.5 w-20 bg-gray-100 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-11/12 bg-gray-100 rounded" />
          <div className="h-4 w-3/4 bg-gray-100 rounded" />
        </div>
      </div>
    </motion.div>
  );
}

function UserPublicMessagesComponent({ userId }: UserProfileComponentProps) {
  const publicMessages = useQuery(api.messages.listUserPublicMessages, {
    userId,
  });
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const togglePin = useMutation(api.messages.togglePin);

  const loading = publicMessages === undefined;

  const displayName = publicMessages?.[0]?.userName || "User";
  const avatarUrl = publicMessages?.[0]?.userProfilePic || null;

  const totalMessages = publicMessages?.length || 0;
  const totalUpvotes =
    publicMessages?.reduce((sum, m) => sum + (m.upVotes ?? 0), 0) || 0;
  const totalDownvotes =
    publicMessages?.reduce((sum, m) => sum + (m.downVotes ?? 0), 0) || 0;

  const totalVotes =
    publicMessages?.reduce(
      (sum, m) => sum + (m.downVotes ?? 0) + (m.upVotes ?? 0),
      0,
    ) || 0;

  const { isSignedIn } = useAuth(); // Check if user is signed in

  const upvote = useMutation(api.messages.toggleUpvote);
  const downvote = useMutation(api.messages.toggleDownvote);

  const [search, setSearch] = useState("");
  const [sortByUpvotes, setSortByUpvotes] = useState(false);
  const [showOnlyPinned, setShowOnlyPinned] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);

  // Update filteredMessages when publicMessages changes
  useEffect(() => {
    if (publicMessages) {
      setFilteredMessages(publicMessages);
    }
  }, [publicMessages]);

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

  // Compute displayed messages: apply sort if toggled
  let displayedMessages = filteredMessages;
  if (sortByUpvotes) {
    displayedMessages = [...filteredMessages].sort(
      (a, b) => (b.upVotes ?? 0) - (a.upVotes ?? 0),
    );
  }

  return (
    <div className="max-w-xl mx-auto w-full px-1 sm:px-0 h-full flex flex-col bg-white overflow-hidden">
      {/* Profile / Header */}
      <div className="bg-white ">
        {/* Header */}
        <div className="px-3 pt-4 pb-2 sm:px-5 sm:pt-6 flex flex-col items-center text-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center ring-4 ring-indigo-100">
              <User className="w-10 h-10 text-gray-500" />
            </div>
          )}

          <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>

          <p className="text-sm text-gray-500">Public Messages</p>
        </div>

        {/* Stats */}
        <div className="px-2 py-4 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            {/* Messages */}
            <div className="w-full bg-blue-50 p-3 flex flex-col items-center justify-center rounded-xl">
              <div className="gap-2 mb-1 flex flex-row justify-center items-center">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>

              <p className="text-xl font-bold text-blue-600">{totalMessages}</p>
            </div>
            {/* Up */}
            <div className="w-full bg-green-50 p-3 flex flex-col items-center justify-center rounded-xl">
              <div className="gap-2 mb-1 flex flex-row justify-center items-center">
                <ThumbsUp className="w-4 h-4 text-green-600" />
              </div>

              <p className="text-xl font-bold text-green-600">{totalUpvotes}</p>
            </div>
            {/* Down */}
            <div className="w-full bg-red-50 p-3 flex flex-col items-center justify-center rounded-xl">
              <div className="gap-2 mb-1 flex flex-row justify-center items-center">
                <ThumbsDown className="w-4 h-4 text-red-600" />
              </div>

              <p className="text-xl font-bold text-red-600">{totalDownvotes}</p>
            </div>
            {/* Votes */}
            <div className="w-full bg-gray-50 p-3 flex flex-col items-center justify-center rounded-xl">
              <div className="gap-1 mb-1 flex flex-row justify-center items-center">
                <ThumbsUp className="w-4 h-4 text-gray-600" />
                <ThumbsDown className="w-4 h-4 text-gray-600" />
              </div>

              <p className="text-xl font-bold text-gray-700">{totalVotes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="sticky top-0 z-10 px-2 pt-2 pb-1 flex flex-wrap items-center gap-2">
          <SearchInput
            search={search}
            setSearch={setSearch}
            placeholder="Search for a message…"
          />
          <div className="grid grid-cols-2 w-full justify-center items-center gap-2">
            <button
              onClick={() => {
                setSortByUpvotes((prev) => !prev);
                setShowOnlyPinned(false);
              }}
              className={`flex justify-center items-center p-3 rounded-md ${sortByUpvotes ? "bg-green-500 text-white" : "shadow-sm hover:bg-green-200 hover:text-green-700"} w-full cursor-pointer transition-all duration-300`}
            >
              <ThumbsUp className="w-5 h-5 mr-3" />{" "}
              <span className="hidden sm:flex">Sort by most liked</span>
            </button>
            <button
              onClick={() => {
                setShowOnlyPinned((prev) => !prev);
                setSortByUpvotes(false);
              }}
              className={`flex justify-center items-center p-3 rounded-md ${showOnlyPinned ? "bg-blue-500 text-white" : "shadow-sm hover:bg-blue-200 hover:text-blue-700"} w-full cursor-pointer transition-all duration-300`}
            >
              <Pin className="w-5 h-5 mr-3" />{" "}
              <span className="hidden sm:flex">Only pinned messages</span>
            </button>
          </div>
        </div>
        <div className="overflow-y-scroll no-scrollbar">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonMessage key={i} />)
          ) : publicMessages?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="max-w-md">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  No public messages yet
                </p>
                <p className="text-gray-500">
                  This user hasn't posted anything publicly.
                </p>
              </div>
            </div>
          ) : (
            <motion.div layout="position" className="flex-1">
              {displayedMessages.map((message) => (
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
                  <div className="p-2">
                    <div className="flex gap-3 p-3 sm:gap-4 sm:p-4 rounded-xl shadow-sm bg-white">
                      {/* Avatar / placeholder - Add unique viewTransitionName */}
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
                        <div className="flex flex-col sm:flex-row gap-1 mb-1.5">
                          <div className="flex gap-x-2 justify-between items-center">
                            <div className="space-x-2">
                              {message.userId ? (
                                <a
                                  href={`/users/${message.userId}/public-messages`}
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
                                {new Date(
                                  message.creationTime,
                                ).toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            {message.userRole === "admin" && (
                              <span className="inline-flex items-center rounded-full bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-700">
                                Admin
                              </span>
                            )}
                          </div>

                          <div className="flex justify-center items-center space-x-2">
                            {message.canDelete ? (
                              <>
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
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <p className="text-gray-800 leading-relaxed wrap-break-words break-all whitespace-pre-wrap">
                          {highlightText(message.text, search)}
                        </p>

                        {/* Voting */}
                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
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
                                toast.warning(
                                  `Sign Up Or Sign In To Vote!`,
                                  {},
                                );
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
      </div>
    </div>
  );
}

const UserPublicMessages = withConvexClerkProvider(UserPublicMessagesComponent);
export default UserPublicMessages;
