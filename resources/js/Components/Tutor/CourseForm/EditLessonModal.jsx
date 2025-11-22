import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";

export default function EditLessonModal({
    lessonData,
    isOpen,
    onClose,
    onSave,
}) {
    const { data, setData, processing, errors, reset } = useForm({
        id: "",
        title: "",
        description: "",
        video_url: "",
    });

    useEffect(() => {
        if (lessonData?.lesson) {
            setData({
                id: lessonData.lesson.id,
                title: lessonData.lesson.title,
                description: lessonData.lesson.description,
                video_url: lessonData.lesson.video_url || "",
            });
        }
    }, [lessonData]);

    const isValidYouTubeUrl = (url) =>
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[&#?].*)?$/.test(
            (url || "").trim()
        );

    const submit = (e) => {
        e.preventDefault();
        if (data.video_url && !isValidYouTubeUrl(data.video_url)) return;
        const updatedLesson = { ...lessonData.lesson, ...data };
        onSave(updatedLesson);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl dark:bg-darkSecondary">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">
                        Edit Lesson: {lessonData.lesson.title}
                    </h2>
                    <div className="mb-4">
                        <label
                            htmlFor="edit_lesson_title"
                            className="block text-sm font-medium dark:text-white"
                        >
                            Name
                        </label>
                        <input
                            id="edit_lesson_title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="edit_lesson_description"
                            className="block text-sm font-medium dark:text-white"
                        >
                            Content
                        </label>
                        <textarea
                            id="edit_lesson_description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows="4"
                            className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="edit_lesson_video_url"
                            className="block text-sm font-medium dark:text-white"
                        >
                            YouTube Video URL (Optional)
                        </label>
                        <input
                            type="url"
                            id="edit_lesson_video_url"
                            placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                            value={data.video_url}
                            onChange={(e) =>
                                setData("video_url", e.target.value)
                            }
                            className={`mt-1 block w-full rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400 ${
                                data.video_url &&
                                !isValidYouTubeUrl(data.video_url)
                                    ? "border-red-500"
                                    : "border-gray-200"
                            }`}
                        />
                        {data.video_url &&
                            !isValidYouTubeUrl(data.video_url) && (
                                <p className="text-sm text-red-500 mt-1">
                                    Invalid YouTube URL.
                                </p>
                            )}
                        {data.video_url &&
                            isValidYouTubeUrl(data.video_url) && (
                                <div className="mt-3 aspect-video w-full">
                                    <iframe
                                        className="w-full h-full rounded"
                                        src={`https://www.youtube.com/embed/${
                                            data.video_url.match(
                                                /(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
                                            )?.[1]
                                        }`}
                                        title="Lesson Video Preview"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-black dark:text-white font-medium rounded-md w-24 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
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
