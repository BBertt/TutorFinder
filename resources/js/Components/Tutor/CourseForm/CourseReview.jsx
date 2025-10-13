import React from "react";

export default function CourseReview({ course }) {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Review and Publish</h2>
            <p className="text-gray-600 mb-6">
                This is a preview of how your course will look to students. Once
                you are satisfied, click the "Publish" button at the top right
                to make your course live.
            </p>

            <div className="bg-white p-6 rounded-lg border space-y-8">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div>
                        <h1 className="text-3xl font-bold">{course.title}</h1>
                        <p className="text-lg text-gray-500 mt-2">
                            {course.category.name}
                        </p>
                        <p className="mt-4 text-gray-700">
                            {course.description}
                        </p>
                    </div>
                    <div className="flex justify-center md:justify-end">
                        {course.thumbnail_image_url && (
                            <img
                                src={course.thumbnail_image_url}
                                alt="Course thumbnail"
                                className="rounded-lg shadow-md w-full max-w-sm"
                            />
                        )}
                    </div>
                </div>

                <hr />

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">
                            What You'll Learn
                        </h3>
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                            {course.student_outcome}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Requirements</h3>
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                            {course.requirements}
                        </div>
                    </div>
                </div>

                <hr />

                <div>
                    <h3 className="text-xl font-bold mb-4">
                        Sections & Lessons
                    </h3>
                    <div className="space-y-4">
                        {course.sections.map((section, index) => (
                            <div key={section.id}>
                                <p className="font-semibold">
                                    Section {index + 1}: {section.title}
                                </p>
                                <ul className="list-disc list-inside pl-4 text-gray-600">
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
                        {course.sections.length === 0 && (
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
