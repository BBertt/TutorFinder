import React, { useState } from "react";
import Layout from "@/Layouts/Layout";
import { Head, usePage } from "@inertiajs/react";
import CourseCard from "@/Components/Course/CourseCard";
import Breadcrumb from "@/Components/Course/Breadcrumb";
import LoginModal from "@/Components/LoginModal";
import Pagination from "@/Components/Pagination";

function CourseList({ courses }) {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search");
    const categoryParam = params.get("category");
    const { categories, auth } = usePage().props;
    const category = categories.find((c) => c.id == categoryParam);

    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    const handleGuestClick = (e) => {
        if (!auth.user) {
            e.preventDefault();
            e.stopPropagation();
            setLoginModalOpen(true);
        }
    };

    return (
        <>
            <Head title="Our Courses" />

            {categoryParam && <Breadcrumb category={category} />}

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-2xl font-extrabold mb-6">
                    {searchParam ? (
                        <>
                            Showing results for{" "}
                            <span className="text-primary">
                                "{searchParam}"
                            </span>
                        </>
                    ) : categoryParam ? (
                        <>
                            Explore courses in{" "}
                            <span className="text-primary capitalize">
                                {category.name}
                            </span>
                        </>
                    ) : (
                        "Explore All Courses"
                    )}
                </h1>

                {courses.data.length === 0 && (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-extrabold text-gray-600 dark:text-gray-400 mb-4">
                            {searchParam || categoryParam
                                ? "No results found."
                                : "No courses available right now..."}
                        </h2>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.data.map((course) => (
                        <div key={course.id} onClickCapture={handleGuestClick}>
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>

                {courses.data.length > 0 && (
                    <Pagination links={courses.links} />
                )}
            </main>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            />
        </>
    );
}

CourseList.layout = (page) => <Layout children={page} />;
export default CourseList;
