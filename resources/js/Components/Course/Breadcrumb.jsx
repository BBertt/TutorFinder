import React from "react";
import { Link } from "@inertiajs/react";

const Breadcrumb = ({ category, course }) => {
    return (
        <nav
            className="flex px-5 py-3 text-white rounded-sm bg-secondary"
            aria-label="Breadcrumb"
        >
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                    <Link
                        href="/courses"
                        className="ms-1 text-sm font-medium text-gray-700 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                    >
                        Courses
                    </Link>
                </li>

                {category && (
                    <li>
                        <div className="flex items-center">
                            <svg
                                className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 9 4-4-4-4"
                                />
                            </svg>
                            <Link
                                href={`/courses?category=${category.id}`}
                                className={`ms-1 text-sm font-medium md:ms-2 ${
                                    course
                                        ? "text-gray-700 dark:text-gray-400 dark:hover:text-white"
                                        : "text-white"
                                }`}
                            >
                                {category.name}
                            </Link>
                        </div>
                    </li>
                )}

                {course && (
                    <li>
                        <div className="flex items-center">
                            <svg
                                className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-300"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 9 4-4-4-4"
                                />
                            </svg>
                            <span className="ms-1 text-sm font-medium text-white md:ms-2">
                                {course.title}
                            </span>
                        </div>
                    </li>
                )}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
