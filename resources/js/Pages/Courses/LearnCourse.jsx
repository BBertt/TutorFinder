import Layout from '@/Layouts/Layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
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

const StarRating = ({ rating, onRatingChange }) => (
    <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-8 h-8 cursor-pointer ${rating >= star ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                onClick={() => onRatingChange(star)}
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
            </svg>
        ))}
    </div>
);

const RatingModal = ({ course, onClose }) => {
    const [courseRating, setCourseRating] = React.useState(0);
    const [courseComment, setCourseComment] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (courseRating > 0) {
            router.post(`/courses/${course.id}/reviews`, {
                rating: courseRating,
                comment: courseComment
            }, {
                onSuccess: () => {
                    setIsSubmitting(false);
                    onClose();
                },
                onError: () => {
                    setIsSubmitting(false);
                }
            });
        } else {
            // If no rating is provided, just close the modal
            setIsSubmitting(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Rate Your Course</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Rate the Course: "{course.title}"</h3>
                        <StarRating rating={courseRating} onRatingChange={setCourseRating} />
                        <textarea
                            className="w-full mt-4 p-2 border rounded"
                            rows="3"
                            placeholder="Tell us about your experience with the course..."
                            value={courseComment}
                            onChange={(e) => setCourseComment(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300">
                            Maybe Later
                        </button>
                        <button type="submit" disabled={isSubmitting || courseRating === 0} className="px-6 py-2 rounded text-white bg-primary hover:bg-primary-dark disabled:bg-gray-400">
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

    function LearnCourse({ course, progress: initialProgress, last_watched_lesson_id, has_reviewed_by_user }) {
    const { flash } = usePage().props;
    const [visibleFlash, setVisibleFlash] = React.useState(flash.success);

    React.useEffect(() => {
        setVisibleFlash(flash.success);
    }, [flash.success]);

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
    const [showRatingModal, setShowRatingModal] = React.useState(false);

    const isLessonCompleted = (lessonId) => {
        return progress.some(p => p.course_lesson_id === lessonId && p.is_completed);
    };

    const allLessons = React.useMemo(() => course.sections.flatMap(s => s.lessons), [course.sections]);

    const isCourseFullyCompleted = React.useMemo(() => {
        return allLessons.length > 0 && allLessons.every(l => isLessonCompleted(l.id));
    }, [allLessons, progress]);


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
        // Mark current lesson as completed
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

    const handleCompleteCourse = () => {
        const newProgress = [...progress];
        const progressIndex = newProgress.findIndex(p => p.course_lesson_id === currentLesson.id);
        if (progressIndex > -1) {
            newProgress[progressIndex].is_completed = true;
        } else {
            newProgress.push({ course_lesson_id: currentLesson.id, is_completed: true });
        }
        setProgress(newProgress);

        router.post(`/course-progress/${currentLesson.id}`, {
            course_id: course.id,
            is_finishing: true,
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
            {visibleFlash && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 flex justify-between items-center" role="alert">
                    <p>{visibleFlash}</p>
                    <button onClick={() => setVisibleFlash(null)} className="text-green-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            )}
            {showRatingModal && <RatingModal course={course} onClose={() => setShowRatingModal(false)} />}
            <Head title={course.title} />
            <div className="flex flex-col md:flex-row h-[92vh]">
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
                                        </li>))}
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
                            {(() => {
                                const isCurrentLessonLast = !getNextLesson();

                                let buttonText = 'Next Lesson';
                                let buttonDisabled = !getNextLesson(); // Default disabled if no next lesson
                                let buttonOnClick = handleNextLesson;

                                if (isCurrentLessonLast && isCourseFullyCompleted && !has_reviewed_by_user) {
                                    buttonText = 'Review Course';
                                    buttonDisabled = false;
                                    buttonOnClick = () => setShowRatingModal(true);
                                } else if (isCurrentLessonLast && isCourseFullyCompleted && has_reviewed_by_user) {
                                    buttonText = 'Course Completed!';
                                    buttonDisabled = true;
                                    buttonOnClick = () => { };
                                } else if (isCurrentLessonLast) { // Last lesson, but not fully completed yet
                                    buttonText = 'Complete Course';
                                    buttonDisabled = isLessonCompleted(currentLesson.id); // Disabled if the current lesson is already completed
                                    buttonOnClick = handleCompleteCourse;
                                }

                                return (
                                    <button
                                        onClick={buttonOnClick}
                                        disabled={buttonDisabled}
                                        className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
                                    >
                                        {buttonText}
                                    </button>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

LearnCourse.layout = (page) => <Layout children={page} />;

export default LearnCourse;
