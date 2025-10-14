import React from "react";
import { Link } from "@inertiajs/react";

const StarIcon = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export default function PurchasedCourseCard({ enrollment }) {
    const course = enrollment.course;
    const authorName = `${course.user.first_name} ${course.user.last_name}`;
    const averageRating = course.reviews_avg_rating
        ? parseFloat(course.reviews_avg_rating).toFixed(1)
        : "-";

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 h-full flex flex-col">
            <div className="p-4 bg-gray-100 flex justify-center items-center h-48">
                <img
                    src={course.thumbnail_image_url}
                    alt={course.title}
                    className="max-w-full max-h-full object-contain"
                />
            </div>

            <div className="p-4 flex-1 flex">
                <div className="flex-1 pr-4">
                    <h3 className="text-lg font-semibold truncate text-gray-800">
                        {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{authorName}</p>
                </div>

                <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <div className="flex items-center space-x-1">
                        <StarIcon className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-semibold">
                            {averageRating}
                        </span>
                    </div>
                    <Link
                        href={route("courses.show", course.id)}
                        className="px-6 py-1 text-sm bg-primary text-white font-semibold rounded-md hover:bg-opacity-90"
                    >
                        Learn
                    </Link>
                </div>
            </div>
        </div>
    );
}
