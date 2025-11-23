import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";

export default function EditSectionModal({ section, isOpen, onClose, onSave }) {
    const { data, setData, processing, reset } = useForm({
        id: "",
        title: "",
        description: "",
    });

    useEffect(() => {
        if (section) {
            setData({
                id: section.id,
                title: section.title,
                description: section.description || "",
            });
        }
    }, [section]);

    const submit = (e) => {
        e.preventDefault();
        const updatedSection = { ...section, ...data };
        onSave(updatedSection);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl dark:bg-darkSecondary">
                <form onSubmit={submit} className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold dark:text-white">
                        Edit Section Details
                    </h2>
                    <div>
                        <label
                            htmlFor="section_title"
                            className="block text-sm font-medium dark:text-white"
                        >
                            Title
                        </label>
                        <input
                            id="section_title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="section_description"
                            className="block text-sm font-medium dark:text-white"
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
                            className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
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
