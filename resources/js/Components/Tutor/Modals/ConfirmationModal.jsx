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
                className="p-8 border w-full max-w-md shadow-lg rounded-lg bg-white"
            >
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-lg text-gray-600">{message}</p>
                    </div>
                    <div className="flex justify-center mt-4 space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-900 text-base font-medium rounded-md w-24 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 text-white text-base font-medium rounded-md w-24 focus:outline-none focus:ring-2 ${confirmColor} hover:bg-opacity-90`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
