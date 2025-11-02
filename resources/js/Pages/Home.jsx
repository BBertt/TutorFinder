import React from "react";
import Layout from "@/Layouts/Layout";
import { Link, usePage } from "@inertiajs/react";
import CourseCard from "@/Components/Course/CourseCard";
import ForumPostCard from "@/Components/Forums/ForumPostCard";

function Home() {
    const { user, courses, tutors, forums } = usePage().props;

    const getCourses = () => {
        if (user.role_id === 2) {
            return route("tutor.courses.index");
        }
        return route("purchased-courses.index");
    };

    return (
        <div className="flex flex-col">
            {/* Learn course blm */}
            <section className="px-8 py-16 flex flex-col gap-8">
                <h1 className="text-2xl font-extrabold">
                    Welcome back, {user.first_name}!
                </h1>
                <Link
                    href={getCourses()}
                    className="mt-4 inline-block text-lg font-semibold hover:text-primary"
                >
                    Your Courses
                </Link>
            </section>

            {/* Course Section */}
            <section className="px-8 py-16">
                <h2 className="text-xl font-extrabold mb-12">
                    Recommended course for you
                </h2>
                <div className="flex flex-wrap justify-between gap-8">
                    {courses.map((course) => (
                        <div key={course.id} className="flex-1">
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>
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
                            <div className="bg-secondary rounded-xl p-6 flex gap-4 items-center text-white">
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
