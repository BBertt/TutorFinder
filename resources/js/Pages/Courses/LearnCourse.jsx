import Layout from "@/Layouts/Layout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import React, { useEffect, useRef } from "react";

import VideoPlayer from "@/Components/VideoPlayer";
import Quiz from "@/Components/Quiz";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

// ... (Icons and Modal components remain the same)
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

const LockIcon = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path
            fillRule="evenodd"
            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
            clipRule="evenodd"
        />
    </svg>
);
const StarRating = ({ rating, onRatingChange }) => (
    <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-8 h-8 cursor-pointer ${
                    rating >= star ? "text-yellow-400" : "text-gray-400"
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
    const [courseComment, setCourseComment] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (courseRating > 0) {
            router.post(
                `/courses/${course.id}/reviews`,
                {
                    rating: courseRating,
                    comment: courseComment,
                },
                {
                    onSuccess: () => {
                        setIsSubmitting(false);
                        onClose();
                    },
                    onError: () => {
                        setIsSubmitting(false);
                    },
                }
            );
        } else {
            setIsSubmitting(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-darkPrimary dark:text-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Rate Your Course
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">
                            Rate the Course: "{course.title}"
                        </h3>
                        <StarRating
                            rating={courseRating}
                            onRatingChange={setCourseRating}
                        />
                        <textarea
                            className="mt-4 p-2 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                            rows="3"
                            placeholder="Tell us about your experience with the course..."
                            value={courseComment}
                            onChange={(e) => setCourseComment(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-black dark:text-white font-medium rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            Maybe Later
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || courseRating === 0}
                            className="px-6 py-2 rounded-md text-white bg-primary hover:bg-primary-dark disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function LearnCourse({
    course,
    progress: initialProgress,
    last_watched_lesson_id,
    has_reviewed_by_user,
    course_completed,
}) {
    const { quiz_submitted } = usePage().props;

    const [activeContent, setActiveContent] = React.useState(() => {
        const lastWatchedLesson = course.sections
            .flatMap((s) => s.lessons)
            .find((l) => l.id === last_watched_lesson_id);
        if (lastWatchedLesson)
            return { type: "lesson", content: lastWatchedLesson };
        const firstLesson = course.sections[0]?.lessons[0];
        return firstLesson ? { type: "lesson", content: firstLesson } : null;
    });

    const [progress, setProgress] = React.useState(initialProgress);
    const [showRatingModal, setShowRatingModal] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [showQuizConfirm, setShowQuizConfirm] = React.useState(false);
    const [pendingQuiz, setPendingQuiz] = React.useState(null);
    const [showCertificate, setShowCertificate] = React.useState(false);
    const certificateRef = useRef(null);
    const handlePrintCertificate = () => {
        if (!certificateRef.current) return;
        const printContents = certificateRef.current.innerHTML;
        const styles = Array.from(
            document.querySelectorAll('link[rel="stylesheet"], style')
        )
            .map((el) => el.outerHTML)
            .join("");
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.document.write(
            "<html><head><title>Certificate</title>" +
                styles +
                '<style>@page{size:A4 landscape;margin:15mm;} body{margin:0;} .print-hide{display:none!important;} .certificate-wrapper{width:100%;}</style></head><body><div class="certificate-wrapper">' +
                printContents +
                "</div></body></html>"
        );
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60)
            .toString()
            .padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    useEffect(() => {
        if (quiz_submitted) {
            setIsSubmitting(true);
            router.reload({
                onFinish: () => setIsSubmitting(false),
            });
        }
    }, [quiz_submitted]);

    const isLessonCompleted = (lessonId) =>
        progress.some((p) => p.course_lesson_id === lessonId);
    const allLessons = React.useMemo(
        () => course.sections.flatMap((s) => s.lessons),
        [course.sections]
    );
    const firstIncompleteIndex = React.useMemo(
        () => allLessons.findIndex((l) => !isLessonCompleted(l.id)),
        [allLessons, progress]
    );
    const isLessonLocked = (lesson) => {
        const idx = allLessons.findIndex((l) => l.id === lesson.id);
        if (idx === -1) return false;
        if (isLessonCompleted(lesson.id)) return false;

        // Lock lessons in the next section until the previous section quiz is passed
        const sectionIdx = course.sections.findIndex((s) =>
            s.lessons.some((l) => l.id === lesson.id)
        );
        if (sectionIdx > 0) {
            const prevSection = course.sections[sectionIdx - 1];
            if (prevSection?.quiz && !isQuizPassed(prevSection.quiz)) {
                return true;
            }
        }

        return firstIncompleteIndex !== -1 && idx > firstIncompleteIndex;
    };
    const canProceedFromCurrent = React.useMemo(() => {
        if (activeContent?.type !== "lesson") return true;
        const idx = allLessons.findIndex(
            (l) => l.id === activeContent.content.id
        );
        return allLessons.slice(0, idx).every((l) => isLessonCompleted(l.id));
    }, [activeContent, allLessons, progress]);
    const isQuizPassed = (quiz) =>
        quiz && quiz.attempts.some((a) => a.score / a.total_questions >= 0.8);

    const isSectionCompleted = (section) => {
        const lessonsCompleted = section.lessons.every((l) =>
            isLessonCompleted(l.id)
        );
        const quizPassed = !section.quiz || isQuizPassed(section.quiz);
        return lessonsCompleted && quizPassed;
    };

    const areAllSectionsCompleted = React.useMemo(
        () => course.sections.every(isSectionCompleted),
        [course.sections, progress]
    );
    const isCourseFullyCompleted = React.useMemo(
        () => areAllSectionsCompleted && isQuizPassed(course.finalQuiz),
        [areAllSectionsCompleted, course.finalQuiz]
    );

    const getNextContent = () => {
        if (activeContent?.type === "lesson") {
            const { content: currentLesson } = activeContent;
            const currentSectionIndex = course.sections.findIndex((s) =>
                s.lessons.some((l) => l.id === currentLesson.id)
            );
            const currentSection = course.sections[currentSectionIndex];
            const currentLessonIndex = currentSection.lessons.findIndex(
                (l) => l.id === currentLesson.id
            );

            if (currentLessonIndex < currentSection.lessons.length - 1) {
                return {
                    type: "lesson",
                    content: currentSection.lessons[currentLessonIndex + 1],
                };
            }
            if (currentSection.quiz) {
                return { type: "quiz", content: currentSection.quiz };
            }
            if (currentSectionIndex < course.sections.length - 1) {
                const nextSection = course.sections[currentSectionIndex + 1];
                return nextSection?.lessons[0]
                    ? { type: "lesson", content: nextSection.lessons[0] }
                    : null;
            }
        }

        if (activeContent?.type === "quiz") {
            // Only allow proceeding to next section if this quiz is passed
            const currentSectionIndex = course.sections.findIndex(
                (s) => s.quiz?.id === activeContent.content.id
            );
            const quizObj = course.sections.find(
                (s) => s.quiz?.id === activeContent.content.id
            )?.quiz;
            const passed = isQuizPassed(quizObj);
            if (
                passed &&
                currentSectionIndex !== -1 &&
                currentSectionIndex < course.sections.length - 1
            ) {
                const nextSection = course.sections[currentSectionIndex + 1];
                if (nextSection?.lessons.length > 0) {
                    return { type: "lesson", content: nextSection.lessons[0] };
                }
            }
        }

        if (course.finalQuiz && areAllSectionsCompleted) {
            // Don't suggest final quiz if we're already on it
            if (
                !(
                    activeContent?.type === "quiz" &&
                    activeContent.content.id === course.finalQuiz.id
                )
            ) {
                return { type: "quiz", content: course.finalQuiz };
            }
        }

        return null;
    };

    const getPreviousLesson = () => {
        if (activeContent?.type !== "lesson") return null;
        let previousLesson = null;
        for (const section of course.sections) {
            for (const lesson of section.lessons) {
                if (lesson.id === activeContent.content.id)
                    return previousLesson;
                previousLesson = lesson;
            }
        }
        return null;
    };

    const markLessonAsCompleted = async (lessonId) => {
        if (isLessonCompleted(lessonId)) return;
        router.post(
            `/course-progress/${lessonId}`,
            { course_id: course.id },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
        setProgress((prev) => [...prev, { course_lesson_id: lessonId }]);
    };

    const handleNext = async () => {
        if (activeContent?.type === "lesson") {
            const currentIndex = allLessons.findIndex(
                (l) => l.id === activeContent.content.id
            );
            const prevComplete = allLessons
                .slice(0, currentIndex)
                .every((l) => isLessonCompleted(l.id));
            if (!prevComplete) {
                const target = allLessons.find((l) => !isLessonCompleted(l.id));
                if (target)
                    setActiveContent({ type: "lesson", content: target });
                return;
            }
            await markLessonAsCompleted(activeContent.content.id);
        }
        const next = getNextContent();
        // Prevent moving forward from quiz if not passed
        if (activeContent?.type === "quiz") {
            const quizObj =
                course.sections.find(
                    (s) => s.quiz?.id === activeContent.content.id
                )?.quiz ||
                (course.finalQuiz?.id === activeContent.content.id
                    ? course.finalQuiz
                    : null);
            if (!isQuizPassed(quizObj)) {
                return; // stay on results until passed or retried
            }
        }
        if (next) {
            if (next.type === "quiz") {
                if ((next.content.attempts || []).length > 0) {
                    setActiveContent(next);
                } else {
                    setPendingQuiz(next.content);
                    setShowQuizConfirm(true);
                }
            } else {
                setActiveContent(next);
            }
        }
    };

    const startFinalQuiz = async () => {
        if (activeContent?.type === "lesson") {
            await markLessonAsCompleted(activeContent.content.id);
        }
        if ((course.finalQuiz?.attempts || []).length > 0) {
            setActiveContent({ type: "quiz", content: course.finalQuiz });
        } else {
            setPendingQuiz(course.finalQuiz);
            setShowQuizConfirm(true);
        }
    };

    const renderContent = () => {
        if (isSubmitting) {
            if (showCertificate) return null;
            return (
                <div className="text-center p-8">
                    Submitting and loading results...
                </div>
            );
        }
        // Show certificate overlay regardless of activeContent type
        if (showCertificate) {
            const completionDate = new Date().toLocaleDateString();
            const studentFirst =
                usePage().props.auth?.user?.first_name ||
                course.user?.first_name ||
                "";
            const studentLast =
                usePage().props.auth?.user?.last_name ||
                course.user?.last_name ||
                "";
            return (
                <div className="flex items-center justify-center p-8">
                    <div
                        ref={certificateRef}
                        className="w-full max-w-2xl border-4 border-yellow-400 rounded-xl p-8 bg-white dark:bg-darkSecondary shadow-2xl relative print:shadow-none"
                    >
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none opacity-10 bg-[radial-gradient(circle_at_center,_#fbbf24,_transparent_70%)]"></div>
                        <h1 className="text-3xl font-extrabold text-center mb-2 tracking-wide">
                            Certificate of Completion
                        </h1>
                        <p className="text-center text-sm uppercase text-gray-400 mb-6">
                            This certifies that
                        </p>
                        <p className="text-center text-2xl font-semibold mb-4">
                            {studentFirst} {studentLast}
                        </p>
                        <p className="text-center text-lg mb-4">
                            has successfully completed the course
                        </p>
                        <p className="text-center text-2xl font-bold mb-6 italic">
                            "{course.title}"
                        </p>
                        <div className="flex justify-between mt-10 text-sm">
                            <div>
                                <p className="font-semibold">Date</p>
                                <p>{completionDate}</p>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center gap-4">
                            <button
                                onClick={() => setShowCertificate(false)}
                                className="px-4 py-2 bg-gray-200 text-black rounded-md print-hide"
                            >
                                Back
                            </button>
                            <button
                                onClick={handlePrintCertificate}
                                className="px-4 py-2 bg-primary text-white rounded-md print-hide"
                            >
                                Print / Save PDF
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        if (activeContent?.type === "quiz") {
            const quizId = activeContent.content.id;
            const latestQuiz =
                course.sections.find((s) => s.quiz?.id === quizId)?.quiz ||
                (course.finalQuiz?.id === quizId ? course.finalQuiz : null);
            return <Quiz quiz={latestQuiz || activeContent.content} />;
        }
        if (activeContent?.type === "lesson") {
            return (
                <div>
                    {(activeContent.content.s3_video_url ||
                        activeContent.content.video_url) && (
                        <VideoPlayer
                            videoUrl={
                                activeContent.content.s3_video_url ||
                                activeContent.content.video_url
                            }
                            onVideoEnded={() =>
                                markLessonAsCompleted(activeContent.content.id)
                            }
                        />
                    )}
                    <div className="mt-4">
                        <h2 className="text-2xl font-bold">
                            {activeContent.title}
                        </h2>
                        <div className="flex items-center mt-4">
                            <img
                                className="w-10 h-10 rounded-full mr-4"
                                src={
                                    course.user.profile_image_url ||
                                    "/assets/icons/profile.svg"
                                }
                                alt={course.user.first_name}
                            />
                            <Link
                                href={`/tutors/${course.user.id}`}
                                className="text-lg font-bold"
                            >
                                {course.user.first_name} {course.user.last_name}
                            </Link>
                        </div>
                        <p className="text-gray-400 mt-4">
                            {activeContent.description}
                        </p>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-2xl font-bold">
                            {activeContent.content.title}
                        </h2>
                        <p className="text-gray-400 mt-4">
                            {activeContent.content.description}
                        </p>
                    </div>
                </div>
            );
        }

        return <div className="text-center p-8">Select an item to begin.</div>;
    };

    const renderNextButton = () => {
        const next = getNextContent();
        const buttons = [];

        const isOnLastLesson =
            activeContent?.type === "lesson" &&
            (() => {
                const allLessons = course.sections.flatMap((s) => s.lessons);
                return (
                    allLessons.length &&
                    allLessons[allLessons.length - 1].id ===
                        activeContent.content.id
                );
            })();

        const completeCourse = async () => {
            if (
                activeContent?.type === "lesson" &&
                !isLessonCompleted(activeContent.content.id)
            ) {
                await markLessonAsCompleted(activeContent.content.id);
            }
            router.post(`/courses/${course.id}/complete`);
        };

        // Allow starting final quiz if all quizzes passed and either all lessons are completed
        // or the only remaining incomplete lesson is the current one (we'll mark it on click)
        const allLessonsCompletedIfCurrentMarked = course.sections.every((s) =>
            s.lessons.every(
                (l) =>
                    isLessonCompleted(l.id) ||
                    (activeContent?.type === "lesson" &&
                        l.id === activeContent.content.id)
            )
        );
        const allQuizzesPassed = course.sections.every(
            (s) => !s.quiz || isQuizPassed(s.quiz)
        );
        const canStartFinalQuiz =
            Boolean(course.finalQuiz) &&
            allQuizzesPassed &&
            (areAllSectionsCompleted || allLessonsCompletedIfCurrentMarked);

        if (!has_reviewed_by_user) {
            buttons.push(
                <button
                    key="review"
                    onClick={() => setShowRatingModal(true)}
                    className="px-4 py-2 bg-primary text-white rounded-md"
                >
                    Review Course
                </button>
            );
        }

        // If there's a final quiz available and we're not on any quiz, prefer offering to start it
        if (!next && canStartFinalQuiz && activeContent?.type !== "quiz") {
            buttons.push(
                <button
                    key="start-final"
                    onClick={startFinalQuiz}
                    className="px-4 py-2 bg-primary text-white rounded-md"
                >
                    {(course.finalQuiz?.attempts || []).length > 0
                        ? "View Final Quiz"
                        : "Start Final Quiz"}
                </button>
            );
            return <div className="flex gap-3">{buttons}</div>;
        }

        if (!next) {
            // While on a section quiz, keep showing Next Lesson, but disable until passed
            if (
                activeContent?.type === "quiz" &&
                activeContent.content.id !== course.finalQuiz?.id
            ) {
                buttons.push(
                    <button
                        key="next"
                        onClick={handleNext}
                        disabled={
                            !isQuizPassed(
                                course.sections.find(
                                    (s) =>
                                        s.quiz?.id === activeContent.content.id
                                )?.quiz
                            )
                        }
                        title={
                            !isQuizPassed(
                                course.sections.find(
                                    (s) =>
                                        s.quiz?.id === activeContent.content.id
                                )?.quiz
                            )
                                ? "Pass the quiz to continue"
                                : undefined
                        }
                        className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next Lesson
                    </button>
                );
                return <div className="flex gap-3">{buttons}</div>;
            }
            if (!course.finalQuiz && activeContent?.type === "lesson") {
                if (course_completed) {
                    buttons.push(
                        <button
                            key="certificate"
                            onClick={() => setShowCertificate(true)}
                            className="px-4 py-2 bg-primary text-white rounded-md"
                        >
                            View Certificate
                        </button>
                    );
                } else {
                    buttons.push(
                        <button
                            key="complete"
                            onClick={completeCourse}
                            className="px-4 py-2 bg-primary text-white rounded-md"
                        >
                            Complete Course
                        </button>
                    );
                }
            } else if (course.finalQuiz && activeContent?.type !== "quiz") {
                buttons.push(
                    <button
                        key="start-final"
                        onClick={canStartFinalQuiz ? startFinalQuiz : undefined}
                        disabled={!canStartFinalQuiz}
                        title={
                            !canStartFinalQuiz
                                ? "Complete all sections to unlock"
                                : undefined
                        }
                        className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Start Final Quiz
                    </button>
                );
            } else {
                buttons.push(
                    <button
                        key="certificate"
                        onClick={() => setShowCertificate(true)}
                        className="px-4 py-2 bg-primary text-white rounded-md"
                    >
                        View Certificate
                    </button>
                );
            }
            return <div className="flex gap-3">{buttons}</div>;
        }

        let buttonText = "Next Lesson";
        if (next?.type === "quiz") {
            buttonText =
                next.content.id === course.finalQuiz?.id
                    ? "Start Final Quiz"
                    : "Start Section Quiz";
        }

        buttons.push(
            <button
                key="next"
                onClick={handleNext}
                className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                    isSubmitting ||
                    (activeContent?.type === "lesson" &&
                        (() => {
                            const idx = allLessons.findIndex(
                                (l) => l.id === activeContent.content.id
                            );
                            return !allLessons
                                .slice(0, idx)
                                .every((l) => isLessonCompleted(l.id));
                        })())
                }
                title={
                    activeContent?.type === "lesson" && !canProceedFromCurrent
                        ? "Complete previous lessons to continue"
                        : undefined
                }
            >
                {buttonText}
            </button>
        );

        return <div className="flex gap-3">{buttons}</div>;
    };

    return (
        <div>
            {showRatingModal && (
                <RatingModal
                    course={course}
                    onClose={() => setShowRatingModal(false)}
                />
            )}
            {showQuizConfirm && (
                <ConfirmationModal
                    isOpen={showQuizConfirm}
                    onClose={() => {
                        setShowQuizConfirm(false);
                        setPendingQuiz(null);
                    }}
                    onConfirm={() => {
                        if (pendingQuiz) {
                            setActiveContent({
                                type: "quiz",
                                content: pendingQuiz,
                            });
                        }
                        setShowQuizConfirm(false);
                        setPendingQuiz(null);
                    }}
                    title="Start Quiz"
                    message={`This quiz has a time limit of ${formatTime(
                        pendingQuiz?.duration_seconds || 900
                    )}. The timer starts once you press Start.`}
                    confirmText="Start"
                    cancelText="Cancel"
                />
            )}
            <Head title={course.title} />
            <div className="flex flex-col md:flex-row h-[92vh]">
                <div className="w-full md:w-1/4 bg-white dark:bg-darkPrimary border-r dark:border-dark overflow-y-auto">
                    <ul>
                        {course.sections.map((section) => (
                            <li key={section.id} className="mb-1">
                                <h3 className="text-lg font-bold p-4 flex items-center justify-between bg-white dark:bg-darkSecondary dark:text-white">
                                    {section.title}
                                    {isSectionCompleted(section) && (
                                        <CheckmarkIcon className="w-5 h-5 text-green-500" />
                                    )}
                                </h3>
                                <ul>
                                    {section.lessons.map((lesson, index) => (
                                        <li
                                            key={lesson.id}
                                            className={`p-4 flex items-center justify-between dark:text-gray-200 ${
                                                activeContent?.type ===
                                                    "lesson" &&
                                                activeContent.content.id ===
                                                    lesson.id
                                                    ? "bg-gray-200 dark:bg-gray-700"
                                                    : ""
                                            } ${
                                                isLessonLocked(lesson)
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "cursor-pointer"
                                            }`}
                                            onClick={() => {
                                                if (!isLessonLocked(lesson))
                                                    setActiveContent({
                                                        type: "lesson",
                                                        content: lesson,
                                                    });
                                            }}
                                            title={
                                                isLessonLocked(lesson)
                                                    ? "Complete previous lessons to unlock"
                                                    : undefined
                                            }
                                        >
                                            <div>
                                                Episode {index + 1}:{" "}
                                                {lesson.title}
                                            </div>
                                            {isLessonCompleted(lesson.id) && (
                                                <CheckmarkIcon className="w-5 h-5 text-green-500" />
                                            )}
                                        </li>
                                    ))}
                                    {section.quiz && (
                                        <li
                                            className={`p-4 flex items-center justify-between font-semibold text-blue-400 ${
                                                activeContent?.type ===
                                                    "quiz" &&
                                                activeContent.content.id ===
                                                    section.quiz.id
                                                    ? "bg-gray-200 dark:bg-gray-700"
                                                    : ""
                                            } ${
                                                section.lessons.every((l) =>
                                                    isLessonCompleted(l.id)
                                                )
                                                    ? "cursor-pointer"
                                                    : "opacity-50 cursor-not-allowed"
                                            }`}
                                            onClick={() => {
                                                if (
                                                    section.lessons.every((l) =>
                                                        isLessonCompleted(l.id)
                                                    )
                                                ) {
                                                    if (
                                                        (
                                                            section.quiz
                                                                .attempts || []
                                                        ).length > 0
                                                    ) {
                                                        setActiveContent({
                                                            type: "quiz",
                                                            content:
                                                                section.quiz,
                                                        });
                                                    } else {
                                                        setPendingQuiz(
                                                            section.quiz
                                                        );
                                                        setShowQuizConfirm(
                                                            true
                                                        );
                                                    }
                                                }
                                            }}
                                            title={
                                                !section.lessons.every((l) =>
                                                    isLessonCompleted(l.id)
                                                )
                                                    ? "Complete lessons in this section to unlock quiz"
                                                    : undefined
                                            }
                                        >
                                            <div>
                                                Take Quiz: {section.quiz.title}
                                            </div>
                                            {isQuizPassed(section.quiz) && (
                                                <CheckmarkIcon className="w-5 h-5 text-green-500" />
                                            )}
                                        </li>
                                    )}
                                </ul>
                            </li>
                        ))}
                        {course.finalQuiz && (
                            <li
                                title={
                                    !areAllSectionsCompleted
                                        ? "Complete all sections to unlock"
                                        : "Take the Final Quiz"
                                }
                                className={`p-4 cursor-pointer flex items-center justify-between font-bold text-purple-400 bg-purple-200 dark:bg-purple-700 ${
                                    activeContent?.type === "quiz" &&
                                    activeContent.content.id ===
                                        course.finalQuiz.id
                                        ? "bg-gray-200 dark:bg-gray-700"
                                        : ""
                                } ${
                                    !areAllSectionsCompleted
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                onClick={() => {
                                    if (areAllSectionsCompleted) {
                                        if (
                                            (course.finalQuiz?.attempts || [])
                                                .length > 0
                                        ) {
                                            setActiveContent({
                                                type: "quiz",
                                                content: course.finalQuiz,
                                            });
                                        } else {
                                            setPendingQuiz(course.finalQuiz);
                                            setShowQuizConfirm(true);
                                        }
                                    }
                                }}
                            >
                                <div className="flex items-center">
                                    {!areAllSectionsCompleted && (
                                        <LockIcon className="w-5 h-5 mr-2" />
                                    )}
                                    <div>
                                        Take Final Quiz:{" "}
                                        {course.finalQuiz.title}
                                    </div>
                                </div>
                                {isQuizPassed(course.finalQuiz) && (
                                    <CheckmarkIcon className="w-5 h-5 text-green-500" />
                                )}
                            </li>
                        )}
                    </ul>
                </div>
                <div className="w-full md:w-3/4 p-4 overflow-y-auto dark:bg-darkPrimary dark:text-white">
                    {renderContent()}
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => {
                                const prev = getPreviousLesson();
                                if (prev)
                                    setActiveContent({
                                        type: "lesson",
                                        content: prev,
                                    });
                            }}
                            disabled={!getPreviousLesson()}
                            className="px-4 py-2 bg-gray-200 text-black rounded-md disabled:opacity-50"
                        >
                            Previous Lesson
                        </button>
                        {renderNextButton()}
                    </div>
                </div>
            </div>
        </div>
    );
}

LearnCourse.layout = (page) => <Layout children={page} />;

export default LearnCourse;
