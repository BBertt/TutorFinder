import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import VoteButtons from "./VoteButtons";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

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

export default function ForumPostCard({ post, showDeleteButton = false }) {
    const authorName = `${post.user.first_name} ${post.user.last_name}`;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const performDelete = () => {
        router.delete(route("forums.destroy", post.id), {
            preserveScroll: true,
            onFinish: () => setIsDeleteModalOpen(false),
        });
    };

    return (
        <>
            <div className="block bg-white p-6 rounded-lg border border-gray-200 transition-shadow dark:bg-darkSecondary dark:border-dark hover:shadow-lg dark:hover:bg-gray-700">
                <div className="flex items-start space-x-4">
                    <img
                        className={`w-12 h-12 rounded-full ${
                            !post.user.profile_image_path && "dark:invert"
                        }`}
                        src={
                            post.user.profile_image_path
                                ? post.user.profile_image_path
                                : "/assets/icons/profile.svg"
                        }
                        alt={authorName}
                    />
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg dark:text-white">
                                <Link
                                    href={route("forums.show", post.id)}
                                    className="hover:underline"
                                >
                                    {post.title}
                                </Link>
                            </h3>
                            {showDeleteButton && (
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="text-sm font-semibold text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                >
                                    Delete
                                </button>
                            )}
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            By {authorName}
                        </p>
                        <p className="mt-2 text-gray-700 line-clamp-2 dark:text-gray-300">
                            {post.description}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                            <VoteButtons item={post} type="forum" />
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <Link
                                    href={route("forums.show", post.id)}
                                    className="hover:underline"
                                >
                                    {post.replies.length} Replies
                                </Link>
                                <span>{postTime(post.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={performDelete}
                title="Delete Forum Post"
                message="Are you sure you want to delete this forum post? All of its replies will also be deleted."
                confirmText="Yes, Delete"
                cancelText="Cancel"
                confirmColor="bg-red-600"
            />
        </>
    );
}
