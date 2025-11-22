import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";
const Quiz = ({ quiz }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [view, setView] = useState("question"); // 'question', 'result', 'review'
    const QUIZ_DURATION_SECONDS = quiz.duration_seconds || 900; // per-quiz duration (default 15m)
    const [remainingSeconds, setRemainingSeconds] = useState(
        QUIZ_DURATION_SECONDS
    );

    useEffect(() => {
        const latestAttempt =
            quiz.attempts.length > 0
                ? quiz.attempts[quiz.attempts.length - 1]
                : null;
        if (latestAttempt) {
            setView("result");
        } else {
            setView("question");
            setRemainingSeconds(QUIZ_DURATION_SECONDS); // reset timer on mount/new attempt
        }
    }, [quiz.id, quiz.attempts?.length]);

    const handleAnswerSelect = (optionId) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [quiz.questions[currentQuestionIndex].id]: optionId,
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleSubmit = () => {
        router.post(
            `/quizzes/${quiz.id}/submit`,
            {
                answers: selectedAnswers,
            },
            {
                preserveScroll: true,
                onStart: () => setView("submitting"),
                onSuccess: () => setView("result"),
                onError: () => setView("question"),
            }
        );
    };

    // Countdown timer
    useEffect(() => {
        if (view === "question") {
            const interval = setInterval(() => {
                setRemainingSeconds((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        handleSubmit(); // auto-submit on timeout
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [view]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60)
            .toString()
            .padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const [showRetryConfirm, setShowRetryConfirm] = useState(false);

    const handleRetry = () => {
        // Show confirmation modal again on retry
        setShowRetryConfirm(true);
    };

    const confirmRetry = () => {
        setShowRetryConfirm(false);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setRemainingSeconds(QUIZ_DURATION_SECONDS); // reset timer
        setView("question");
    };

    const cancelRetry = () => setShowRetryConfirm(false);

    const handleReview = () => setView("review");

    if (view === "submitting") {
        return (
            <div className="p-8 bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Submitting Quiz...</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Please wait while we process your answers.
                </p>
            </div>
        );
    }

    if (view === "question") {
        return (
            <div className="p-8 bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Question {currentQuestionIndex + 1} of{" "}
                    {quiz.questions.length}
                </p>
                <p className="mb-6 font-semibold text-red-500 dark:text-red-400">
                    Time Remaining: {formatTime(remainingSeconds)}
                </p>
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        {quiz.questions[currentQuestionIndex].question}
                    </h3>
                    <div className="space-y-3">
                        {quiz.questions[currentQuestionIndex].options.map(
                            (option) => (
                                <div
                                    key={option.id}
                                    onClick={() =>
                                        handleAnswerSelect(option.id)
                                    }
                                    className={`p-4 border rounded-lg cursor-pointer hover:bg-accent dark:hover:bg-gray-800 dark:text-gray-100 ${
                                        selectedAnswers[
                                            quiz.questions[currentQuestionIndex]
                                                .id
                                        ] === option.id
                                            ? "bg-accent dark:bg-gray-800 border-primary dark:border-primary"
                                            : "border-gray-300 dark:border-gray-700"
                                    }`}
                                >
                                    {option.option}
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    {currentQuestionIndex < quiz.questions.length - 1 ? (
                        <button
                            onClick={handleNextQuestion}
                            disabled={
                                !selectedAnswers[
                                    quiz.questions[currentQuestionIndex].id
                                ]
                            }
                            className="px-6 py-2 bg-primary text-white rounded-md disabled:opacity-50"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={
                                !selectedAnswers[
                                    quiz.questions[currentQuestionIndex].id
                                ]
                            }
                            className="px-6 py-2 bg-primary text-white rounded-md disabled:opacity-50"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (showRetryConfirm) {
        return (
            <ConfirmationModal
                isOpen={true}
                onClose={cancelRetry}
                onConfirm={confirmRetry}
                title="Retry Quiz"
                message={`This quiz has a time limit of ${formatTime(
                    QUIZ_DURATION_SECONDS
                )}. The timer starts once you press Start. Retrying will reset your previous answers.`}
                confirmText="Start"
                cancelText="Cancel"
            />
        );
    }

    if (view === "result") {
        const latestAttempt = quiz.attempts[quiz.attempts.length - 1];
        if (!latestAttempt) return null; // Should not happen if view is 'result'

        const percentage =
            (latestAttempt.score / latestAttempt.total_questions) * 100;
        const passed = percentage >= 80;
        const isPerfectScore = percentage === 100;
        const canRetry = !passed || !isPerfectScore;

        return (
            <div className="p-8 bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
                <p
                    className={`text-xl mb-2 ${
                        passed ? "text-primary" : "text-red-800"
                    }`}
                >
                    You scored {latestAttempt.score} out of{" "}
                    {latestAttempt.total_questions} ({percentage.toFixed(0)}%)
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {passed
                        ? "Congratulations, you've passed!"
                        : "You have not met the passing score of 80%."}
                </p>
                <div className="flex justify-center gap-4">
                    {canRetry ? (
                        <button
                            onClick={handleRetry}
                            className="px-6 py-2 bg-primary text-white rounded-md"
                        >
                            Retry Quiz
                        </button>
                    ) : (
                        <button
                            onClick={handleReview}
                            className="px-6 py-2 bg-secondary text-white rounded-md"
                        >
                            Review Answers
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (view === "review") {
        return (
            <div className="p-8 bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center">
                    Review Answers
                </h2>
                <div className="space-y-6">
                    {quiz.questions.map((question, index) => (
                        <div
                            key={question.id}
                            className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-100"
                        >
                            <h3 className="font-semibold text-lg">
                                {index + 1}. {question.question}
                            </h3>
                            <ul>
                                {question.options.map((option) => (
                                    <li
                                        key={option.id}
                                        className={`mt-2 p-2 rounded border ${
                                            option.is_correct
                                                ? "bg-accent dark:bg-gray-800 font-bold text-primary border-primary dark:border-primary"
                                                : "border-transparent dark:border-gray-700 dark:text-gray-200"
                                        }`}
                                    >
                                        {option.option}{" "}
                                        {option.is_correct
                                            ? "(Correct Answer)"
                                            : ""}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setView("result")}
                        className="px-6 py-2 bg-secondary text-white rounded-md"
                    >
                        Back to Results
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default Quiz;
