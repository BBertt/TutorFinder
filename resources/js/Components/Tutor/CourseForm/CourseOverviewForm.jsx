import React, { useState, useEffect } from "react";

export default function CourseOverviewForm({
    data,
    setData,
    errors,
    course,
    categories,
    frontendErrors = {},
}) {
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    useEffect(() => {
        if (!data.thumbnail_image && course?.thumbnail_image_url)
            setThumbnailPreview(course.thumbnail_image_url);
        if (!data.intro_video && course?.intro_video_url)
            setVideoPreview(course.intro_video_url);
    }, [course]);

    const onFileChange = (e, field, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setData(field, file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8">
            <div className="space-y-6">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium dark:text-white"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    />
                    {(errors.title || frontendErrors.title) && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.title || frontendErrors.title}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-black dark:text-white"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        rows="5"
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    ></textarea>
                    {(errors.description || frontendErrors.description) && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.description || frontendErrors.description}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="student_outcome"
                        className="block text-sm font-medium text-black dark:text-white"
                    >
                        What will they learn
                    </label>
                    <textarea
                        id="student_outcome"
                        value={data.student_outcome}
                        onChange={(e) =>
                            setData("student_outcome", e.target.value)
                        }
                        rows="5"
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    ></textarea>
                    {(errors.student_outcome ||
                        frontendErrors.student_outcome) && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.student_outcome ||
                                frontendErrors.student_outcome}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="requirements"
                        className="block text-sm font-medium dark:text-white"
                    >
                        Requirements
                    </label>
                    <textarea
                        id="requirements"
                        value={data.requirements}
                        onChange={(e) =>
                            setData("requirements", e.target.value)
                        }
                        rows="5"
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    ></textarea>
                    {(errors.requirements || frontendErrors.requirements) && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.requirements || frontendErrors.requirements}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium dark:text-white">
                        Featured Image
                    </label>
                    <input
                        type="file"
                        id="thumbnail_image"
                        accept="image/*"
                        onChange={(e) =>
                            onFileChange(
                                e,
                                "thumbnail_image",
                                setThumbnailPreview
                            )
                        }
                        className="hidden"
                    />
                    <label
                        htmlFor="thumbnail_image"
                        className="mt-1 w-full h-48 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary dark:bg-darkSecondary dark:border-dark dark:hover:border-primary"
                    >
                        {thumbnailPreview ? (
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                className="max-h-full max-w-full object-contain"
                            />
                        ) : (
                            <span className="text-center text-gray-400">
                                Click to upload image
                            </span>
                        )}
                    </label>
                    {(errors.thumbnail_image ||
                        frontendErrors.thumbnail_image) && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.thumbnail_image ||
                                frontendErrors.thumbnail_image}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-black dark:text-white">
                        Intro Video
                    </label>
                    <input
                        type="file"
                        id="intro_video"
                        accept="video/*"
                        onChange={(e) =>
                            onFileChange(e, "intro_video", setVideoPreview)
                        }
                        className="hidden"
                    />
                    <label
                        htmlFor="intro_video"
                        className="mt-1 w-full h-48 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary dark:bg-darkSecondary dark:border-dark dark:hover:border-primary"
                    >
                        {videoPreview ? (
                            <video
                                src={videoPreview}
                                controls
                                className="max-h-full max-w-full"
                            ></video>
                        ) : (
                            <span className="text-center text-gray-400">
                                Click to upload video
                            </span>
                        )}
                    </label>
                    {errors.intro_video && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.intro_video}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium dark:text-white"
                    >
                        Price (Rp)
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={data.price}
                        onChange={(e) => setData("price", e.target.value)}
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    />
                    {errors.price && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.price}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="category_id"
                        className="block text-sm font-medium dark:text-white"
                    >
                        Category
                    </label>
                    <select
                        id="category_id"
                        value={data.category_id}
                        onChange={(e) => setData("category_id", e.target.value)}
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {(errors.category_id || frontendErrors.category_id) && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.category_id || frontendErrors.category_id}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
