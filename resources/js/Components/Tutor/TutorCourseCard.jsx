import React from "react";
import { Link, router } from "@inertiajs/react";
import StarIcon from "../Course/StarIcon";

export default function TutorCourseCard({ course }) {
    const authorName = `${course.user.first_name} ${course.user.last_name}`;
    const averageRating = course.reviews_avg_rating
        ? parseFloat(course.reviews_avg_rating).toFixed(1)
        : "-";

    const handleDelete = () => {
        if (
            confirm("Are you sure you want to permanently delete this course?")
        ) {
            router.delete(route("tutor.courses.destroy", course.id));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 h-full flex flex-col">
            <img
                src={course.thumbnail_image_url}
                alt={course.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col sm:flex-row items-start sm:justify-between">
                <div className="flex-1 pr-0 sm:pr-4">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{authorName}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                        Rp {Number(course.price).toLocaleString("id-ID")}
                    </p>
                </div>

                <div className="flex flex-col items-end space-y-2 flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="flex items-center space-x-1">
                        <StarIcon className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-semibold">
                            {averageRating}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 w-full pt-2">
                        <Link
                            href={route("tutor.courses.edit", course.id)}
                            className="flex-1 text-center px-4 py-1 text-sm bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="flex-1 text-center px-4 py-1 text-sm bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
