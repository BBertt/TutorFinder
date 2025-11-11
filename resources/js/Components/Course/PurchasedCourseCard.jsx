import React from "react";
import { Link, router } from "@inertiajs/react";
import StarIcon from "@/Components/Course/StarIcon";

export default function PurchasedCourseCard({ enrollment }) {
    const course = enrollment.course;
    const authorName = `${course.user.first_name} ${course.user.last_name}`;
    const averageRating = course.reviews_avg_rating
        ? parseFloat(course.reviews_avg_rating).toFixed(1)
        : "-";

    const handleTutorClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.visit(route("tutors.show", course.user.id));
    };

    return (
        <>
            <Link
                href={route("courses.show", course.id)}
                className="block group"
            >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col dark:bg-darkSecondary dark:border-dark">
                    <img
                        src={course.thumbnail_image_url}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://placehold.co/600x400/99D37C/4F6D40?text=Image+Missing";
                        }}
                    />
                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold truncate group-hover:text-primary dark:text-white">
                            {course.title}
                        </h3>
                        <p className="text-sm mt-1 text-gray-400">
                            <span
                                onClick={handleTutorClick}
                                className="hover:underline cursor-pointer"
                            >
                                {authorName}
                            </span>
                        </p>
                        <div className="flex items-center justify-between mt-3 ">
                            <span className="text-lg font-bold dark:text-white">
                                Rp{" "}
                                {Number(course.price).toLocaleString("id-ID")}
                            </span>
                            <div className="flex items-center space-x-1">
                                <StarIcon className="w-5 h-5 text-yellow-400" />
                                <span className="text-sm font-semibold">
                                    {averageRating}
                                </span>
                            </div>
                        </div>
                        <Link
                            href={route("courses.learn", course.id)}
                            className="px-6 py-1 text-sm bg-primary text-white font-semibold rounded-md hover:bg-opacity-90 w-1/5 mt-2 text-center"
                        >
                            Learn
                        </Link>
                    </div>
                </div>
            </Link>
        </>
    );
}
