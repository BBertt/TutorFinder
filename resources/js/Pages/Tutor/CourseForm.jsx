import React, { useState, useEffect } from "react";
import Layout from "@/Layouts/Layout";
import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import CourseOverviewForm from "@/Components/Tutor/CourseForm/CourseOverviewForm";
import CourseSectionLessonForm from "@/Components/Tutor/CourseForm/CourseSectionLessonForm";
import CourseReview from "@/Components/Tutor/CourseForm/CourseReview";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

const Stepper = ({ currentStep }) => {
    const steps = ["Overview", "Sections & Lessons", "Review"];
    return (
        <div className="flex items-center justify-center">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${index + 1 <= currentStep
                                ? "bg-primary text-white"
                                : "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-400"
                                }`}
                        >
                            {index + 1}
                        </div>
                        <p
                            className={`ml-2 transition-colors ${index + 1 <= currentStep
                                ? "text-primary font-semibold"
                                : "text-gray-400"
                                }`}
                        >
                            {step}
                        </p>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={`flex-auto border-t-2 transition-colors mx-4 ${index + 1 < currentStep
                                ? "border-primary"
                                : "border-gray-200 dark:border-dark"
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
    const initialIntroVideoUrl = course?.intro_video_url || "";

    const [currentStep, setCurrentStep] = useState(() => {
        if (isEditing && flash.from_create) return 2;
        return 1;
    });

    const { data, setData, errors, reset, clearErrors } = useForm({
        title: course?.title || "",
        description: course?.description || "",
        student_outcome: course?.student_outcome || "",
        requirements: course?.requirements || "",
        price: course?.price || "",
        category_id: course?.category_id || "",
        thumbnail_image: null,
        intro_video: course?.intro_video_url || "",
        sections: (course?.sections || []).map((s) => ({
            ...s,
            quiz_title: s.quiz?.title || s.quiz_title || "",
        })),
        final_quiz_title: course?.finalQuiz?.title || "",
        final_quiz: course?.finalQuiz || {
            title: course?.finalQuiz?.title || "",
            questions: [],
        },
        status: course?.status || "draft",
    });

    const [processing, setProcessing] = useState(false);

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [frontendErrors, setFrontendErrors] = useState({});

    const submitCourse = (e, finalStatus) => {
        e.preventDefault();
        setProcessing(true);
        clearErrors();
        setFrontendErrors({});

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
        if (data.intro_video && !(data.intro_video instanceof File)) {
            formData.append("intro_video", data.intro_video);
        }

        if (data.sections.length > 0) {
            data.sections.forEach((section, s_index) => {
                formData.append(`sections[${s_index}][id]`, section.id || "");
                formData.append(`sections[${s_index}][quiz_title]`, (section.quiz && section.quiz.title) || section.quiz_title || "");
                if ((section.quiz && (section.quiz.title || section.quiz_title))) {
                    formData.append(`sections[${s_index}][quiz_duration_seconds]`, String((section.quiz?.duration_seconds ?? 900)));
                }
                if (section.quiz && Array.isArray(section.quiz.questions)) {
                    section.quiz.questions.forEach((q, q_index) => {
                        formData.append(
                            `sections[${s_index}][quiz][questions][${q_index}][question]`,
                            q.question || ""
                        );
                        (q.options || []).forEach((opt, o_index) => {
                            formData.append(
                                `sections[${s_index}][quiz][questions][${q_index}][options][${o_index}][option]`,
                                opt.option || ""
                            );
                            formData.append(
                                `sections[${s_index}][quiz][questions][${q_index}][options][${o_index}][is_correct]`,
                                opt.is_correct ? "1" : "0"
                            );
                        });
                    });
                }
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
                        if (lesson.video_url) {
                            formData.append(
                                `sections[${s_index}][lessons][${l_index}][video_url]`,
                                lesson.video_url
                            );
                        }
                    });
                }
            });
        }

        formData.append('final_quiz_title', data.final_quiz_title || '');
        if (data.final_quiz_title) {
            formData.append('final_quiz_duration_seconds', String(data.final_quiz?.duration_seconds ?? 900));
        }

        if (data.final_quiz && Array.isArray(data.final_quiz.questions)) {
            data.final_quiz.questions.forEach((q, q_index) => {
                formData.append(
                    `final_quiz[questions][${q_index}][question]`,
                    q.question || ""
                );
                (q.options || []).forEach((opt, o_index) => {
                    formData.append(
                        `final_quiz[questions][${q_index}][options][${o_index}][option]`,
                        opt.option || ""
                    );
                    formData.append(
                        `final_quiz[questions][${q_index}][options][${o_index}][is_correct]`,
                        opt.is_correct ? "1" : "0"
                    );
                });
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

    const performCancel = () => {
        router.get(route("tutor.courses.index"));
    };

    const validateStep1 = () => {
        const newErrors = {};

        if (!data.title) newErrors.title = "The title field is required.";
        if (!data.description)
            newErrors.description = "The description field is required.";
        if (!data.student_outcome)
            newErrors.student_outcome =
                "The 'What will they learn' field is required.";
        if (!data.requirements)
            newErrors.requirements = "The requirements field is required.";
        if (!data.price && data.price !== 0)
            newErrors.price = "The price field is required.";
        if (!data.category_id)
            newErrors.category_id = "The category field is required.";
        if (!data.intro_video) {
            newErrors.intro_video = "The introduction video field is required.";
        }

        if (
            !isEditing &&
            !data.thumbnail_image &&
            !course?.thumbnail_image_url
        ) {
            newErrors.thumbnail_image = "The thumbnail image is required.";
        }

        // Validate YouTube URL when present
        const ytRegex =
            /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[&#?].*)?$/;
        if (
            data.intro_video &&
            !(data.intro_video instanceof File) &&
            data.intro_video.trim() !== "" &&
            !ytRegex.test(String(data.intro_video).trim())
        ) {
            newErrors.intro_video = "Please enter a valid YouTube URL.";
        }

        setFrontendErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};

        if (!data.sections || data.sections.length === 0) {
            newErrors.sections_min = "You must add at least one section.";
        } else {
            const sectionWithoutLessons = data.sections.some(
                (s) => s.lessons.length === 0
            );
            if (sectionWithoutLessons) {
                newErrors.lessons_min =
                    "Every section must have at least one lesson.";
            }

            const incompleteLesson = data.sections.some((section) =>
                section.lessons.some(
                    (lesson) => !lesson.title || !lesson.description
                )
            );
            if (incompleteLesson) {
                newErrors.lesson_content =
                    "All lessons must have both a title and description.";
            }
        }

        setFrontendErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextClick = () => {
        clearErrors();
        setFrontendErrors({});

        if (currentStep === 1) {
            if (validateStep1()) {
                setCurrentStep(2);
            }
        } else if (currentStep === 2) {
            if (validateStep2()) {
                setCurrentStep(3);
            }
        }
    };

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
                            <button
                                type="button"
                                onClick={() => setIsCancelModalOpen(true)}
                                className="px-4 py-2 rounded-lg bg-white hover:bg-gray-400 font-semibold dark:bg-darkPrimary dark:hover:bg-gray-700"
                                disabled={processing}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={saveDraft}
                                className="px-4 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-gray-700 dark:hover:bg-gray-400"
                                disabled={processing}
                            >
                                {isEditing ? "Save Changes" : "Save to Draft"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-8 rounded-lg shadow-md border dark:bg-darkSecondary dark:border-dark">
                    <Stepper currentStep={currentStep} />

                    <div className={currentStep === 1 ? "block" : "hidden"}>
                        <CourseOverviewForm
                            {...{
                                data,
                                setData,
                                errors,
                                course,
                                categories,
                                clearErrors,
                                setFrontendErrors,
                            }}
                            frontendErrors={frontendErrors}
                        />
                    </div>
                    <div className={currentStep === 2 ? "block" : "hidden"}>
                        <CourseSectionLessonForm
                            sections={data.sections}
                            setData={setData}
                            errors={errors}
                            frontendErrors={frontendErrors}
                            finalQuizTitle={data.final_quiz_title}
                            finalQuiz={data.final_quiz}
                            onFinalQuizTitleChange={(v) => {
                                setData("final_quiz_title", v);
                                setData("final_quiz", {
                                    ...(data.final_quiz || {}),
                                    title: v,
                                    questions: data.final_quiz?.questions || [],
                                });
                            }}
                            onFinalQuizChange={(qz) =>
                                setData("final_quiz", qz)
                            }
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
                        className="px-6 py-2 rounded-lg bg-gray-200 font-semibold disabled:opacity-50 dark:bg-darkSecondary dark:text-white dark:disabled:opacity-50"
                    >
                        Previous
                    </button>

                    {currentStep < 3 && (
                        <button
                            type="button"
                            onClick={handleNextClick}
                            disabled={processing}
                            className="px-6 py-2 rounded-lg bg-primary text-white font-semibold disabled:opacity-50 dark:hover:bg-opacity-80"
                        >
                            Next
                        </button>
                    )}

                    {currentStep === 3 && data.status === "draft" && (
                        <button
                            type="button"
                            onClick={() => setIsPublishModalOpen(true)}
                            className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-80"
                            disabled={processing}
                        >
                            Publish
                        </button>
                    )}
                </div>
            </main>

            <ConfirmationModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={performCancel}
                title="Confirm Cancel"
                message="Are you sure you want to cancel? Any unsaved changes will be lost."
                confirmText="Yes, Cancel"
                cancelText="No"
                confirmColor="bg-red-600"
            />

            <ConfirmationModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                onConfirm={(e) => {
                    publishCourse(e);
                    setIsPublishModalOpen(false);
                }}
                title="Confirm Publish"
                message="Are you sure you want to publish this course? It will become visible to students."
                confirmText="Yes, Publish"
                cancelText="No"
            />
        </>
    );
}

CourseForm.layout = (page) => <Layout children={page} />;
