import React from "react";
import { useTheme } from "@/Context/ThemeContext";

const SunIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v-2m0 19v-2M4.5 12h-2m19 0h-2M6.4 6.4l-1.4-1.4m13.99 13.99-1.4-1.4M6.4 17.6l-1.4 1.4m13.99-13.99-1.4 1.4M12 8a4 4 0 100 8 4 4 0 000-8z"
        />
    </svg>
);

const MoonIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
        />
    </svg>
);

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <button
            onClick={toggleTheme}
            className="w-7 h-7 text-gray-700 dark:text-gray-400"
            title={
                theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
            }
        >
            {theme === "light" ? (
                <MoonIcon className="w-7 h-7" />
            ) : (
                <SunIcon className="w-7 h-7" />
            )}
        </button>
    );
};

export default ThemeToggle;
