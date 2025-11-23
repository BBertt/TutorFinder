import React from "react";
import Layout from "@/Layouts/Layout";
import { Link, usePage } from "@inertiajs/react";
import CourseCard from "@/Components/Course/CourseCard";
import ForumPostCard from "@/Components/Forums/ForumPostCard";

function Home() {
    const { user, myCourses, recommendedCourses, tutors, forums } =
        usePage().props;

    const getCourses = () => {
        if (user.role_id === 2) {
            return route("tutor.courses.index");
        }
        return route("purchased-courses.index");
    };

    return (
        <div className="flex flex-col">
            <section className="px-8 py-16 flex flex-col gap-8">
                <h1 className="text-2xl font-extrabold">
                    Welcome back, {user.first_name}!
                </h1>
                <Link
                    href={getCourses()}
                    className="mt-4 inline-block text-lg font-semibold text-primary hover:underline dark:text-white"
                >
                    Your Courses
                </Link>

                <div>
                    {myCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {myCourses.map((course) => (
                                <div key={course.id} className="flex-1">
                                    <CourseCard course={course} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200 dark:bg-darkSecondary dark:border-dark">
                            <p className="text-gray-500 dark:text-gray-400">
                                You don't have any courses yet.
                            </p>
                            {user.role_id === 2 ? (
                                <Link
                                    href={route("tutor.courses.create")}
                                    className="mt-4 inline-block text-primary font-bold hover:underline"
                                >
                                    Create your first course
                                </Link>
                            ) : (
                                <Link
                                    href={route("courses.index")}
                                    className="mt-4 inline-block text-primary font-bold hover:underline dark:text-white"
                                >
                                    Browse courses
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Course Section */}
            <section className="px-8 py-16 bg-gray-50 dark:bg-gray-900">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-xl font-extrabold dark:text-white">
                        Recommended courses for you
                    </h2>
                    <Link
                        href={route("courses.index")}
                        className="text-sm font-semibold text-primary hover:underline dark:text-white"
                    >
                        Browse All &rarr;
                    </Link>
                </div>

                {recommendedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendedCourses.map((course) => (
                            <div key={course.id} className="flex-1">
                                <CourseCard course={course} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                        No new recommendations available right now.
                    </p>
                )}
            </section>

            {/* Tutor Section */}
            <section className="px-8 py-16">
                <h2 className="text-xl font-extrabold mb-12">
                    Top tutor this week
                </h2>
                <div className="flex justify-between gap-8">
                    {tutors.map((tutor) => (
                        <Link
                            key={tutor.id}
                            href={`/tutors/${tutor.id}`}
                            className="flex-1"
                        >
                            <div className="bg-secondary rounded-xl p-6 flex gap-4 items-center text-white dark:bg-darkSecondary dark:border-dark">
                                <img
                                    className="w-24 h-24 rounded-full"
                                    src={
                                        tutor?.profile_image_url
                                            ? tutor?.profile_image_url
                                            : "/assets/icons/profile.svg"
                                    }
                                    alt="Profile"
                                />
                                <div>
                                    <h3 className="font-bold">
                                        {tutor.first_name} {tutor.last_name}
                                    </h3>
                                    <p className="text-sm mt-2">{tutor.bio}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="px-8 py-16">
                <h2 className="text-xl font-extrabold mb-12">
                    Recommended forum for you
                </h2>
                <div className="flex flex-col gap-8">
                    {forums.map((post) => (
                        <ForumPostCard key={post.id} post={post} />
                    ))}
                </div>
            </section>
        </div>
    );
}

Home.layout = (page) => <Layout children={page} />;

export default Home;
