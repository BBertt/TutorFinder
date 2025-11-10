import React from "react";
import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";
import TutorCourseCard from "@/Components/Tutor/TutorCourseCard";
import Pagination from "@/Components/Pagination";

export default function ManageCourses({ courses, filters }) {
    const activeStatus = filters.status || "draft";

    return (
        <>
            <Head title="Your Courses" />

            <section className="bg-primary text-white w-full">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                    <h1 className="text-4xl font-bold">Your Courses</h1>
                </div>
            </section>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center mb-6">
                    <div className="flex space-x-2">
                        <Link
                            href={route("tutor.courses.index", {
                                status: "draft",
                            })}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                                activeStatus === "draft"
                                    ? "bg-primary font-bold text-white"
                                    : "text-gray-700 bg-white hover:bg-gray-200 dark:bg-darkSecondary dark:text-gray-400 dark:hover:bg-gray-700"
                            }`}
                            preserveState
                            preserveScroll
                        >
                            Draft
                        </Link>
                        <Link
                            href={route("tutor.courses.index", {
                                status: "published",
                            })}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                                activeStatus === "published"
                                    ? "bg-primary font-bold text-white"
                                    : "text-gray-700 bg-white hover:bg-gray-200 dark:bg-darkSecondary dark:text-gray-400 dark:hover:bg-gray-700"
                            }`}
                            preserveState
                            preserveScroll
                        >
                            Published
                        </Link>
                    </div>
                    <div className="ml-auto">
                        <Link
                            href={route("tutor.courses.create")}
                            className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors"
                        >
                            Create New Course
                        </Link>
                    </div>
                </div>

                {courses.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.data.map((course) => (
                            <TutorCourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 bg-white p-12 rounded-lg shadow-sm border dark:bg-darkSecondary dark:border-dark">
                        <h2 className="text-2xl font-bold text-black dark:text-white">
                            No courses found!
                        </h2>
                        <p className="mt-2">
                            There are no {activeStatus} courses.
                        </p>
                    </div>
                )}
                <div className="mt-8">
                    <Pagination links={courses.links} />
                </div>
            </main>
        </>
    );
}

ManageCourses.layout = (page) => <Layout children={page} />;
