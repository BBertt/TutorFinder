import React, { useState } from "react";
import { router } from "@inertiajs/react";

const SortIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
        />
    </svg>
);

export default function SortDropdown({ currentSort, onSortChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const options = [
        { key: "newest", label: "Newest first" },
        { key: "oldest", label: "Oldest first" },
        { key: "top_likes", label: "Top comments" },
    ];

    const currentLabel =
        options.find((opt) => opt.key === currentSort)?.label || "Sort by";

    const selectOption = (key) => {
        onSortChange(key);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
                <SortIcon className="w-6 h-6" />
                <span>Sort by</span>
            </button>

            {isOpen && (
                <>
                    <div
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-10"
                    ></div>

                    <div className="absolute z-20 -ml-4 mt-2 w-48 bg-white rounded-lg shadow-xl border">
                        {options.map((option) => (
                            <button
                                key={option.key}
                                onClick={() => selectOption(option.key)}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                    option.key === currentSort
                                        ? "font-bold text-gray-900"
                                        : "text-gray-700"
                                } hover:bg-gray-100`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
