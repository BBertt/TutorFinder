import React from "react";
import { useForm } from "@inertiajs/react";

export default function AddLessonModal({ section, isOpen, onClose, onSave }) {
    const { data, setData, processing, reset } = useForm({
        title: "",
        description: "",
        video_url: "",
    });

    const isValidYouTubeUrl = (url) =>
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[&#?].*)?$/.test(
            (url || "").trim()
        );

    const submit = (e) => {
        e.preventDefault();
        if (data.video_url && !isValidYouTubeUrl(data.video_url)) return;
        const newLesson = {
            id: `temp_lesson_${Date.now()}`,
            ...data,
        };
        onSave(section.id, newLesson);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl dark:bg-darkSecondary">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">
                        Add New Lesson to "{section.title}"
                    </h2>
                    <div className="mb-4">
                        <label
                            htmlFor="lesson_title"
                            className="block text-sm font-medium text-black dark:text-white"
                        >
                            Name
                        </label>
                        <input
                            id="lesson_title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                            placeholder="Enter Lesson Name"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="lesson_description"
                            className="block text-sm font-medium text-black dark:text-white"
                        >
                            Content
                        </label>
                        <textarea
                            id="lesson_description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows="4"
                            className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                            placeholder="Enter Lesson Content/Description"
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="lesson_video_url"
                            className="block text-sm font-medium text-black dark:text-white"
                        >
                            YouTube Video URL (Optional)
                        </label>
                        <input
                            type="url"
                            id="lesson_video_url"
                            placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                            value={data.video_url}
                            onChange={(e) =>
                                setData("video_url", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-200 text-black dark:text-white font-medium hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-80 dark:hover:bg-opacity-80"
                            disabled={processing}
                        >
                            {processing ? "Saving..." : "Ok"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
