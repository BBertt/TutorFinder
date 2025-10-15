import React from "react";
import { useForm } from "@inertiajs/react";

export default function AddLessonModal({ section, isOpen, onClose }) {
    const { data, setData, post, processing, errors, progress, reset } =
        useForm({
            title: "",
            description: "",
            video: null,
        });

    const submit = (e) => {
        e.preventDefault();
        post(route("tutor.sections.lessons.store", section.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        Add New Lesson to "{section.title}"
                    </h2>
                    <div className="mb-4">
                        <label
                            htmlFor="lesson_title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            id="lesson_title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            placeholder="Enter Lesson Name"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="lesson_description"
                            className="block text-sm font-medium text-gray-700"
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
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            placeholder="Enter Lesson Content/Description"
                        ></textarea>
                        {errors.description && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="lesson_video"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Upload Video (Optional)
                        </label>
                        <input
                            type="file"
                            id="lesson_video"
                            accept="video/*"
                            onChange={(e) =>
                                setData("video", e.target.files[0])
                            }
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 cursor-pointer"
                        />
                        {progress && (
                            <progress
                                value={progress.percentage}
                                max="100"
                                className="w-full mt-2"
                            >
                                {progress.percentage}%
                            </progress>
                        )}
                        {errors.video && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.video}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90"
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
