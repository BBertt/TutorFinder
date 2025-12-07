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

            {/* TODO : Show category name dynamically by filter */}

            {/* <div className="bg-primary text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold">Web Development</h1>
                </div>
            </div> */}
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
                    ) : null}
                </h1>
                {(searchParam || categoryParam) &&
                    courses.data.length === 0 && (
                        <h2 className="text-xl font-extrabold mb-12">
                            No results found.
                        </h2>
                    )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.data.map((course) => (
                        <div key={course.id} onClickCapture={handleGuestClick}>
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>

                <Pagination links={courses.links} />
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
