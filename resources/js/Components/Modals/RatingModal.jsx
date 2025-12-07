import React from "react";
import { router } from "@inertiajs/react";
import StarRating from "@/Components/StarRating";

const RatingModal = ({
    onClose,
    postUrl,
    revieweeName,
    revieweeType,
    onSuccess,
}) => {
    const [rating, setRating] = React.useState(0);
    const [comment, setComment] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (rating > 0) {
            router.post(
                postUrl,
                { rating, comment },
                {
                    onSuccess: () => {
                        setIsSubmitting(false);
                        onClose();
                        if (onSuccess) onSuccess();
                    },
                    onError: () => {
                        setIsSubmitting(false);
                    },
                }
            );
        } else {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-darkPrimary dark:text-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
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
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Rate Your {revieweeType}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">
                            Rate the {revieweeType}: "{revieweeName}"
                        </h3>
                        <StarRating rating={rating} onRatingChange={setRating} />
                        <textarea
                            className="mt-4 p-2 block w-full border-gray-200 rounded-md shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                            rows="3"
                            placeholder={`Tell us about your experience with the ${revieweeType.toLowerCase()}...`}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
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
                            disabled={isSubmitting || rating === 0}
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

export default RatingModal;
