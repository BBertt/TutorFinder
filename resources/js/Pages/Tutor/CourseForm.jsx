import React from "react";
import Layout from "@/Layouts/Layout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function CourseForm({ course, categories }) {
    const isEditing = !!course;

    const { data, setData, post, processing, errors, progress } = useForm({
        _method: isEditing ? "PATCH" : "POST",
        title: course?.title || "",
        description: course?.description || "",
        student_outcome: course?.student_outcome || "",
        requirements: course?.requirements || "",
        price: course?.price || "0",
        category_id: course?.category_id || "",
        thumbnail_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        const url = isEditing
            ? route("tutor.courses.update", course.id)
            : route("tutor.courses.store");
        post(url, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={isEditing ? "Edit Course" : "Create Course"} />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form onSubmit={submit}>
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">
                            {isEditing ? "Edit Course" : "Create New Course"}
                        </h1>
                        <div className="flex items-center space-x-2">
                            <Link
                                href={route("tutor.courses.index")}
                                className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90"
                                disabled={processing}
                            >
                                {isEditing ? "Update Course" : "Save Draft"}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
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
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows="5"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    ></textarea>
                                </div>
                                <div>
                                    <label
                                        htmlFor="student_outcome"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        What will they learn
                                    </label>
                                    <textarea
                                        id="student_outcome"
                                        value={data.student_outcome}
                                        onChange={(e) =>
                                            setData(
                                                "student_outcome",
                                                e.target.value
                                            )
                                        }
                                        rows="5"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    ></textarea>
                                </div>
                                <div>
                                    <label
                                        htmlFor="requirements"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Requirements
                                    </label>
                                    <textarea
                                        id="requirements"
                                        value={data.requirements}
                                        onChange={(e) =>
                                            setData(
                                                "requirements",
                                                e.target.value
                                            )
                                        }
                                        rows="5"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="thumbnail_image"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Featured Image
                                    </label>
                                    <input
                                        type="file"
                                        id="thumbnail_image"
                                        onChange={(e) =>
                                            setData(
                                                "thumbnail_image",
                                                e.target.files[0]
                                            )
                                        }
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90"
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
                                    {errors.thumbnail_image && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.thumbnail_image}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="price"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Price (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData("price", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="category_id"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Category
                                    </label>
                                    <select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={(e) =>
                                            setData(
                                                "category_id",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="">
                                            Select a category
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </>
    );
}

CourseForm.layout = (page) => <Layout children={page} />;
