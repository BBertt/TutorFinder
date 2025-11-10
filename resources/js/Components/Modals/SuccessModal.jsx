import React from "react";

const CheckIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={3}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
        />
    </svg>
);

export default function SuccessModal({
    isOpen,
    onClose,
    title = "Success!",
    message,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="p-8 border w-full max-w-md shadow-lg rounded-lg bg-white dark:bg-darkSecondary dark:border-dark"
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-800">
                        <CheckIcon className="h-8 w-8 text-green-600 dark:text-green-300" />
                    </div>

                    <h3 className="mt-5 text-2xl font-bold text-black dark:text-white">
                        {title}
                    </h3>

                    <div className="mt-2 px-7 py-3">
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                            {message}
                        </p>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-primary text-white text-base font-medium rounded-lg hover:bg-opacity-80 dark:hover:bg-opacity-80 focus:outline-none"
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
