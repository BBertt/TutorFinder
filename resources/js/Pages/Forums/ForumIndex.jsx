import React, { useState } from "react";
import Layout from "@/Layouts/Layout";
import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import ForumPostCard from "@/Components/Forums/ForumPostCard";
import TopContributorList from "@/Components/Forums/TopContributorList";
import Pagination from "@/Components/Pagination";
import SortDropdown from "@/Components/SortDropdown";
import LoginModal from "@/Components/LoginModal";

function ForumIndex({ forums, topStudents, topTutors, filters }) {
    const [activeTab, setActiveTab] = useState("students");
    const { auth } = usePage().props;
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    const activeView = filters.view || "all";

    const { data, setData } = useForm({
        search: filters.search || "",
    });

    const handleGuestClick = (e) => {
        if (!auth.user) {
            e.preventDefault();
            setLoginModalOpen(true);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("forums.index"),
            {
                search: data.search,
                sort: filters.sort,
                view: activeView === "my_forums" ? "my_forums" : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const onSortChange = (newSort) => {
        router.get(
            route("forums.index"),
            {
                sort: newSort,
                view: activeView === "my_forums" ? "my_forums" : undefined,
                search: data.search,
            },
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
                <p className="mt-2 text-lg opacity-80">
                    Concerned about something? Go ask the experts!
                </p>
            </section>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <img
                                    className="w-5 h-5 text-gray-400 dark:invert"
                                    src="/assets/icons/magnifying-glass.svg"
                                    alt="Search"
                                />
                            </div>
                            <input
                                type="text"
                                name="search"
                                value={data.search}
                                onChange={(e) =>
                                    setData("search", e.target.value)
                                }
                                placeholder="Search forums by title, description, or author..."
                                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                            />
                        </form>

                        <div className="flex justify-between items-center mb-4">
                            <div className="flex space-x-8 border-b dark:border-gray-700">
                                <Link
                                    href={route("forums.index", {
                                        sort: filters.sort,
                                        view: undefined,
                                        search: data.search,
                                    })}
                                    className={`py-2 text-lg font-semibold transition-colors ${
                                        activeView === "all"
                                            ? "border-b-2 border-primary text-primary dark:text-primary"
                                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                    }`}
                                    preserveState
                                    preserveScroll
                                >
                                    All Forums
                                </Link>
                                {auth.user && (
                                    <Link
                                        href={route("forums.index", {
                                            sort: filters.sort,
                                            view: "my_forums",
                                            search: data.search,
                                        })}
                                        className={`py-2 text-lg font-semibold transition-colors ${
                                            activeView === "my_forums"
                                                ? "border-b-2 border-primary text-primary dark:text-primary"
                                                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                        }`}
                                        preserveState
                                        preserveScroll
                                    >
                                        My Forums
                                    </Link>
                                )}
                            </div>
                            <SortDropdown
                                currentSort={filters.sort}
                                onSortChange={onSortChange}
                            />
                        </div>

                        {forums.data.length > 0 ? (
                            forums.data.map((post) => (
                                <div
                                    key={post.id}
                                    onClickCapture={handleGuestClick}
                                >
                                    <ForumPostCard
                                        post={post}
                                        showDeleteButton={
                                            activeView === "my_forums" &&
                                            auth.user?.id === post.user_id
                                        }
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 bg-white p-12 rounded-lg shadow-sm border dark:bg-darkSecondary dark:border-dark dark:text-gray-400">
                                <h2 className="text-2xl font-bold dark:text-white">
                                    {filters.search
                                        ? "No forums found matching your search."
                                        : activeView === "my_forums"
                                        ? "You haven't posted any forums yet."
                                        : "No forums found."}
                                </h2>
                                <p className="mt-2">
                                    {filters.search
                                        ? "Try a different search term."
                                        : activeView === "my_forums"
                                        ? "Click 'Create Forum' to share your thoughts!"
                                        : "Be the first to post in the forum."}
                                </p>
                            </div>
                        )}

                        <Pagination links={forums.links} />
                    </div>

                    <aside className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col items-center dark:bg-darkSecondary dark:border-dark">
                            <h3 className="font-bold text-lg mb-4 text-center dark:text-white">
                                Have concerns in your mind?
                            </h3>
                            <Link
                                href={route("forums.create")}
                                onClick={handleGuestClick}
                                className="w-1/2 text-center bg-primary text-white py-2 rounded-full block hover:bg-opacity-80 font-bold"
                            >
                                Create Forum!
                            </Link>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-gray-200 dark:bg-darkSecondary dark:border-dark">
                            <h3 className="font-bold text-xl mb-4 text-center dark:text-white">
                                Top Contributors
                            </h3>
                            <div className="flex border-b mb-4 dark:border-dark">
                                <button
                                    onClick={() => setActiveTab("students")}
                                    className={`w-1/2 py-2 text-center ${
                                        activeTab === "students"
                                            ? "border-b-2 border-primary font-semibold text-primary"
                                            : "text-gray-400"
                                    }`}
                                >
                                    Students
                                </button>
                                <button
                                    onClick={() => setActiveTab("tutors")}
                                    className={`w-1/2 py-2 text-center ${
                                        activeTab === "tutors"
                                            ? "border-b-2 border-primary font-semibold text-primary"
                                            : "text-gray-400"
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

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            />
        </>
    );
}

ForumIndex.layout = (page) => <Layout children={page} />;
export default ForumIndex;
