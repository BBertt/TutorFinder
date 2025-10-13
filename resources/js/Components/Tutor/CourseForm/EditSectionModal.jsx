import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";

export default function EditSectionModal({ section, isOpen, onClose }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        title: "",
        description: "",
    });

    useEffect(() => {
        if (section) {
            setData({
                title: section.title,
                description: section.description || "",
            });
        }
    }, [section]);

    const submit = (e) => {
        e.preventDefault();
        patch(route("tutor.sections.update", section.id), {
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
                <form onSubmit={submit} className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold">
                        Editing {section.title}
                    </h2>
                    <div>
                        <label
                            htmlFor="section_title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            id="section_title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="section_description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description (Optional)
                        </label>
                        <textarea
                            id="section_description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows="3"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        ></textarea>
                        {errors.description && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
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
