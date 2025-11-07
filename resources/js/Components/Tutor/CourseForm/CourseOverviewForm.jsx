import React, { useState, useEffect } from "react";

export default function CourseOverviewForm({
    data,
    setData,
    errors,
    course,
    categories,
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
                        className="block text-sm font-medium text-gray-700"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
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
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        rows="5"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    ></textarea>
                    {errors.description && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.description}
                        </p>
                    )}
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
                            setData("student_outcome", e.target.value)
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
                            setData("requirements", e.target.value)
                        }
                        rows="5"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    ></textarea>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer hover:border-primary"
                    >
                        {thumbnailPreview ? (
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                className="max-h-full max-w-full object-contain"
                            />
                        ) : (
                            <span className="text-center text-gray-500">
                                Click to upload image
                            </span>
                        )}
                    </label>
                    {errors.thumbnail_image && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.thumbnail_image}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer hover:border-primary"
                    >
                        {videoPreview ? (
                            <video
                                src={videoPreview}
                                controls
                                className="max-h-full max-w-full"
                            ></video>
                        ) : (
                            <span className="text-center text-gray-500">
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
                        className="block text-sm font-medium text-gray-700"
                    >
                        Price (Rp)
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={data.price}
                        onChange={(e) => setData("price", e.target.value)}
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
                        onChange={(e) => setData("category_id", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
