import React from "react";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/Components/UI/RadioGroup";

export default function QuizEditor({ value, onChange }) {
    const quiz = value || { title: "", questions: [] };

    const setQuiz = (updater) => {
        const next = typeof updater === "function" ? updater(quiz) : updater;
        onChange(next);
    };

    const addQuestion = () => {
        setQuiz({
            ...quiz,
            questions: [
                ...(quiz.questions || []),
                {
                    id: `temp_question_${Date.now()}`,
                    question: "",
                    options: [{ id: `temp_option_${Date.now()}`, option: "", is_correct: true }],
                },
            ],
        });
    };

    const removeQuestion = (qi) => {
        setQuiz({
            ...quiz,
            questions: quiz.questions.filter((_, i) => i !== qi),
        });
    };

    const updateQuestionText = (qi, text) => {
        setQuiz({
            ...quiz,
            questions: quiz.questions.map((q, i) =>
                i === qi ? { ...q, question: text } : q
            ),
        });
    };

    const addOption = (qi) => {
        setQuiz({
            ...quiz,
            questions: quiz.questions.map((q, i) =>
                i === qi
                    ? {
                        ...q,
                        options: [
                            ...(q.options || []),
                            { id: `temp_option_${Date.now()}`, option: "", is_correct: false },
                        ],
                    }
                    : q
            ),
        });
    };

    const removeOption = (qi, oi) => {
        setQuiz({
            ...quiz,
            questions: quiz.questions.map((q, i) =>
                i === qi
                    ? { ...q, options: q.options.filter((_, j) => j !== oi) }
                    : q
            ),
        });
    };

    const updateOptionText = (qi, oi, text) => {
        setQuiz({
            ...quiz,
            questions: quiz.questions.map((q, i) =>
                i === qi
                    ? {
                        ...q,
                        options: q.options.map((o, j) =>
                            j === oi ? { ...o, option: text } : o
                        ),
                    }
                    : q
            ),
        });
    };

    const setCorrect = (qi, oi) => {
        setQuiz({
            ...quiz,
            questions: quiz.questions.map((q, i) =>
                i === qi
                    ? {
                        ...q,
                        options: q.options.map((o, j) => ({
                            ...o,
                            is_correct: j === oi,
                        })),
                    }
                    : q
            ),
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold">Quiz Questions</h3>
                <button
                    type="button"
                    onClick={addQuestion}
                    className="px-2 py-1 text-sm bg-primary text-white rounded-md"
                >
                    + Add Question
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-sm font-medium dark:text-white">
                        Quiz Duration (minutes)
                    </label>
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={Math.max(
                            1,
                            Math.round((quiz.duration_seconds || 900) / 60)
                        )}
                        onChange={(e) => {
                            const mins = parseInt(e.target.value || "0", 10);
                            setQuiz({
                                ...quiz,
                                duration_seconds: Math.max(1, mins) * 60,
                            });
                        }}
                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Students must finish within this time.
                    </p>
                </div>
            </div>
            {(quiz.questions || []).length === 0 && (
                <p className="text-sm text-gray-400">No questions yet.</p>
            )}
            {(quiz.questions || []).map((q, qi) => {
                const correctOption = (q.options || []).find(o => o.is_correct);
                const radioGroupValue = correctOption ? String(correctOption.id) : undefined;

                const onRadioValueChange = (newSelectedOptionId) => {
                    const newOptionIndex = (q.options || []).findIndex(o => String(o.id) === newSelectedOptionId);
                    if (newOptionIndex !== -1) {
                        setCorrect(qi, newOptionIndex);
                    }
                };

                return (
                    <div
                        key={q.id || qi}
                        className="border dark:border-dark rounded-md p-3 space-y-2"
                    >
                        <div className="flex gap-2 items-start">
                            <input
                                type="text"
                                value={q.question || ""}
                                onChange={(e) =>
                                    updateQuestionText(qi, e.target.value)
                                }
                                placeholder={`Question ${qi + 1}`}
                                className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => removeQuestion(qi)}
                                className="text-red-500 text-sm font-semibold"
                            >
                                Remove
                            </button>
                        </div>

                        <RadioGroup
                            value={radioGroupValue}
                            onValueChange={onRadioValueChange}
                            className="pl-2 space-y-2"
                        >
                            {(q.options || []).map((o, oi) => (
                                <div key={o.id || oi} className="flex items-center gap-2">
                                    <RadioGroupItem value={String(o.id)} id={String(o.id)} />
                                    <input
                                        type="text"
                                        value={o.option || ""}
                                        onChange={(e) =>
                                            updateOptionText(qi, oi, e.target.value)
                                        }
                                        placeholder={`Option ${oi + 1}`}
                                        className="mt-1 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeOption(qi, oi)}
                                        className="text-xs text-red-500 font-semibold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </RadioGroup>
                        <div className="pl-2">
                            <button
                                type="button"
                                onClick={() => addOption(qi)}
                                className="text-sm text-primary font-semibold"
                            >
                                + Add Option
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
