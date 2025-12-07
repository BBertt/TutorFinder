import React from "react";

const StarRating = ({ rating, onRatingChange }) => (
    <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-8 h-8 cursor-pointer ${
                    rating >= star ? "text-yellow-400" : "text-gray-400"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                onClick={() => onRatingChange(star)}
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
            </svg>
        ))}
    </div>
);

export default StarRating;
