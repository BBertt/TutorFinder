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

    const [currentStep, setCurrentStep] = useState(1);

    // --- THE FIX ---
    // This hook runs once when the component loads (or reloads after a redirect).
    useEffect(() => {
        // If we are on an edit page AND we just came from the create action,
        // set the step to 2.
        if (isEditing && flash.from_create) {
            setCurrentStep(2);
        }
    }, []); // The empty array ensures this only runs once on mount.

    const { data, setData, post, processing, errors } = useForm({
        title: course?.title || "",
        description: course?.description || "",
        student_outcome: course?.student_outcome || "",
        requirements: course?.requirements || "",
        price: course?.price || "0",
        category_id: course?.category_id || "",
        thumbnail_image: null,
        intro_video: null,
    });

    const submitForm = (action, onSuccessCallback = () => {}) => {
        const url = isEditing
            ? route("tutor.courses.update", course.id)
            : route("tutor.courses.store");

        router.post(
            url,
            { ...data, _method: isEditing ? "patch" : "post", action: action },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: onSuccessCallback,
            }
        );
    };

    const saveAndExit = () => {
        submitForm("save_and_exit");
    };

    const saveAndContinue = () => {
        submitForm("save_and_continue", () => {
            if (isEditing) {
                setCurrentStep((s) => Math.min(3, s + 1));
            }
        });
    };

    const publishCourse = () => {
        if (confirm("Are you sure you want to publish this course?")) {
            router.patch(route("tutor.courses.publish", course.id));
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
                            <Link
                                href={route("tutor.courses.index")}
                                className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold"
                            >
                                Cancel
                            </Link>
                            {isEditing ? (
                                <button
                                    type="button"
                                    onClick={saveAndExit}
                                    className="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700"
                                    disabled={processing}
                                >
                                    Save Changes
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={saveAndExit}
                                    className="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700"
                                    disabled={processing}
                                >
                                    Save to Draft
                                </button>
                            )}
                            {isEditing &&
                                currentStep === 3 &&
                                course.status === "draft" && (
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
                        {isEditing ? (
                            <CourseSectionLessonForm course={course} />
                        ) : (
                            <div className="text-center text-gray-500 py-12">
                                <h3 className="text-xl font-bold">
                                    Save Course to Continue
                                </h3>
                                <p>
                                    Click "Next" to save your course overview
                                    and proceed.
                                </p>
                            </div>
                        )}
                    </div>
                    <div className={currentStep === 3 ? "block" : "hidden"}>
                        {isEditing ? (
                            <CourseReview course={course} />
                        ) : (
                            <div className="text-center text-gray-500 py-12">
                                <h3 className="text-xl font-bold">
                                    Save Course to Continue
                                </h3>
                                <p>Please complete the previous steps first.</p>
                            </div>
                        )}
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
                        onClick={saveAndContinue}
                        disabled={currentStep === 3 || processing}
                        className="px-6 py-2 rounded-lg bg-primary text-white font-semibold disabled:opacity-50"
                    >
                        {processing ? "Saving..." : "Next"}
                    </button>
                </div>
            </main>
        </>
    );
}

CourseForm.layout = (page) => <Layout children={page} />;
