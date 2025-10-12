import React from "react";
import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import CourseCard from "@/Components/Course/CourseCard";

function CourseList({ courses }) {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search");
    const categoryParam = params.get("category");

    return (
        <>
            <Head title="Our Courses" />

            {/* TODO : Show category name dynamically by filter */}

            {/* <div className="bg-primary text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold">Web Development</h1>
                </div>
            </div> */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {(searchParam || categoryParam) &&
                    courses.data.length === 0 && (
                        <h2 className="text-xl font-extrabold mb-12">
                            No results found.
                        </h2>
                    )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.data.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </main>
        </>
    );
}

CourseList.layout = (page) => <Layout children={page} />;
export default CourseList;
