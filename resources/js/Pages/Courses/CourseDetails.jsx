import React from "react";
import Layout from "@/Layouts/Layout";
import { Head, router, Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Course/Breadcrumb";
import ReviewCard from "@/Components/ReviewCard";
import Pagination from "@/Components/Pagination";

import SuccessModal from "@/Components/Modals/SuccessModal";
function CourseDetails({
    course,
    isEnrolled,
    isInCart,
    hasPendingTransaction,
    isTutor,
    reviews,
}) {
    const [showBlockedModal, setShowBlockedModal] = React.useState(false);
    const handleAddToCart = (e) => {
        e.preventDefault();
        if (hasPendingTransaction) {
            setShowBlockedModal(true);
            return;
        }
        router.post(route("cart.store"), { course_id: course.id });
    };

    return (
        <>
            <Head title={course.title} />

            <div className="bg-primary text-white dark:bg-darkSecondary dark:border-dark">
                {!isTutor && (
                    <Breadcrumb category={course.category} course={course} />
                )}

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
                        {!isTutor && (
                            <>
                                {!isEnrolled && (
                                    <p className="text-3xl font-bold mt-6">
                                        Rp{" "}
                                        {Number(course.price).toLocaleString(
                                            "id-ID"
                                        )}
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
                                    <>
                                        {isInCart ? (
                                            <Link
                                                href={route("cart.index")}
                                                className="mt-6 bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors inline-block text-center"
                                            >
                                                Go to Cart
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={handleAddToCart}
                                                className="mt-6 bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                            >
                                                {hasPendingTransaction
                                                    ? "Pending Payment"
                                                    : "Add to Cart"}
                                            </button>
                                        )}

                                        <SuccessModal
                                            isOpen={showBlockedModal}
                                            onClose={() =>
                                                setShowBlockedModal(false)
                                            }
                                            title="Pending Transaction"
                                            message="You already have a pending transaction for this course. Please complete or cancel it before adding again."
                                        />
                                    </>
                                )}
                            </>
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

                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Course Reviews</h2>
                    {reviews?.data?.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.data.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            This course has no reviews yet.
                        </p>
                    )}

                    {reviews?.data?.length > 0 && (
                        <Pagination links={reviews.links} />
                    )}
                </div>
            </main>
        </>
    );
}

CourseDetails.layout = (page) => <Layout children={page} />;
export default CourseDetails;
