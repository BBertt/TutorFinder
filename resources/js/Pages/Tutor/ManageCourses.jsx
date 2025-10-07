import React from "react";
import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";
import TutorCourseCard from "@/Components/Tutor/TutorCourseCard";

export default function ManageCourses({ courses }) {
    return (
        <>
            <Head title="Your Courses" />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section className="bg-primary text-white rounded-lg p-8 text-center mb-12">
                    <h1 className="text-4xl font-bold">Your Courses</h1>
                </section>

                <div className="flex justify-end items-center mb-6">
                    <Link
                        href={route("tutor.courses.create")}
                        className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        Create New Course
                    </Link>
                </div>

                {courses.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.data.map((course) => (
                            <TutorCourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 bg-white p-12 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold">No courses yet!</h2>
                        <p className="mt-2">
                            Click "Create New Course" to get started.
                        </p>
                    </div>
                )}
            </main>
        </>
    );
}

ManageCourses.layout = (page) => <Layout children={page} />;
