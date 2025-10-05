import React from "react";
import Layout from "@/Layouts/Layout";
import { Head, useForm } from "@inertiajs/react";

function CreateForum() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("forums.store"));
    };

    return (
        <>
            <Head title="Create Forum" />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold mb-6">
                        Create a New Forum Post
                    </h1>

                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label
                                htmlFor="title"
                                className="block text-lg font-medium text-gray-700"
                            >
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                                required
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label
                                htmlFor="description"
                                className="block text-lg font-medium text-gray-700"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                                rows="8"
                                required
                            ></textarea>
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50"
                                disabled={processing}
                            >
                                {processing ? "Posting..." : "Post Forum"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

CreateForum.layout = (page) => <Layout children={page} />;
export default CreateForum;
