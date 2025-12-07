import React from "react";
import StarIcon from "@/Components/Course/StarIcon";

export default function ReviewCard({ review }) {
    const reviewer = review.reviewer || review.user;
    const reviewerName = `${reviewer.first_name} ${reviewer.last_name}`;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-darkSecondary dark:border-dark">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        className="w-12 h-12 rounded-full"
                        src={
                            reviewer.profile_image_path
                                ? `/${reviewer.profile_image_path}`
                                : "/assets/icons/profile.svg"
                        }
                        alt={reviewerName}
                    />
                    <div>
                        <h4 className="font-bold text-lg dark:text-white">
                            {reviewerName}
                        </h4>
                    </div>
                </div>
                <div className="flex items-center space-x-1 text-yellow-400">
                    <StarIcon className="w-5 h-5" />
                    <span className="font-semibold dark:text-white">
                        {parseFloat(review.rating).toFixed(1)}
                    </span>
                </div>
            </div>
            <p className="mt-4 dark:text-white">{review.comment}</p>
        </div>
    );
}
