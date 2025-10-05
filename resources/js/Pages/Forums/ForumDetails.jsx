import React from "react";
import Layout from "@/Layouts/Layout";
import { Head, useForm } from "@inertiajs/react";
import ReplyCard from "@/Components/Forums/ReplyCard";

function ForumDetails({ forum }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("forums.replies.store", forum.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title={forum.title} />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <ReplyCard reply={forum} /> <hr className="my-8" />
                    <h2 className="text-2xl font-bold mb-6">Replies</h2>
                    <div className="space-y-6">
                        {forum.replies.map((reply) => (
                            <ReplyCard key={reply.id} reply={reply} />
                        ))}
                    </div>
                    <div className="mt-12">
                        <form onSubmit={submit}>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="Write a message..."
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
                                rows="4"
                            ></textarea>
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.description}
                                </p>
                            )}
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                                >
                                    Post Reply
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}

ForumDetails.layout = (page) => <Layout children={page} />;
export default ForumDetails;
