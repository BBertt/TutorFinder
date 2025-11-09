import React from "react";

export default function CourseReview({ courseData, existingCourse }) {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
                Review and Publish
            </h2>
            <p className="text-gray-400 mb-6">
                This is a preview of the data that will be saved. Once you are
                satisfied, click "Publish" or "Save to Draft".
            </p>

            <div className="bg-white p-6 rounded-lg border space-y-8 dark:bg-darkSecondary dark:border-dark">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div>
                        <h1 className="text-3xl font-bold dark:text-white">
                            {courseData.title || "(No Title)"}
                        </h1>
                        <p className="mt-4 dark:text-white">
                            {courseData.description || "(No Description)"}
                        </p>
                    </div>
                    <div className="flex justify-center md:justify-end">
                        {courseData.thumbnail_image ? (
                            <img
                                src={URL.createObjectURL(
                                    courseData.thumbnail_image
                                )}
                                alt="Thumbnail Preview"
                                className="rounded-lg shadow-md w-full max-w-sm"
                            />
                        ) : (
                            existingCourse?.thumbnail_image_url && (
                                <img
                                    src={existingCourse.thumbnail_image_url}
                                    alt="Thumbnail Preview"
                                    className="rounded-lg shadow-md w-full max-w-sm"
                                />
                            )
                        )}
                    </div>
                </div>

                <hr className="dark:border-dark" />

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 dark:text-white">
                            What You'll Learn
                        </h3>
                        <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {courseData.student_outcome || "(Not specified)"}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4 dark:text-white">
                            Requirements
                        </h3>
                        <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {courseData.requirements || "(Not specified)"}
                        </div>
                    </div>
                </div>
                <hr className="dark:border-dark" />

                <div>
                    <h3 className="text-xl font-bold mb-4 dark:text-white">
                        Sections & Lessons
                    </h3>
                    <div className="space-y-4">
                        {courseData.sections.map((section, index) => (
                            <div key={section.id}>
                                <p className="font-semibold dark:text-white">
                                    Section {index + 1}: {section.title}
                                </p>
                                {section.description && (
                                    <p className="text-sm text-gray-400 mt-1">
                                        {section.description}
                                    </p>
                                )}
                                <ul className="list-disc list-inside pl-4 dark:text-white">
                                    {section.lessons.map((lesson) => (
                                        <li key={lesson.id}>{lesson.title}</li>
                                    ))}
                                    {section.lessons.length === 0 && (
                                        <li className="text-gray-400 italic">
                                            No lessons in this section yet.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))}
                        {courseData.sections.length === 0 && (
                            <p className="text-gray-400 italic">
                                No sections or lessons have been added yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
