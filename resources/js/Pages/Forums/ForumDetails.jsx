import React from "react";
import Layout from "@/Layouts/Layout";
import { Head, router } from "@inertiajs/react";
import ReplyCard from "@/Components/Forums/ReplyCard";
import ReplyForm from "@/Components/Forums/ReplyForm";
import Pagination from "@/Components/Pagination";
import SortDropdown from "@/Components/SortDropdown";

function ForumDetails({ forum, replies, filters }) {
    const onSortChange = (newSort) => {
        router.get(
            route("forums.show", forum.id),
            { sort: newSort },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <>
            <Head title={forum.title} />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <ReplyCard reply={forum} type="forum" forumId={forum.id} />

                    <div className="mt-12 border-t pt-8">
                        <h3 className="text-xl font-bold mb-4">
                            Leave a Reply
                        </h3>
                        <ReplyForm forumId={forum.id} />
                    </div>
                    <hr className="my-8" />
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                            Replies ({replies.total})
                        </h2>
                        <SortDropdown
                            currentSort={filters.sort}
                            onSortChange={onSortChange}
                        />
                    </div>

                    <div className="space-y-6">
                        {replies.data.map((reply) => (
                            <ReplyCard
                                key={reply.id}
                                reply={reply}
                                type="reply"
                                forumId={forum.id}
                            >
                                {reply.children &&
                                    reply.children.length > 0 && (
                                        <div className="mt-4 pl-6 border-l-2 border-gray-200 space-y-4">
                                            {reply.children.map(
                                                (childReply) => (
                                                    <ReplyCard
                                                        key={childReply.id}
                                                        reply={childReply}
                                                        type="reply"
                                                        forumId={forum.id}
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}
                            </ReplyCard>
                        ))}
                    </div>

                    <Pagination links={replies.links} />
                </div>
            </main>
        </>
    );
}

ForumDetails.layout = (page) => <Layout children={page} />;
export default ForumDetails;
