import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

const AppNavbar = ({ logoSrc }) => {
    const [open, setOpen] = useState(false);
    const { auth } = usePage().props;

    return (
        <nav className="bg-accent shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <img
                                className="h-12 w-auto"
                                src={logoSrc}
                                alt="TutorFinder Logo"
                            />
                        </Link>
                    </div>

                    <div className="hidden md:block flex-1 max-w-xl mx-4">
                        <div className="relative flex items-center">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <img
                                    className="w-4 h-4"
                                    src="/assets/icons/magnifying-glass.svg"
                                    alt="search"
                                />
                            </div>
                            <input
                                id="search"
                                name="search"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-700 focus:border-green-700 sm:text-sm"
                                placeholder="Search..."
                                type="search"
                            />
                            <img
                                className="w-7 h-7"
                                src="/assets/icons/arrow-down.svg"
                                alt="search"
                            />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-10">
                        <Link
                            href="/cart"
                            className="text-secondary hover:text-primary"
                        >
                            <img
                                className="w-7 h-7"
                                src="/assets/icons/cart.svg"
                                alt="search"
                            />
                        </Link>
                        <Link
                            href="/forums"
                            className="text-secondary hover:text-primary"
                        >
                            <img
                                className="w-7 h-7"
                                src="/assets/icons/forum.svg"
                                alt="search"
                            />
                        </Link>
                        <Link
                            href="/messages"
                            className="text-secondary hover:text-primary"
                        >
                            <img
                                className="w-7 h-7"
                                src="/assets/icons/messages.svg"
                                alt="search"
                            />
                        </Link>
                        <div className="relative">
                            <div
                                onClick={() => setOpen(!open)}
                                className="cursor-pointer"
                            >
                                <img
                                    className="w-7 h-7 rounded-full"
                                    src={auth.user.profile_image_url || '/assets/icons/profile.svg'}
                                    alt="Profile"
                                />
                            </div>

                            {open && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md border border-gray-200 z-1">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-secondary hover:bg-primary hover:text-white rounded-md"
                                        onClick={() => setOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/transactions"
                                        className="block px-4 py-2 text-secondary hover:bg-primary hover:text-white rounded-md"
                                        onClick={() => setOpen(false)}
                                    >
                                        Transaction History
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="w-full text-left px-4 py-2 text-secondary hover:bg-primary hover:text-white rounded-md"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const AppFooter = ({ logoSrc }) => {
    return (
        <footer className="bg-gradient-to-r from-[#99D37C] to-[#4F6D40]">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <img
                            className="h-24 w-auto"
                            src={logoSrc}
                            alt="TutorFinder Logo"
                        />
                        <p className="text-white text-sm">
                            Pengalaman tentang tutor finder...
                        </p>
                        <p className="text-white text-sm">
                            Penjelasan tentang tutor finder...
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-white">
                            Navigation
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    Navigation Link
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    Navigation Link
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    Navigation Link
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    Navigation Link
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase opacity-0 hidden md:block">
                            Navigation
                        </h3>
                        <ul className="mt-4 space-y-2 md:mt-10">
                            <li>
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    Navigation Link
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    Navigation Link
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    Navigation Link
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-white">
                            Get in touch
                        </h3>
                        <ul className="mt-4 space-y-2 text-white">
                            <li>tutorfinder@example.com</li>
                            <li>
                                TutorFinder Address, Jl. Example, kota, negara
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-600 pt-8">
                    <p className="text-base text-white font-bold text-left">
                        &copy; 2025 TutorFinder, Inc.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default function AuthenticatedLayout({ children }) {
    const logoSrc = "/assets/logo.png";

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <AppNavbar logoSrc={logoSrc} />
            <main className="flex-grow">{children}</main>
            <AppFooter logoSrc={logoSrc} />
        </div>
    );
}
