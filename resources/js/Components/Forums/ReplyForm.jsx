import React from "react";
import { useForm } from "@inertiajs/react";

export default function ReplyForm({
    forumId,
    parentId = null,
    onSuccess = () => {},
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        description: "",
        parent_id: parentId,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("forums.replies.store", forumId), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    };

    return (
        <form onSubmit={submit} className="mt-4">
            <textarea
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="Write a message..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                rows="3"
            ></textarea>
            {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                </p>
            )}
            <div className="flex justify-end mt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 dark:hover:bg-opacity-80 disabled:opacity-50 text-sm font-semibold"
                >
                    Post Reply
                </button>
            </div>
        </form>
    );
}
