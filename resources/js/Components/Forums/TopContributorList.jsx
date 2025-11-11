import React from "react";

export default function TopContributorList({ contributors }) {
    return (
        <div className="space-y-4">
            {contributors.map((contributor, index) => (
                <div
                    key={contributor.id}
                    className="flex items-center space-x-3"
                >
                    <span className="font-bold text-gray-500 dark:text-gray-400">
                        {index + 1}
                    </span>
                    <img
                        className="w-10 h-10 rounded-full"
                        src={
                            contributor.profile_image_path
                                ? contributor.profile_image_path
                                : "/assets/icons/profile.svg"
                        }
                        alt={`${contributor.first_name} ${contributor.last_name}`}
                    />
                    <div>
                        <p className="font-semibold dark:text-gray-200">{`${contributor.first_name} ${contributor.last_name}`}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {parseInt(contributor.total_likes).toLocaleString()}{" "}
                            Likes
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
