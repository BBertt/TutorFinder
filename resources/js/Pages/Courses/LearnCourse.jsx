import Layout from '@/Layouts/Layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import axios from 'axios';
import VideoPlayer from '@/Components/VideoPlayer';

const CheckmarkIcon = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            clipRule="evenodd"
        />
    </svg>
);

function LearnCourse({ course, progress: initialProgress, last_watched_lesson_id }) {
    const findLessonDetails = (lessonId) => {
        let currentSectionIndex = -1;
        let currentLessonIndex = -1;

        for (let sIdx = 0; sIdx < course.sections.length; sIdx++) {
            const section = course.sections[sIdx];
            for (let lIdx = 0; lIdx < section.lessons.length; lIdx++) {
                const lesson = section.lessons[lIdx];
                if (lesson.id === lessonId) {
                    currentSectionIndex = sIdx;
                    currentLessonIndex = lIdx;
                    return { lesson, currentSectionIndex, currentLessonIndex };
                }
            }
        }
        // Default to the first lesson if lessonId is not found or null
        return {
            lesson: course.sections[0].lessons[0],
            currentSectionIndex: 0,
            currentLessonIndex: 0
        };
    };

    const [currentLesson, setCurrentLesson] = React.useState(findLessonDetails(last_watched_lesson_id).lesson);
    const [progress, setProgress] = React.useState(initialProgress);

    const isLessonCompleted = (lessonId) => {
        return progress.some(p => p.course_lesson_id === lessonId && p.is_completed);
    };

    const isSectionCompleted = (section) => {
        const totalLessons = section.lessons.length;
        if (totalLessons === 0) return false;

        const completedLessonsInSection = section.lessons.filter(lesson =>
            progress.some(p => p.course_lesson_id === lesson.id && p.is_completed)
        ).length;

        return completedLessonsInSection === totalLessons;
    };

    const getNextLesson = () => {
        const { currentSectionIndex, currentLessonIndex } = findLessonDetails(currentLesson.id);
        const currentSection = course.sections[currentSectionIndex];

        if (currentLessonIndex < currentSection.lessons.length - 1) {
            return currentSection.lessons[currentLessonIndex + 1];
        } else if (currentSectionIndex < course.sections.length - 1) {
            return course.sections[currentSectionIndex + 1].lessons[0];
        }
        return null;
    };

    const getPreviousLesson = () => {
        const { currentSectionIndex, currentLessonIndex } = findLessonDetails(currentLesson.id);
        const currentSection = course.sections[currentSectionIndex];

        if (currentLessonIndex > 0) {
            return currentSection.lessons[currentLessonIndex - 1];
        } else if (currentSectionIndex > 0) {
            const previousSection = course.sections[currentSectionIndex - 1];
            return previousSection.lessons[previousSection.lessons.length - 1];
        }
        return null;
    };

    const handleVideoEnded = () => {
        axios.post(`/course-progress/${currentLesson.id}`, {
            course_id: course.id,
        }).then(() => {
            const newProgress = [...progress];
            const progressIndex = newProgress.findIndex(p => p.course_lesson_id === currentLesson.id);
            if (progressIndex > -1) {
                newProgress[progressIndex].is_completed = true;
            } else {
                newProgress.push({ course_lesson_id: currentLesson.id, is_completed: true });
            }
            setProgress(newProgress);
        });
    };

    const handleNextLesson = () => {
        axios.post(`/course-progress/${currentLesson.id}`, {
            course_id: course.id,
        }).then(() => {
            const newProgress = [...progress];
            const progressIndex = newProgress.findIndex(p => p.course_lesson_id === currentLesson.id);
            if (progressIndex > -1) {
                newProgress[progressIndex].is_completed = true;
            } else {
                newProgress.push({ course_lesson_id: currentLesson.id, is_completed: true });
            }
            setProgress(newProgress);

            const nextLesson = getNextLesson();
            if (nextLesson) {
                setCurrentLesson(nextLesson);
            }
        });
    };

    const handlePreviousLesson = () => {
        const previousLesson = getPreviousLesson();
        if (previousLesson) {
            setCurrentLesson(previousLesson);
        }
    };

    return (
        <div>
            <Head title={course.title} />
            <div className="flex flex-col md:flex-row h-screen">
                <div className="w-full md:w-1/4 bg-white border-r overflow-y-auto">
                    <div className="p-4 bg-gray-200">
                        <h2 className="text-xl font-bold">Course Content</h2>
                    </div>
                    <ul>
                        {course.sections.map((section) => (
                            <li key={section.id} className="mb-4">
                                <h3 className="text-lg font-bold p-4 flex items-center justify-between">
                                    {section.title}
                                    {isSectionCompleted(section) && (
                                        <CheckmarkIcon className="w-5 h-5 text-green-500" />
                                    )}
                                </h3>
                                <ul>
                                    {section.lessons.map((lesson, index) => (
                                        <li key={lesson.id} className={`p-4 cursor-pointer flex items-center justify-between ${currentLesson.id === lesson.id ? 'bg-gray-300' : ''}`}>
                                            <div onClick={() => setCurrentLesson(lesson)}>
                                                Episode {index + 1}: {lesson.title}
                                            </div>
                                            {isLessonCompleted(lesson.id) && (
                                                <div className="flex-shrink-0">
                                                    <CheckmarkIcon className="w-5 h-5 text-green-500" />
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-full md:w-3/4 p-4 overflow-y-auto">
                    <div>
                        {(currentLesson.s3_video_url || currentLesson.video_url) && (
                            <VideoPlayer videoUrl={currentLesson.s3_video_url || currentLesson.video_url} onVideoEnded={handleVideoEnded} />
                        )}
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                            <div className="flex items-center mt-4">
                                <img
                                    className="w-10 h-10 rounded-full mr-4"
                                    src={
                                        course.user.profile_image_url ||
                                        "/assets/icons/profile.svg"
                                    }
                                    alt={course.user.first_name}
                                />
                                <Link href={`/tutors/${course.user.id}`} className="text-lg font-bold">{course.user.first_name} {course.user.last_name}</Link>
                            </div>
                            <p className="text-gray-600 mt-4">{currentLesson.description}</p>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handlePreviousLesson}
                                disabled={!getPreviousLesson()}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
                            >
                                Previous Lesson
                            </button>
                            <button
                                onClick={handleNextLesson}
                                disabled={!getNextLesson()}
                                className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
                            >
                                Next Lesson
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

LearnCourse.layout = (page) => <Layout children={page} />;

export default LearnCourse;