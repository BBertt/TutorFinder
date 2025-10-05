import React, { useState } from "react";
import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";
import ForumPostCard from "@/Components/Forums/ForumPostCard";
import TopContributorList from "@/Components/Forums/TopContributorList";

function ForumIndex({ forums, topStudents, topTutors }) {
    const [activeTab, setActiveTab] = useState("students");

    return (
        <>
            <Head title="Forum" />
            <section className="bg-primary text-white">
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-4xl font-bold">TutorFinder Forum</h1>
                    <p className="mt-2 text-lg opacity-90">
                        Concerned about something? Go ask the experts!
                    </p>
                </div>
            </section>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {forums.data.map((post) => (
                            <ForumPostCard key={post.id} post={post} />
                        ))}
                    </div>

                    <aside className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="font-bold text-lg mb-4">
                                Have concerns in your mind?
                            </h3>
                            <Link
                                href={route("forums.create")}
                                className="w-full text-center bg-primary text-white py-2 rounded-lg block hover:bg-opacity-90"
                            >
                                Create Forum!
                            </Link>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="font-bold text-xl mb-4">
                                Top Contributors
                            </h3>
                            <div className="flex border-b mb-4">
                                <button
                                    onClick={() => setActiveTab("students")}
                                    className={`py-2 px-4 ${
                                        activeTab === "students"
                                            ? "border-b-2 border-primary font-semibold"
                                            : "text-gray-500"
                                    }`}
                                >
                                    Students
                                </button>
                                <button
                                    onClick={() => setActiveTab("tutors")}
                                    className={`py-2 px-4 ${
                                        activeTab === "tutors"
                                            ? "border-b-2 border-primary font-semibold"
                                            : "text-gray-500"
                                    }`}
                                >
                                    Tutors
                                </button>
                            </div>
                            {activeTab === "students" ? (
                                <TopContributorList
                                    contributors={topStudents}
                                />
                            ) : (
                                <TopContributorList contributors={topTutors} />
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
}

ForumIndex.layout = (page) => <Layout children={page} />;
export default ForumIndex;
