import React from "react";
import { Link, router } from "@inertiajs/react";

export default function TutorCourseCard({ course }) {
    const handleDelete = () => {
        if (
            confirm(
                "Are you sure you want to permanently delete this course? This action cannot be undone."
            )
        ) {
            router.delete(route("tutor.courses.destroy", course.id));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col border border-gray-200">
            <img
                src={course.thumbnail_image_url}
                alt={course.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold truncate">
                    {course.title}
                </h3>
                <p
                    className={`mt-1 text-sm font-bold ${
                        course.status === "published"
                            ? "text-green-600"
                            : "text-yellow-600"
                    }`}
                >
                    {course.status.charAt(0).toUpperCase() +
                        course.status.slice(1)}
                </p>
                <div className="mt-auto pt-4 flex items-center space-x-2">
                    <Link
                        href={route("tutor.courses.edit", course.id)}
                        className="flex-1 text-center bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="flex-1 text-center bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
