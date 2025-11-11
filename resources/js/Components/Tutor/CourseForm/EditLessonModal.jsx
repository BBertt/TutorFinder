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
        video: null,
    });

    useEffect(() => {
        if (lessonData?.lesson) {
            setData({
                id: lessonData.lesson.id,
                title: lessonData.lesson.title,
                description: lessonData.lesson.description,
                video: null,
            });
        }
    }, [lessonData]);

    const submit = (e) => {
        e.preventDefault();
        const updatedLesson = { ...lessonData.lesson, ...data };
        onSave(updatedLesson);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl dark:bg-gray-800">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">
                        Edit Lesson: {lessonData.lesson.title}
                    </h2>
                    <div className="mb-4">
                        <label
                            htmlFor="edit_lesson_title"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Name
                        </label>
                        <input
                            id="edit_lesson_title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="edit_lesson_description"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="edit_lesson_video"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Replace Video (Optional)
                        </label>
                        <input
                            type="file"
                            id="edit_lesson_video"
                            accept="video/*"
                            onChange={(e) =>
                                setData("video", e.target.files[0])
                            }
                            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-80 dark:hover:file:bg-opacity-80 cursor-pointer"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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
