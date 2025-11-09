import React from "react";
import StarIcon from "@/Components/Course/StarIcon";

export default function TutorReviewCard({ review }) {
    const reviewerName = `${review.reviewer.first_name} ${review.reviewer.last_name}`;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:border dark:border-gray-700">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        className={`w-12 h-12 rounded-full ${
                            !review.reviewer.profile_image_path && "dark:invert"
                        }`}
                        src={
                            review.reviewer.profile_image_path
                                ? `/${review.reviewer.profile_image_path}`
                                : "/assets/icons/profile.svg"
                        }
                        alt={reviewerName}
                    />
                    <div>
                        <h4 className="font-bold text-lg dark:text-gray-200">
                            {reviewerName}
                        </h4>
                    </div>
                </div>
                <div className="flex items-center space-x-1 text-yellow-400">
                    <StarIcon className="w-5 h-5" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {parseFloat(review.rating).toFixed(1)}
                    </span>
                </div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
                {review.comment}
            </p>
        </div>
    );
}
