import React, { useState, useEffect, useRef } from "react";
import VideoPlayer from "@/Components/VideoPlayer";

export default function CourseOverviewForm({
    data,
    setData,
    errors,
    clearErrors,
    setFrontendErrors,
    course,
    categories,
    frontendErrors = {},
}) {
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");

    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [outcomeError, setOutcomeError] = useState("");
    const [requirementsError, setRequirementsError] = useState("");
    const [thumbnailError, setThumbnailError] = useState("");
    const [videoUrlError, setVideoUrlError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [categoryError, setCategoryError] = useState("");

    const [categoryQuery, setCategoryQuery] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryComboboxRef = useRef(null);

    const isValidYouTubeUrl = (url) => {
        const re =
            /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[&#?].*)?$/;
        return re.test(url.trim());
    };
    const getYouTubeId = (url) => {
        try {
            const u = new URL(url);
            if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
            if (u.hostname.includes("youtube.com"))
                return u.searchParams.get("v");
        } catch {}
        const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
        return m ? m[1] : null;
    };

    useEffect(() => {
        if (!data.thumbnail_image && course?.thumbnail_image_url)
            setThumbnailPreview(course.thumbnail_image_url);
        if (course?.intro_video_url) {
            setVideoUrl(course.intro_video_url);
        }
    }, [course]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                categoryComboboxRef.current &&
                !categoryComboboxRef.current.contains(event.target)
            ) {
                setIsCategoryOpen(false);
                const currentSelection = categories.find(
                    (c) => c.name.toLowerCase() === categoryQuery.toLowerCase()
                );
                if (!currentSelection) {
                    if (!data.category_id) {
                        setCategoryQuery("");
                    } else {
                        const validCategory = categories.find(
                            (c) => c.id === data.category_id
                        );
                        if (validCategory) setCategoryQuery(validCategory.name);
                    }
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [categoryComboboxRef, categoryQuery, data.category_id, categories]);

    const filteredCategories =
        categoryQuery === ""
            ? categories
            : categories.filter((category) =>
                  category.name
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(categoryQuery.toLowerCase().replace(/\s+/g, ""))
              );

    const onFileChange = (e, field, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setData(field, file);
            setPreview(URL.createObjectURL(file));
            errorSetter("");
            if (clearErrors) clearErrors(field);
            if (setFrontendErrors) setFrontendErrors({});
        }
    };

    const onFieldChange = (key, value, localErrorSetter, localErrorMessage) => {
        setData(key, value);
        if (clearErrors) clearErrors(key);
        if (setFrontendErrors) setFrontendErrors({});
        !value ? localErrorSetter(localErrorMessage) : localErrorSetter("");
    };

    const isIntroVideoValid = !videoUrl || isValidYouTubeUrl(videoUrl);

    return (
        <div
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8"
            data-intro-video-valid={isIntroVideoValid}
        >
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
                        placeholder="Input your course title here..."
                        value={data.title}
                        onChange={(e) =>
                            onFieldChange(
                                "title",
                                e.target.value,
                                setTitleError,
                                "The title field is required."
                            )
                        }
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    />
                    {(titleError || errors.title || frontendErrors.title) && (
                        <p className="text-sm text-red-500 mt-1">
                            {titleError || errors.title || frontendErrors.title}
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
                        placeholder="Input your course description here..."
                        value={data.description}
                        onChange={(e) =>
                            onFieldChange(
                                "description",
                                e.target.value,
                                setDescriptionError,
                                "The description field is required."
                            )
                        }
                        rows="5"
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    ></textarea>
                    {(descriptionError ||
                        errors.description ||
                        frontendErrors.description) && (
                        <p className="text-sm text-red-500 mt-1">
                            {descriptionError ||
                                errors.description ||
                                frontendErrors.description}
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
                        placeholder="Input what students will learn here..."
                        value={data.student_outcome}
                        onChange={(e) =>
                            onFieldChange(
                                "student_outcome",
                                e.target.value,
                                setOutcomeError,
                                "The 'What will they learn' field is required."
                            )
                        }
                        rows="5"
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    ></textarea>
                    {(outcomeError ||
                        errors.student_outcome ||
                        frontendErrors.student_outcome) && (
                        <p className="text-sm text-red-500 mt-1">
                            {outcomeError ||
                                errors.student_outcome ||
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
                        placeholder="Input course requirements here..."
                        value={data.requirements}
                        onChange={(e) =>
                            onFieldChange(
                                "requirements",
                                e.target.value,
                                setRequirementsError,
                                "The requirements field is required."
                            )
                        }
                        rows="5"
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    ></textarea>
                    {(requirementsError ||
                        errors.requirements ||
                        frontendErrors.requirements) && (
                        <p className="text-sm text-red-500 mt-1">
                            {requirementsError ||
                                errors.requirements ||
                                frontendErrors.requirements}
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
                                setThumbnailPreview,
                                setThumbnailError
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
                    {(thumbnailError ||
                        errors.thumbnail_image ||
                        frontendErrors.thumbnail_image) && (
                        <p className="text-sm text-red-500 mt-1">
                            {thumbnailError ||
                                errors.thumbnail_image ||
                                frontendErrors.thumbnail_image}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-black dark:text-white">
                        Intro Video (YouTube URL)
                    </label>
                    <input
                        type="url"
                        inputMode="url"
                        placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                        value={videoUrl}
                        onChange={(e) => {
                            const val = e.target.value;
                            setVideoUrl(val);
                            setData("intro_video", val);
                            if (clearErrors) clearErrors("intro_video");
                            if (setFrontendErrors) setFrontendErrors({});

                            if (!val || isValidYouTubeUrl(val)) {
                                setVideoUrlError("");
                            } else {
                                setVideoUrlError(
                                    "Please enter a valid YouTube URL"
                                );
                            }
                        }}
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    />
                    {videoUrl && isValidYouTubeUrl(videoUrl) && (
                        <div className="mt-3 aspect-video w-full">
                            <VideoPlayer
                                videoUrl={`https://www.youtube.com/embed/${getYouTubeId(
                                    videoUrl
                                )}`}
                                className="h-1/2"
                            />
                        </div>
                    )}
                    {(videoUrlError ||
                        errors.intro_video ||
                        frontendErrors.intro_video) && (
                        <p className="text-sm text-red-500 mt-1">
                            {videoUrlError ||
                                errors.intro_video ||
                                frontendErrors.intro_video}
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
                        onChange={(e) =>
                            onFieldChange(
                                "price",
                                e.target.value,
                                setPriceError,
                                "The price field is required."
                            )
                        }
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    />

                    {(priceError || errors.price || frontendErrors.price) && (
                        <p className="text-sm text-red-500 mt-1">
                            {priceError || errors.price || frontendErrors.price}
                        </p>
                    )}
                </div>
                <div ref={categoryComboboxRef} className="relative">
                    <label
                        htmlFor="category_id"
                        className="block text-sm font-medium dark:text-white"
                    >
                        Category
                    </label>
                    <input
                        id="category_id"
                        type="text"
                        value={categoryQuery}
                        onFocus={() => setIsCategoryOpen(true)}
                        onChange={(e) => {
                            setCategoryQuery(e.target.value);
                            if (clearErrors) clearErrors("category_id");
                            if (setFrontendErrors) setFrontendErrors({});
                            setCategoryError("");
                            setData("category_id", "");
                        }}
                        placeholder="Search or select a category"
                        autoComplete="off"
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    />

                    {isCategoryOpen && (
                        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-darkSecondary border border-gray-300 dark:border-dark rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <li
                                        key={category.id}
                                        onClick={() => {
                                            setCategoryQuery(category.name);
                                            setData("category_id", category.id);
                                            setIsCategoryOpen(false);
                                            setCategoryError("");
                                        }}
                                        className="px-4 py-2 text-black dark:text-white hover:bg-primary hover:text-white dark:hover:bg-primary cursor-pointer"
                                    >
                                        {category.name}
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-gray-400">
                                    No categories found.
                                </li>
                            )}
                        </ul>
                    )}

                    {(categoryError ||
                        errors.category_id ||
                        frontendErrors.category_id) && (
                        <p className="text-sm text-red-500 mt-1">
                            {data.category_id
                                ? errors.category_id ||
                                  frontendErrors.category_id
                                : categoryError ||
                                  "Please select a valid category."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
