import React, { useState } from "react";
import AddLessonModal from "./AddLessonModal";
import EditSectionModal from "./EditSectionModal";
import EditLessonModal from "./EditLessonModal";

export default function CourseSectionLessonForm({ sections, setData, errors }) {
    const [isLessonModalOpen, setLessonModalOpen] = useState(false);
    const [isEditSectionModalOpen, setEditSectionModalOpen] = useState(false);
    const [isEditLessonModalOpen, setEditLessonModalOpen] = useState(false);

    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedLessonData, setSelectedLessonData] = useState(null);

    const [newSectionTitle, setNewSectionTitle] = useState("");
    const [newSectionDesc, setNewSectionDesc] = useState("");

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

    const deleteSection = (sectionId) => {
        if (confirm("Are you sure?")) {
            setData(
                "sections",
                sections.filter((s) => s.id !== sectionId)
            );
        }
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

    const deleteLesson = (sectionId, lessonId) => {
        if (confirm("Are you sure?")) {
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

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Sections & Lessons</h2>
                <p className="text-gray-600 mb-6">
                    Structure your course by adding sections and the lessons
                    within them.
                </p>

                <div className="space-y-4 mb-8">
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            className="p-4 border rounded-lg bg-gray-50"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-lg">
                                        Section {index + 1}: {section.title}
                                    </p>
                                    {section.description && (
                                        <p className="text-sm text-gray-500 mt-1">
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
                                        className="px-4 py-1 text-sm bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            deleteSection(section.id)
                                        }
                                        className="px-4 py-1 text-sm bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="pl-6 mt-4 border-l-2 space-y-2">
                                {section.lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="text-sm text-gray-700 flex justify-between items-center"
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
                                                className="text-blue-500 text-xs font-semibold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteLesson(
                                                        section.id,
                                                        lesson.id
                                                    )
                                                }
                                                className="text-red-500 text-xs font-semibold"
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
                                <button
                                    type="button"
                                    onClick={() =>
                                        openModal("addLesson", section)
                                    }
                                    className="text-sm font-semibold text-primary mt-2 hover:underline"
                                >
                                    + Add Lesson
                                </button>
                            </div>
                        </div>
                    ))}
                    {sections.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <h3 className="text-xl font-bold text-gray-700">
                                Your course has no sections
                            </h3>
                            <p className="text-gray-500 mt-1">
                                Add your first section below to get started.
                            </p>
                        </div>
                    )}
                </div>

                <form onSubmit={addSection} className="space-y-4 border-t pt-6">
                    <div>
                        <input
                            type="text"
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            placeholder="Add a new section title..."
                            className="w-full border-gray-300 rounded-md shadow-sm"
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
                            className="w-full border-gray-300 rounded-md shadow-sm"
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded-md font-semibold"
                        >
                            Add Section
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
