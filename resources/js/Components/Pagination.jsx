import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    return (
        <div className="flex justify-center items-center space-x-1 mt-8">
            {links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <div
                            key={index}
                            className="px-4 py-2 text-sm text-gray-400 dark:text-gray-600"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }
                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-4 py-2 text-sm rounded-md ${
                            link.active
                                ? "bg-primary text-white font-bold"
                                : "text-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveScroll
                    />
                );
            })}
        </div>
    );
}
