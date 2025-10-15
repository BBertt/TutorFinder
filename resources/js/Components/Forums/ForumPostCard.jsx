import React from "react";
import { Link } from "@inertiajs/react";
import VoteButtons from "./VoteButtons";

const postTime = (dateString) => {
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

export default function ForumPostCard({ post }) {
    const authorName = `${post.user.first_name} ${post.user.last_name}`;
    return (
        <Link
            href={route("forums.show", post.id)}
            className="block bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start space-x-4">
                <img
                    className="w-12 h-12 rounded-full"
                    src={
                        post.user.profile_image_path
                            ? post.user.profile_image_path
                            : "/assets/icons/profile.svg"
                    }
                    alt={authorName}
                />
                <div className="flex-1">
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-600">By {authorName}</p>
                    <p className="mt-2 text-gray-700 line-clamp-2">
                        {post.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                        <VoteButtons item={post} type="forum" />
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{post.replies.length} Replies</span>
                            <span>{postTime(post.created_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
