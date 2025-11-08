import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

const Quiz = ({ quiz, onComplete, results: initialResults }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState(initialResults);

    useEffect(() => {
        if (initialResults) {
            setShowResults(true);
            setResults(initialResults);
        }
    }, [initialResults]);

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
        router.post(`/quizzes/${quiz.id}/submit`, {
            answers: selectedAnswers,
        }, {
            onSuccess: () => {
                onComplete();
            }
        });
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setShowResults(false);
        setResults(null);
    };

    if (showResults && results) {
        return (
            <div className="p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4 text-center">Quiz Results</h2>
                <p className="text-xl text-center mb-6">You scored {results.score} out of {results.total}</p>
                <div className="flex justify-center">
                    <button
                        onClick={handleRetry}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Retry Quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
            <p className="mb-6 text-gray-600">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>

            <div>
                <h3 className="text-xl font-semibold mb-4">{quiz.questions[currentQuestionIndex].question}</h3>
                <div className="space-y-3">
                    {quiz.questions[currentQuestionIndex].options.map(option => (
                        <div
                            key={option.id}
                            onClick={() => handleAnswerSelect(option.id)}
                            className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-100 ${selectedAnswers[quiz.questions[currentQuestionIndex].id] === option.id ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                        >
                            {option.option}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <div>
                    {quiz.attempts && quiz.attempts.length > 0 && (
                        <div>
                            <h4 className="font-bold">Previous Attempts:</h4>
                            <ul>
                                {quiz.attempts.map(attempt => (
                                    <li key={attempt.id}>Score: {attempt.score}/{quiz.questions.length}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswers[quiz.questions[currentQuestionIndex].id]}
                        className="px-6 py-2 bg-primary text-white rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedAnswers[quiz.questions[currentQuestionIndex].id]}
                        className="px-6 py-2 bg-green-500 text-white rounded-md disabled:opacity-50"
                    >
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
};

export default Quiz;
