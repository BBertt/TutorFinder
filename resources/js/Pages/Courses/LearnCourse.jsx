import Layout from '@/Layouts/Layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import React from 'react';
import axios from 'axios';
import VideoPlayer from '@/Components/VideoPlayer';
import Quiz from '@/Components/Quiz';

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
    const { flash, quiz_results } = usePage().props;
    const [visibleFlash, setVisibleFlash] = React.useState(flash.success);
    const [quizResults, setQuizResults] = React.useState(quiz_results);
    const [activeQuiz, setActiveQuiz] = React.useState(null);

    React.useEffect(() => {
        setVisibleFlash(flash.success);
    }, [flash.success]);

    React.useEffect(() => {
        setQuizResults(quiz_results);
        if (quiz_results) {
            setActiveQuiz(null);
        }
    }, [quiz_results]);

    const findLessonDetails = (lessonId) => {
        if (!lessonId) {
            return { lesson: course.sections[0]?.lessons[0] || null };
        }
        for (const section of course.sections) {
            for (const lesson of section.lessons) {
                if (lesson.id === lessonId) {
                    return { lesson };
                }
            }
        }
        return { lesson: course.sections[0]?.lessons[0] || null };
    };

    const [currentLesson, setCurrentLesson] = React.useState(findLessonDetails(last_watched_lesson_id).lesson);
    const [progress, setProgress] = React.useState(initialProgress);
    const [showRatingModal, setShowRatingModal] = React.useState(false);

    const handleSetCurrentLesson = (lesson) => {
        setCurrentLesson(lesson);
        setActiveQuiz(null);
    };

    const handleTakeQuiz = (quiz) => {
        setCurrentLesson(null);
        setActiveQuiz(quiz);
    };

    const isLessonCompleted = (lessonId) => {
        return progress.some(p => p.course_lesson_id === lessonId && p.is_completed);
    };

    const allLessons = React.useMemo(() => course.sections.flatMap(s => s.lessons), [course.sections]);

    const isCourseFullyCompleted = React.useMemo(() => {
        const allQuizzes = [...course.sections.map(s => s.quiz).filter(q => q), course.finalQuiz].filter(q => q);
        const allQuizIds = allQuizzes.map(q => q.id);
        const completedQuizzes = course.sections.flatMap(s => s.quiz ? s.quiz.attempts : []).concat(course.finalQuiz ? course.finalQuiz.attempts : []);
        const allQuizzesCompleted = allQuizIds.every(id => completedQuizzes.some(a => a.quiz_id === id));

        return allLessons.length > 0 && allLessons.every(l => isLessonCompleted(l.id)) && allQuizzesCompleted;
    }, [allLessons, progress, course]);


    const isSectionCompleted = (section) => {
        const completedLessonsInSection = section.lessons.every(lesson => isLessonCompleted(lesson.id));
        const quizCompleted = !section.quiz || (section.quiz && section.quiz.attempts.length > 0);

        return completedLessonsInSection && quizCompleted;
    };

    const getNextLesson = () => {
        if (!currentLesson) return null;
        let lessonFound = false;
        for (const section of course.sections) {
            for (const lesson of section.lessons) {
                if (lessonFound) return lesson;
                if (lesson.id === currentLesson.id) {
                    lessonFound = true;
                }
            }
        }
        return null;
    };

    const getPreviousLesson = () => {
        if (!currentLesson) return null;
        let previousLesson = null;
        for (const section of course.sections) {
            for (const lesson of section.lessons) {
                if (lesson.id === currentLesson.id) {
                    return previousLesson;
                }
                previousLesson = lesson;
            }
        }
        return null;
    };

    const markLessonAsCompleted = (lessonId) => {
        axios.post(`/course-progress/${lessonId}`, {
            course_id: course.id,
        }).then(() => {
            const newProgress = [...progress];
            const progressIndex = newProgress.findIndex(p => p.course_lesson_id === lessonId);
            if (progressIndex === -1) {
                newProgress.push({ course_lesson_id: lessonId, is_completed: true });
                setProgress(newProgress);
            }
        });
    };

    const handleVideoEnded = () => {
        if (currentLesson) {
            markLessonAsCompleted(currentLesson.id);
        }
    };

    const handleQuizCompleted = () => {
        console.log('Quiz completed and results are in.');
    };

    const handleNextLesson = () => {
        if (currentLesson) {
            markLessonAsCompleted(currentLesson.id);
            const nextLesson = getNextLesson();
            if (nextLesson) {
                handleSetCurrentLesson(nextLesson);
            }
        }
    };

    const handlePreviousLesson = () => {
        const previousLesson = getPreviousLesson();
        if (previousLesson) {
            handleSetCurrentLesson(previousLesson);
        }
    };

    const renderContent = () => {
        if (activeQuiz) {
            return (
                <Quiz
                    quiz={activeQuiz}
                    onComplete={handleQuizCompleted}
                    results={quizResults && quizResults.attempt.quiz_id === activeQuiz.id ? quizResults : null}
                />
            );
        }

        if (currentLesson) {
            return (
                <div>
                    {(currentLesson.s3_video_url || currentLesson.video_url) && (
                        <VideoPlayer videoUrl={currentLesson.s3_video_url || currentLesson.video_url} onVideoEnded={handleVideoEnded} />
                    )}
                    <div className="mt-4">
                        <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                        <div className="flex items-center mt-4">
                            <img
                                className="w-10 h-10 rounded-full mr-4"
                                src={course.user.profile_image_url || "/assets/icons/profile.svg"}
                                alt={course.user.first_name}
                            />
                            <Link href={`/tutors/${course.user.id}`} className="text-lg font-bold">{course.user.first_name} {course.user.last_name}</Link>
                        </div>
                        <p className="text-gray-600 mt-4">{currentLesson.description}</p>
                    </div>
                </div>
            );
        }

        return <div className="text-center p-8">Select a lesson or quiz to begin.</div>;
    };

    return (
        <div>
            {showRatingModal && <RatingModal course={course} onClose={() => setShowRatingModal(false)} />}
            <Head title={course.title} />
            <div className="flex flex-col md:flex-row h-[92vh]">
                <div className="w-full md:w-1/4 bg-white border-r overflow-y-auto">
                    <div className="p-4 bg-gray-200">
                        <h2 className="text-xl font-bold">Course Content</h2>
                    </div>
                    <ul>
                        {course.sections.map((section) => (
                            <li key={section.id} className="mb-1">
                                <h3 className="text-lg font-bold p-4 flex items-center justify-between bg-gray-100">
                                    {section.title}
                                    {isSectionCompleted(section) && <CheckmarkIcon className="w-5 h-5 text-green-500" />}
                                </h3>
                                <ul>
                                    {section.lessons.map((lesson, index) => (
                                        <li key={lesson.id} className={`p-4 cursor-pointer flex items-center justify-between ${currentLesson?.id === lesson.id ? 'bg-gray-300' : ''}`} onClick={() => handleSetCurrentLesson(lesson)}>
                                            <div>Episode {index + 1}: {lesson.title}</div>
                                            {isLessonCompleted(lesson.id) && <CheckmarkIcon className="w-5 h-5 text-green-500" />}
                                        </li>
                                    ))}
                                    {section.quiz && (
                                        <li className={`p-4 cursor-pointer flex items-center justify-between font-semibold ${activeQuiz?.id === section.quiz.id ? 'bg-gray-300' : ''}`} onClick={() => handleTakeQuiz(section.quiz)}>
                                            <div>Take Quiz: {section.quiz.title}</div>
                                            {section.quiz.attempts.length > 0 && <CheckmarkIcon className="w-5 h-5 text-green-500" />}
                                        </li>
                                    )}
                                </ul>
                            </li>
                        ))}
                        {course.finalQuiz && (
                            <li className={`p-4 cursor-pointer flex items-center justify-between font-bold ${activeQuiz?.id === course.finalQuiz.id ? 'bg-gray-300' : ''}`} onClick={() => handleTakeQuiz(course.finalQuiz)}>
                                <div>Take Final Quiz: {course.finalQuiz.title}</div>
                                {course.finalQuiz.attempts.length > 0 && <CheckmarkIcon className="w-5 h-5 text-green-500" />}
                            </li>
                        )}
                    </ul>
                </div>
                <div className="w-full md:w-3/4 p-4 overflow-y-auto">
                    {renderContent()}
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handlePreviousLesson}
                            disabled={!getPreviousLesson()}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
                        >
                            Previous Lesson
                        </button>
                        {(() => {
                            if (isCourseFullyCompleted) {
                                if (!has_reviewed_by_user) {
                                    return <button onClick={() => setShowRatingModal(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md">Review Course</button>;
                                } else {
                                    return <button className="px-4 py-2 bg-green-500 text-white rounded-md" disabled>Course Completed!</button>;
                                }
                            }
                            return (
                                <button
                                    onClick={handleNextLesson}
                                    disabled={!getNextLesson()}
                                    className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
                                >
                                    Next Lesson
                                </button>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}

LearnCourse.layout = (page) => <Layout children={page} />;

export default LearnCourse;
