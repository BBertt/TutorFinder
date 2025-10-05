import React from "react";
import { Link } from "@inertiajs/react";

export default function ForumPostCard({ post }) {
    const authorName = `${post.user.first_name} ${post.user.last_name}`;
    return (
        <Link
            href={route("forums.show", post.id)}
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start space-x-4">
                <img
                    className="w-12 h-12 rounded-full"
                    src={
                        post.user.profile_image_path
                            ? `/${post.user.profile_image_path}`
                            : `https://ui-avatars.com/api/?name=${authorName}&background=random`
                    }
                    alt={authorName}
                />
                <div>
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-600">By {authorName}</p>
                    <p className="mt-2 text-gray-700 line-clamp-2">
                        {post.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                        <span>{post.likes} Likes</span>
                        <span>{post.replies.length} Replies</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
