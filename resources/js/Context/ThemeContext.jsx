import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const getInitialTheme = () => {
        if (typeof window !== "undefined" && window.localStorage) {
            const storedPrefs = window.localStorage.getItem("theme");
            if (typeof storedPrefs === "string") {
                return storedPrefs;
            }

            const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
            if (userMedia.matches) {
                return "dark";
            }
        }

        return "light";
    };

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove(theme === "dark" ? "light" : "dark");
        root.classList.add(theme);

        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
