import React from "react";
import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import CourseCard from "@/Components/Course/CourseCard";
import TutorReviewCard from "@/Components/Tutor/TutorReviewCard";

function TutorProfile({ tutor }) {
    const tutorName = `${tutor.first_name} ${tutor.last_name}`;

    return (
        <>
            <Head title={tutorName} />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                <section className="bg-primary text-white rounded-lg p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                        <img
                            className={`w-40 h-40 rounded-full ring-4 ring-white flex-shrink-0 ${
                                !tutor.profile_image_path && "dark:invert"
                            }`}
                            src={
                                tutor.profile_image_path
                                    ? `/${tutor.profile_image_path}`
                                    : "/assets/icons/profile.svg"
                            }
                            alt={tutorName}
                        />
                        <div className="text-center flex-grow">
                            <h1 className="text-4xl lg:text-5xl font-bold">
                                {tutorName}
                            </h1>
                            <p className="mt-4 text-lg max-w-2xl mx-auto italic opacity-90">
                                "
                                {tutor.bio ||
                                    "This tutor has not written a bio yet."}
                                "
                            </p>
                        </div>
                    </div>
                </section>
                <section>
                    <h2 className="text-3xl font-bold mb-6 dark:text-gray-200">
                        Tutor courses
                    </h2>
                    {tutor.courses?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tutor.courses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                            This tutor has not published any courses yet.
                        </p>
                    )}
                </section>

                <section>
                    <h2 className="text-3xl font-bold mb-6 dark:text-gray-200">
                        Review
                    </h2>
                    {tutor.reviews?.length > 0 ? (
                        <div className="space-y-6">
                            {tutor.reviews.map((review) => (
                                <TutorReviewCard
                                    key={review.id}
                                    review={review}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                            This tutor has not received any reviews yet.
                        </p>
                    )}
                </section>
            </main>
        </>
    );
}

TutorProfile.layout = (page) => <Layout children={page} />;
export default TutorProfile;
