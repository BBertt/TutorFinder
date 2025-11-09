import React, { useState } from "react";
import VoteButtons from "./VoteButtons";
import ReplyForm from "./ReplyForm";

const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

export default function ReplyCard({
    reply,
    type = "reply",
    forumId,
    children,
}) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showNestedReplies, setShowNestedReplies] = useState(false);

    const hasChildren = reply.children && reply.children.length > 0;
    const childrenCount = hasChildren ? reply.children.length : 0;

    const authorName = `${reply.user.first_name} ${reply.user.last_name}`;

    return (
        <div className="flex items-start space-x-4">
            <img
                className={"w-12 h-12 rounded-full"}
                src={
                    reply.user.profile_image_url
                        ? reply.user.profile_image_url
                        : "/assets/icons/profile.svg"
                }
                alt={authorName}
            />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-bold dark:text-gray-200">{authorName}</p>
                    <span className="text-xs text-gray-400">
                        {timeAgo(reply.created_at)}
                    </span>
                </div>

                {type === "forum" && (
                    <h1 className="text-3xl font-bold mt-1 mb-2 dark:text-white">
                        {reply.title}
                    </h1>
                )}

                <p className="mt-1 dark:text-white">{reply.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                    <VoteButtons item={reply} type={type} />
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="text-sm font-semibold text-gray-400 hover:underline dark:hover:text-white"
                    >
                        Reply
                    </button>

                    {hasChildren && (
                        <button
                            onClick={() =>
                                setShowNestedReplies(!showNestedReplies)
                            }
                            className="text-sm font-semibold text-primary hover:underline flex items-center space-x-1"
                        >
                            <img
                                src="/assets/icons/arrow-down-primary.svg"
                                alt="toggle replies"
                                className={`w-4 h-4 transition-transform ${
                                    showNestedReplies ? "rotate-180" : ""
                                }`}
                            />
                            <span>
                                {showNestedReplies
                                    ? "Hide Replies"
                                    : `View ${childrenCount} ${
                                          childrenCount > 1
                                              ? "Replies"
                                              : "Reply"
                                      }`}
                            </span>
                        </button>
                    )}
                </div>

                {showReplyForm && (
                    <ReplyForm
                        forumId={forumId}
                        parentId={reply.id}
                        onSuccess={() => setShowReplyForm(false)}
                    />
                )}

                {hasChildren && showNestedReplies && children}
            </div>
        </div>
    );
}
