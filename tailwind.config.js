import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                poppins: ["Poppins", "sans-serif"],
            },
            colors: {
                primary: "#4F6D40",
                secondary: "#3D3D3D",
                accent: "#F5F5F5",
            },
            backgroundColor: {
                primary: "#4F6D40",
                secondary: "#3D3D3D",
                accent: "#F5F5F5",
            },
        },
    },

    plugins: [forms, aspectRatio],
};
