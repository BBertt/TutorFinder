import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            onClick={onClose} // Close when backdrop is clicked
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
        >
            <div
                onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to backdrop
                className="p-8 border w-96 shadow-lg rounded-md bg-white"
            >
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">Confirm Deletion</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-lg text-gray-600">
                            Are you sure you want to remove "{itemName}" from your cart?
                        </p>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                            Yes
                        </button>
                        <button
                            onClick={onClose}
                            className="ml-4 px-4 py-2 bg-gray-200 text-gray-900 text-base font-medium rounded-md w-24 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;