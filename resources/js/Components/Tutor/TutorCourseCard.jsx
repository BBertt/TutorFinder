import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import StarIcon from "../Course/StarIcon";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

export default function TutorCourseCard({ course }) {
    const authorName = `${course.user.first_name} ${course.user.last_name}`;
    const averageRating = course.reviews_avg_rating
        ? parseFloat(course.reviews_avg_rating).toFixed(1)
        : "-";

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const performDelete = () => {
        router.delete(route("tutor.courses.destroy", course.id), {
            onFinish: () => setIsDeleteModalOpen(false),
        });
    };
    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 h-full flex flex-col dark:bg-darkSecondary dark:border-dark">
                <img
                    src={course.thumbnail_image_url}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col sm:flex-row items-start sm:justify-between">
                    <div className="flex-1 pr-0 sm:pr-4">
                        <h3 className="text-lg font-semibold text-black line-clamp-2 dark:text-white">
                            {course.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                            {authorName}
                        </p>
                        <p className="text-lg font-bold mt-2 dark:text-white">
                            Rp {Number(course.price).toLocaleString("id-ID")}
                        </p>
                    </div>

                    <div className="flex flex-col items-end space-y-2 flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                        <div className="flex items-center space-x-1">
                            <StarIcon className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm font-semibold dark:text-white">
                                {averageRating}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 w-full pt-2">
                            <Link
                                href={route("tutor.courses.edit", course.id)}
                                className="flex-1 text-center px-4 py-1 text-sm bg-gray-200 text-black dark:text-white font-semibold rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="flex-1 text-center px-4 py-1 text-sm bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 dark:hover:bg-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={performDelete}
                title="Confirm Deletion"
                message="Are you sure you want to permanently delete this course? This action cannot be undone."
                confirmText="Yes, Delete"
                cancelText="No"
                confirmColor="bg-red-600"
            />
        </>
    );
}
