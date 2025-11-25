import React from "react";

// Inline SVG for the X icon
const XIcon = (props) => (
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
            d="M6 18L18 6M6 6l12 12"
        />
    </svg>
);

export default function ErrorModal({
    isOpen,
    onClose,
    title = "Error",
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
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900">
                        <XIcon className="h-8 w-8 text-red-600 dark:text-red-300" />
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
                            className="px-8 py-3 bg-red-600 text-white text-base font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
