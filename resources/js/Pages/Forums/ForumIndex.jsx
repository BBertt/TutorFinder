import React, { useState } from "react";
import Layout from "@/Layouts/Layout";
import { Head, Link, router } from "@inertiajs/react";
import ForumPostCard from "@/Components/Forums/ForumPostCard";
import TopContributorList from "@/Components/Forums/TopContributorList";
import Pagination from "@/Components/Pagination";
import SortDropdown from "@/Components/SortDropdown";

function ForumIndex({ forums, topStudents, topTutors, filters }) {
    const [activeTab, setActiveTab] = useState("students");

    const onSortChange = (newSort) => {
        router.get(
            route("forums.index"),
            { sort: newSort },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <>
            <Head title="Forum" />
            <section className="bg-primary text-white rounded-lg p-8 text-center mb-12">
                <h1 className="text-4xl font-bold">TutorFinder Forum</h1>
                <p className="mt-2 text-lg opacity-90">
                    Concerned about something? Go ask the experts!
                </p>
            </section>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-start">
                            <SortDropdown
                                currentSort={filters.sort}
                                onSortChange={onSortChange}
                            />
                        </div>

                        {forums.data.map((post) => (
                            <ForumPostCard key={post.id} post={post} />
                        ))}

                        <Pagination links={forums.links} />
                    </div>
                    <aside className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col items-center">
                            <h3 className="font-bold text-lg mb-4 text-center">
                                Have concerns in your mind?
                            </h3>
                            <Link
                                href={route("forums.create")}
                                className="w-1/2 text-center bg-primary text-white py-2 rounded-full block hover:bg-opacity-90 font-bold"
                            >
                                Create Forum!
                            </Link>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-xl mb-4 text-center">
                                Top Contributors
                            </h3>
                            <div className="flex border-b mb-4">
                                <button
                                    onClick={() => setActiveTab("students")}
                                    className={`w-1/2 py-2 text-center ${
                                        activeTab === "students"
                                            ? "border-b-2 border-primary font-semibold text-primary"
                                            : "text-gray-500"
                                    }`}
                                >
                                    Students
                                </button>
                                <button
                                    onClick={() => setActiveTab("tutors")}
                                    className={`w-1/2 py-2 text-center ${
                                        activeTab === "tutors"
                                            ? "border-b-2 border-primary font-semibold text-primary"
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
                    ;
                </div>
            </main>
        </>
    );
}

ForumIndex.layout = (page) => <Layout children={page} />;
export default ForumIndex;
