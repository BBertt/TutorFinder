import React from "react";
import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import CourseCard from "@/Components/Course/CourseCard";

function CourseList({ courses }) {
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
