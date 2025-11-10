import React from "react";

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Yes",
    cancelText = "No",
    confirmColor = "bg-primary",
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
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                        {title}
                    </h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-lg text-gray-400">{message}</p>
                    </div>
                    <div className="flex justify-center mt-4 space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-base font-medium rounded-md w-24 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 text-white text-base font-medium rounded-md w-24 ${confirmColor} hover:bg-opacity-80 dark:hover:bg-opacity-80`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
