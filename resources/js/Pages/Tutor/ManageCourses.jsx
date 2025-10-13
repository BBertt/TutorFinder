import React from "react";
import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";
import TutorCourseCard from "@/Components/Tutor/TutorCourseCard";

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
                                    ? "bg-gray-300 text-gray-800"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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
                                    ? "bg-gray-300 text-gray-800"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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
                            className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
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
                    <div className="text-center text-gray-500 bg-white p-12 rounded-lg shadow-sm border">
                        <h2 className="text-2xl font-bold">
                            No courses found!
                        </h2>
                        <p className="mt-2">
                            There are no {activeStatus} courses.
                        </p>
                    </div>
                )}
            </main>
        </>
    );
}

ManageCourses.layout = (page) => <Layout children={page} />;
