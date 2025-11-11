import React from "react";
import Layout from "@/Layouts/Layout";
import { Head, router, Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Course/Breadcrumb";

function CourseDetails({ course, isEnrolled }) {
    const handleAddToCart = (e) => {
        e.preventDefault();
        router.post(
            route("cart.store"),
            { course_id: course.id },
            {
                onSuccess: () => alert("Course added to cart!"),
            }
        );
    };

    return (
        <>
            <Head title={course.title} />

            <div className="bg-primary text-white dark:bg-darkSecondary dark:border-dark">
                <Breadcrumb category={course.category} course={course} />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-xl font-semibold">
                            {course.category.name}
                        </p>
                        <h1 className="text-4xl lg:text-5xl font-bold mt-2">
                            {course.title}
                        </h1>
                        <p className="mt-4 text-lg opacity-80">
                            {course.description}
                        </p>
                        {!isEnrolled && (
                            <p className="text-3xl font-bold mt-6">
                                Rp{" "}
                                {Number(course.price).toLocaleString("id-ID")}
                            </p>
                        )}
                        {isEnrolled ? (
                            <Link
                                href={route("courses.learn", course.id)}
                                className="mt-6 bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-block text-center"
                            >
                                Learn
                            </Link>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="mt-6 bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Add to Cart
                            </button>
                        )}
                    </div>

                    <div>
                        <img
                            src={course.thumbnail_image_url}
                            alt={course.title}
                            className="w-full rounded-lg shadow-2xl"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://placehold.co/600x400/gray/white?text=Image+Missing";
                            }}
                        />
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-lg shadow-md dark:bg-darkSecondary dark:border-dark">
                            <h2 className="text-2xl font-bold mb-6">
                                Course Content
                            </h2>
                            <div className="space-y-6">
                                {course.sections.map((section, index) => (
                                    <div key={section.id}>
                                        <h3 className="font-bold text-xl dark:text-white">
                                            Section {index + 1}: {section.title}
                                        </h3>
                                        <ul className="list-disc list-inside mt-3 space-y-2 dark:text-white">
                                            {section.lessons.map((lesson) => (
                                                <li key={lesson.id}>
                                                    {lesson.title}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="top-24 space-y-8">
                            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-darkSecondary dark:border-dark">
                                <h2 className="text-2xl font-bold mb-4">
                                    What you'll learn
                                </h2>
                                <div className="prose prose-sm max-w-none whitespace-pre-line">
                                    {course.student_outcome}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-darkSecondary dark:border-dark">
                                <h2 className="text-2xl font-bold mb-4">
                                    Requirements
                                </h2>
                                <div className="prose prose-sm max-w-none whitespace-pre-line dark:text-white">
                                    {course.requirements}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

CourseDetails.layout = (page) => <Layout children={page} />;
export default CourseDetails;
