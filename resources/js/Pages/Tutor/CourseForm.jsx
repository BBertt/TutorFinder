import React, { useState, useEffect } from "react";
import Layout from "@/Layouts/Layout";
import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import CourseOverviewForm from "@/Components/Tutor/CourseForm/CourseOverviewForm";
import CourseSectionLessonForm from "@/Components/Tutor/CourseForm/CourseSectionLessonForm";
import CourseReview from "@/Components/Tutor/CourseForm/CourseReview";

const Stepper = ({ currentStep }) => {
    const steps = ["Overview", "Sections & Lessons", "Review"];
    return (
        <div className="flex items-center justify-center">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                                index + 1 <= currentStep
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-gray-500"
                            }`}
                        >
                            {index + 1}
                        </div>
                        <p
                            className={`ml-2 transition-colors ${
                                index + 1 <= currentStep
                                    ? "text-primary font-semibold"
                                    : "text-gray-500"
                            }`}
                        >
                            {step}
                        </p>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={`flex-auto border-t-2 transition-colors mx-4 ${
                                index + 1 < currentStep
                                    ? "border-primary"
                                    : "border-gray-200"
                            }`}
                        ></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default function CourseForm({ categories }) {
    const { course, flash } = usePage().props;
    const isEditing = !!course;

    const [currentStep, setCurrentStep] = useState(() => {
        if (isEditing && flash.from_create) return 2;
        return 1;
    });

    const { data, setData, errors, reset, clearErrors } = useForm({
        title: course?.title || "",
        description: course?.description || "",
        student_outcome: course?.student_outcome || "",
        requirements: course?.requirements || "",
        price: course?.price || "0",
        category_id: course?.category_id || "",
        thumbnail_image: null,
        intro_video: null,
        sections: course?.sections || [],
        status: course?.status || "draft",
    });

    const [processing, setProcessing] = useState(false);

    const submitCourse = (e, finalStatus) => {
        e.preventDefault();
        setProcessing(true);
        clearErrors();

        const url = isEditing
            ? route("tutor.courses.update", course.id)
            : route("tutor.courses.store");

        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("student_outcome", data.student_outcome);
        formData.append("requirements", data.requirements);
        formData.append("price", data.price);
        formData.append("category_id", data.category_id);
        formData.append("status", finalStatus);

        if (data.thumbnail_image instanceof File) {
            formData.append("thumbnail_image", data.thumbnail_image);
        }
        if (data.intro_video instanceof File) {
            formData.append("intro_video", data.intro_video);
        }

        if (data.sections.length > 0) {
            data.sections.forEach((section, s_index) => {
                formData.append(`sections[${s_index}][id]`, section.id || "");
                formData.append(`sections[${s_index}][title]`, section.title);
                formData.append(
                    `sections[${s_index}][description]`,
                    section.description || ""
                );

                if (!section.lessons || section.lessons.length === 0) {
                    formData.append(`sections[${s_index}][lessons]`, "");
                } else {
                    section.lessons.forEach((lesson, l_index) => {
                        formData.append(
                            `sections[${s_index}][lessons][${l_index}][id]`,
                            lesson.id || ""
                        );
                        formData.append(
                            `sections[${s_index}][lessons][${l_index}][title]`,
                            lesson.title
                        );
                        formData.append(
                            `sections[${s_index}][lessons][${l_index}][description]`,
                            lesson.description
                        );
                        if (lesson.video instanceof File) {
                            formData.append(
                                `sections[${s_index}][lessons][${l_index}][video]`,
                                lesson.video
                            );
                        }
                    });
                }
            });
        }

        if (isEditing) {
            formData.append("_method", "patch");
        }

        router.post(url, formData, {
            onFinish: () => setProcessing(false),
            onError: (pageErrors) => {
                console.log("Submission Errors:", pageErrors);
            },
        });
    };

    const publishCourse = (e) => submitCourse(e, "published");
    const saveDraft = (e) => submitCourse(e, "draft");

    return (
        <>
            <Head
                title={isEditing ? `Edit: ${course.title}` : "Create Course"}
            />

            <div className="bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-white">
                            {isEditing ? course.title : "New Course"}
                        </h1>
                        <div className="flex items-center space-x-2">
                            <Link
                                href={route("tutor.courses.index")}
                                className="px-4 py-2 rounded-lg text-gray-700 bg-accent hover:bg-gray-300 font-semibold"
                            >
                                Cancel
                            </Link>

                            <button
                                type="button"
                                onClick={saveDraft}
                                className="px-4 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-gray-700"
                                disabled={processing}
                            >
                                {isEditing ? "Save Changes" : "Save to Draft"}
                            </button>

                            {currentStep === 3 && data.status === "draft" && (
                                <button
                                    type="button"
                                    onClick={publishCourse}
                                    className="px-4 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-opacity-90"
                                    disabled={processing}
                                >
                                    Publish
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-8 rounded-lg shadow-md border">
                    <Stepper currentStep={currentStep} />

                    <div className={currentStep === 1 ? "block" : "hidden"}>
                        <CourseOverviewForm
                            {...{ data, setData, errors, course, categories }}
                        />
                    </div>
                    <div className={currentStep === 2 ? "block" : "hidden"}>
                        <CourseSectionLessonForm
                            sections={data.sections}
                            setData={setData}
                            errors={errors}
                        />
                    </div>
                    <div className={currentStep === 3 ? "block" : "hidden"}>
                        <CourseReview
                            courseData={data}
                            existingCourse={course}
                        />
                    </div>
                </div>

                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        onClick={() =>
                            setCurrentStep((s) => Math.max(1, s - 1))
                        }
                        disabled={currentStep === 1 || processing}
                        className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            setCurrentStep((s) => Math.min(3, s + 1))
                        }
                        disabled={currentStep === 3 || processing}
                        className="px-6 py-2 rounded-lg bg-primary text-white font-semibold disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </main>
        </>
    );
}

CourseForm.layout = (page) => <Layout children={page} />;
