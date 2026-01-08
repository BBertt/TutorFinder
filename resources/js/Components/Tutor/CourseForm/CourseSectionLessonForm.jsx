import React, { useState, useEffect } from "react";
import QuizEditor from "./QuizEditor";
import AddLessonModal from "./AddLessonModal";
import EditSectionModal from "./EditSectionModal";
import EditLessonModal from "./EditLessonModal";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

export default function CourseSectionLessonForm({
    sections,
    setData,
    errors,
    frontendErrors = {},
    finalQuizTitle,
    finalQuiz,
    onFinalQuizTitleChange,
    onFinalQuizChange,
}) {
    const [isLessonModalOpen, setLessonModalOpen] = useState(false);
    const [isEditSectionModalOpen, setEditSectionModalOpen] = useState(false);
    const [isEditLessonModalOpen, setEditLessonModalOpen] = useState(false);

    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedLessonData, setSelectedLessonData] = useState(null);

    const [newSectionTitle, setNewSectionTitle] = useState("");
    const [newSectionDesc, setNewSectionDesc] = useState("");

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showFrontendErrors, setShowFrontendErrors] = useState(true);

    // Reset showFrontendErrors when frontendErrors change
    useEffect(() => {
        if (
            frontendErrors.sections_min ||
            frontendErrors.lessons_min ||
            frontendErrors.lesson_content
        ) {
            setShowFrontendErrors(true);
        }
    }, [frontendErrors]);

    const handleAddQuiz = (sectionId) => {
            setData(
                "sections",
                sections.map((s) =>
                    s.id === sectionId
                        ? {
                              ...s,
                              quiz: { title: "", description: "", questions: [] },
                              quiz_title: "",
                          }
                        : s
                )
            );
        };
    
        const handleRemoveQuiz = (sectionId) => {
            setData(
                "sections",
                sections.map((s) => {
                    if (s.id === sectionId) {
                        const newSection = { ...s };
                        delete newSection.quiz;
                        delete newSection.quiz_title;
                        return newSection;
                    }
                    return s;
                })
            );
        };
    
        const openModal = (modal, item) => {
        if (modal === "addLesson") {
            setSelectedSection(item);
            setLessonModalOpen(true);
        } else if (modal === "editSection") {
            setSelectedSection(item);
            setEditSectionModalOpen(true);
        } else if (modal === "editLesson") {
            setSelectedLessonData(item);
            setEditLessonModalOpen(true);
        }
    };
    const closeModal = () => {
        setLessonModalOpen(false);
        setEditSectionModalOpen(false);
        setEditLessonModalOpen(false);
    };

    const addSection = (e) => {
        e.preventDefault();
        if (newSectionTitle.trim() === "") return;
        const newSection = {
            id: `temp_${Date.now()}`,
            title: newSectionTitle,
            description: newSectionDesc,
            lessons: [],
        };
        setData("sections", [...sections, newSection]);
        setNewSectionTitle("");
        setNewSectionDesc("");
    };

    const editSection = (updatedSection) => {
        setData(
            "sections",
            sections.map((s) =>
                s.id === updatedSection.id || s.id === updatedSection.temp_id
                    ? updatedSection
                    : s
            )
        );
    };

    const openDeleteModal = (type, sectionId, lessonId = null) => {
        setDeleteTarget({ type, sectionId, lessonId });
        setDeleteModalOpen(true);
    };

    const performDelete = () => {
        if (!deleteTarget) return;

        const { type, sectionId, lessonId } = deleteTarget;

        if (type === "section") {
            setData(
                "sections",
                sections.filter((s) => s.id !== sectionId)
            );
        } else if (type === "lesson") {
            setData(
                "sections",
                sections.map((s) =>
                    s.id === sectionId
                        ? {
                              ...s,
                              lessons: s.lessons.filter(
                                  (l) => l.id !== lessonId
                              ),
                          }
                        : s
                )
            );
        }
        setDeleteModalOpen(false);
        setDeleteTarget(null);
    };

    const addLesson = (sectionId, newLesson) => {
        setData(
            "sections",
            sections.map((s) =>
                s.id === sectionId
                    ? { ...s, lessons: [...s.lessons, newLesson] }
                    : s
            )
        );
    };

    const editLesson = (updatedLesson) => {
        setData(
            "sections",
            sections.map((s) => ({
                ...s,
                lessons: s.lessons.map((l) =>
                    l.id === updatedLesson.id || l.id === updatedLesson.temp_id
                        ? updatedLesson
                        : l
                ),
            }))
        );
    };

    return (
        <>
            <AddLessonModal
                isOpen={isLessonModalOpen}
                section={selectedSection}
                onClose={closeModal}
                onSave={addLesson}
            />
            <EditSectionModal
                isOpen={isEditSectionModalOpen}
                section={selectedSection}
                onClose={closeModal}
                onSave={editSection}
            />
            <EditLessonModal
                isOpen={isEditLessonModalOpen}
                lessonData={selectedLessonData}
                onClose={closeModal}
                onSave={editLesson}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={performDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this? This action cannot be undone."
                confirmText="Yes, Delete"
                cancelText="No"
                confirmColor="bg-red-600"
            />

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">
                    Sections & Lessons
                </h2>
                <p className="text-gray-400 mb-6">
                    Structure your course by adding sections and the lessons
                    within them.
                </p>

                {(frontendErrors.sections_min ||
                    frontendErrors.lessons_min ||
                    frontendErrors.lesson_content) &&
                    showFrontendErrors && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 flex items-center justify-between">
                            <div className="flex-grow">
                                {frontendErrors.sections_min && (
                                    <p>{frontendErrors.sections_min}</p>
                                )}
                                {frontendErrors.lessons_min && (
                                    <p>{frontendErrors.lessons_min}</p>
                                )}
                                {frontendErrors.lesson_content && (
                                    <p>{frontendErrors.lesson_content}</p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowFrontendErrors(false)}
                                className="ml-4 text-red-800 hover:text-red-900"
                                aria-label="Close"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}

                <div className="space-y-4 mb-8">
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            className="p-4 border rounded-lg dark:bg-darkSecondary dark:border-dark"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-lg dark:text-white">
                                        Section {index + 1}: {section.title}
                                    </p>
                                    {section.description && (
                                        <p className="text-sm text-gray-400 mt-1">
                                            {section.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openModal("editSection", section)
                                        }
                                        className="px-4 py-1 text-sm rounded-md bg-gray-200 text-black dark:text-white font-medium hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDeleteModal(
                                                "section",
                                                section.id
                                            )
                                        }
                                        className="px-4 py-1 text-sm bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 dark:hover:bg-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="pl-6 mt-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-2">
                                {section.lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="text-sm dark:text-white flex justify-between items-center"
                                    >
                                        <span>- {lesson.title}</span>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openModal("editLesson", {
                                                        lesson,
                                                        section,
                                                    })
                                                }
                                                className="text-blue-400 text-xs font-semibold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openDeleteModal(
                                                        "lesson",
                                                        section.id,
                                                        lesson.id
                                                    )
                                                }
                                                className="text-red-400 text-xs font-semibold"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {section.lessons.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">
                                        No lessons in this section yet.
                                    </p>
                                )}
                                <div className="mt-3 flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openModal("addLesson", section)
                                        }
                                        className="text-sm font-semibold text-primary hover:underline"
                                    >
                                        + Add Lesson
                                    </button>

                                    {section.quiz_title != null ? (
                                        <>
                                            <div className="flex justify-between items-center mt-2">
                                                <h4 className="font-semibold dark:text-white">
                                                    Section Quiz
                                                </h4>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveQuiz(
                                                            section.id
                                                        )
                                                    }
                                                    className="text-red-400 text-xs font-semibold"
                                                >
                                                    Remove Quiz
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={
                                                    section.quiz?.title ??
                                                    section.quiz_title ??
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "sections",
                                                        sections.map((s) =>
                                                            s.id === section.id
                                                                ? {
                                                                      ...s,
                                                                      quiz: {
                                                                          ...(s.quiz ||
                                                                              {}),
                                                                          title: e
                                                                              .target
                                                                              .value,
                                                                      },
                                                                      quiz_title:
                                                                          e
                                                                              .target
                                                                              .value,
                                                                  }
                                                                : s
                                                        )
                                                    )
                                                }
                                                placeholder="Section Quiz Title"
                                                className="text-sm w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                                            />
                                            {frontendErrors[`sections.${index}.quiz.title`] && (
                                                <p className="text-red-500 text-sm mt-1">{frontendErrors[`sections.${index}.quiz.title`]}</p>
                                            )}
                                            <div className="mt-2">
                                                <QuizEditor
                                                    value={section.quiz}
                                                    onChange={(qz) =>
                                                        setData(
                                                            "sections",
                                                            sections.map((s) =>
                                                                s.id ===
                                                                section.id
                                                                    ? {
                                                                          ...s,
                                                                          quiz: qz,
                                                                      }
                                                                    : s
                                                            )
                                                        )
                                                    }
                                                    errors={frontendErrors}
                                                    errorPrefix={`sections.${index}.quiz`}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAddQuiz(section.id)
                                                }
                                                className="text-sm font-semibold text-primary hover:underline"
                                            >
                                                + Add Section Quiz
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {sections.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg dark:border-dark">
                            <h3 className="text-xl font-bold dark:text-white">
                                Your course has no sections
                            </h3>
                            <p className="text-gray-400 mt-1">
                                Add your first section below to get started.
                            </p>
                        </div>
                    )}
                </div>

                <form
                    onSubmit={addSection}
                    className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                    <div>
                        <input
                            type="text"
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            placeholder="Add a new section title..."
                            className="w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                        />
                        {errors["sections.0.title"] && (
                            <p className="text-red-500 text-sm mt-1">
                                Section titles are required.
                            </p>
                        )}
                    </div>
                    <div>
                        <textarea
                            value={newSectionDesc}
                            onChange={(e) => setNewSectionDesc(e.target.value)}
                            placeholder="Add an optional description for the section..."
                            rows="2"
                            className="w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded-md font-semibold dark:hover:bg-opacity-80"
                        >
                            Add Section
                        </button>
                    </div>
                </form>
                <div className="mt-10">
                    <div className="mb-6 p-4 border rounded-lg bg-white dark:bg-darkSecondary dark:border-dark">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold dark:text-white">
                                Final Quiz (Optional)
                            </h2>
                            {finalQuizTitle != null && (
                                <button
                                    type="button"
                                    onClick={() => onFinalQuizTitleChange(null)}
                                    className="text-red-400 text-xs font-semibold"
                                >
                                    Remove Quiz
                                </button>
                            )}
                        </div>

                        {finalQuizTitle != null ? (
                            <>
                                <input
                                    type="text"
                                    value={finalQuizTitle || ""}
                                    onChange={(e) =>
                                        onFinalQuizTitleChange &&
                                        onFinalQuizTitleChange(e.target.value)
                                    }
                                    placeholder="Enter a final quiz title"
                                    className="w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                                />
                                {frontendErrors['final_quiz.title'] && (
                                    <p className="text-red-500 text-sm mt-1">{frontendErrors['final_quiz.title']}</p>
                                )}
                                <div className="mt-3">
                                    <QuizEditor
                                        value={finalQuiz}
                                        onChange={onFinalQuizChange}
                                        errors={frontendErrors}
                                        errorPrefix="final_quiz"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => onFinalQuizTitleChange("")}
                                    className="text-sm font-semibold text-primary hover:underline"
                                >
                                    + Add Final Quiz
                                </button>
                                <p className="text-xs text-gray-400 mt-1">
                                    If provided, a final quiz will be created
                                    for the whole course.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
