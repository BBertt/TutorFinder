import React, { useState, useEffect } from "react";
import QuizEditor from "./QuizEditor";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

export default function QuizModal({
    isOpen,
    onClose,
    onSave,
    onDelete,
    initialData,
    title, // "Add Quiz" or "Edit Quiz"
}) {
    const [quizData, setQuizData] = useState({
        title: "",
        description: "",
        duration_seconds: 900,
        questions: [],
    });
    const [errors, setErrors] = useState({});
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setQuizData({
                    title: initialData.title || "",
                    description: initialData.description || "",
                    duration_seconds: initialData.duration_seconds || 900,
                    questions: initialData.questions || [],
                });
            } else {
                setQuizData({
                    title: "",
                    description: "",
                    duration_seconds: 900,
                    questions: [],
                });
            }
            setErrors({});
            setIsDeleteConfirmOpen(false);
        }
    }, [isOpen, initialData]);

    const validate = () => {
        const newErrors = {};
        if (!quizData.title || quizData.title.trim() === "") {
            newErrors.title = "Quiz title is required.";
        }

        if (!quizData.questions || quizData.questions.length === 0) {
            newErrors['quiz.questions_min'] = "Quiz must have at least one question.";
        } else {
            quizData.questions.forEach((q, qIndex) => {
                if (!q.question || q.question.trim() === "") {
                    newErrors[`quiz.questions.${qIndex}.question`] = "Question text is required.";
                }

                (q.options || []).forEach((opt, oIndex) => {
                    if (!opt.option || opt.option.trim() === "") {
                        newErrors[`quiz.questions.${qIndex}.options.${oIndex}.option`] = "Option text is required.";
                    }
                });

                const hasCorrectOption = q.options && q.options.some(o => o.is_correct);
                if (!hasCorrectOption) {
                    newErrors[`quiz.questions.${qIndex}.correct_option`] = "Select a correct answer.";
                }
            });
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            onSave(quizData);
            onClose();
        }
    };

    const handleDeleteClick = () => {
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        onDelete();
        setIsDeleteConfirmOpen(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl dark:bg-darkSecondary my-8 max-h-[90vh] flex flex-col">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-darkSecondary z-10 rounded-t-lg">
                        <h2 className="text-2xl font-bold dark:text-white">
                            {title}
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                        <div className="mb-4">
                            <label className="block text-sm font-medium dark:text-white mb-1">
                                Quiz Title
                            </label>
                            <input
                                type="text"
                                value={quizData.title}
                                onChange={(e) => {
                                    setQuizData({ ...quizData, title: e.target.value });
                                    if (errors.title) {
                                        setErrors(prev => {
                                            const next = { ...prev };
                                            delete next.title;
                                            return next;
                                        });
                                    }
                                }}
                                className="w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter Quiz Title"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        <QuizEditor
                            value={quizData}
                            onChange={setQuizData}
                            errors={errors}
                            setFrontendErrors={setErrors}
                            errorPrefix="quiz" 
                        />
                    </div>

                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2 bg-gray-50 dark:bg-darkSecondary rounded-b-lg sticky bottom-0">
                        {initialData && onDelete && (
                            <button
                                type="button"
                                onClick={handleDeleteClick}
                                className="mr-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete Quiz
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-200 text-black dark:text-white font-medium hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-80"
                        >
                            Save Quiz
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Quiz"
                message="Are you sure you want to delete this quiz? This action cannot be undone."
                confirmText="Delete"
                confirmColor="bg-red-600"
            />
        </>
    );
}
