import React from "react";
import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import PurchasedCourseCard from "@/Components/Course/PurchasedCourseCard";

export default function PurchasedCourse({ enrolledCourses }) {
    return (
        <>
            <Head title="My Courses" />

            <main className="min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold dark:text-white">
                            My Courses
                        </h1>
                    </div>

                    {enrolledCourses.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {enrolledCourses.data.map((enrollment) => (
                                <PurchasedCourseCard
                                    key={enrollment.id}
                                    enrollment={enrollment}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-12 rounded-lg shadow-sm border dark:bg-darkSecondary dark:border-dark">
                            <h2 className="text-2xl font-bold">
                                You haven't enrolled in any courses yet!
                            </h2>
                            <p className="mt-2">
                                Browse our courses to start learning.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

PurchasedCourse.layout = (page) => <Layout children={page} />;
