import React from "react";
import { Link } from "@inertiajs/react";

const SearchIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {" "}
        <circle cx="11" cy="11" r="8"></circle>{" "}
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>{" "}
    </svg>
);

const BellIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {" "}
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>{" "}
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>{" "}
    </svg>
);

const MessageSquareIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {" "}
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>{" "}
    </svg>
);

const ShopIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {" "}
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path d="M2 7h20" />
        <path d="M22 7H12v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7H2" />
    </svg>
);

const FriendsIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const UserIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {" "}
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>{" "}
        <circle cx="12" cy="7" r="4"></circle>{" "}
    </svg>
);

const AppNavbar = ({ logoSrc }) => {
    return (
        <nav className="bg-[#f5f5f5] shadow-sm sticky top-0 z-50">
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
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="search"
                                name="search"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-700 focus:border-green-700 sm:text-sm"
                                placeholder="Search..."
                                type="search"
                            />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/shop"
                            className="text-gray-500 hover:text-green-800"
                        >
                            <ShopIcon className="h-6 w-6" />
                        </Link>
                        <Link
                            href="/friends"
                            className="text-gray-500 hover:text-green-800"
                        >
                            <FriendsIcon className="h-6 w-6" />
                        </Link>
                        <Link
                            href="/messages"
                            className="text-gray-500 hover:text-green-800"
                        >
                            <MessageSquareIcon className="h-6 w-6" />
                        </Link>
                        <Link
                            href="/notifications"
                            className="text-gray-500 hover:text-green-800"
                        >
                            <BellIcon className="h-6 w-6" />
                        </Link>
                        <Link
                            href="/profile"
                            className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-green-200 hover:text-green-800"
                        >
                            <UserIcon className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const AppFooter = ({ logoSrc }) => {
    return (
        <footer className="bg-[#4f6d40]">
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
                                {" "}
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    {" "}
                                    Navigation Link{" "}
                                </Link>{" "}
                            </li>
                            <li>
                                {" "}
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    {" "}
                                    Navigation Link{" "}
                                </Link>{" "}
                            </li>
                            <li>
                                {" "}
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    {" "}
                                    Navigation Link{" "}
                                </Link>{" "}
                            </li>
                            <li>
                                {" "}
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    {" "}
                                    Navigation Link{" "}
                                </Link>{" "}
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase opacity-0 hidden md:block">
                            Navigation
                        </h3>
                        <ul className="mt-4 space-y-2 md:mt-10">
                            <li>
                                {" "}
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    {" "}
                                    Navigation Link{" "}
                                </Link>{" "}
                            </li>
                            <li>
                                {" "}
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    {" "}
                                    Navigation Link{" "}
                                </Link>{" "}
                            </li>
                            <li>
                                {" "}
                                <Link
                                    href="#"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    {" "}
                                    Navigation Link{" "}
                                </Link>{" "}
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
                    <p className="text-base text-white font-bold text-center">
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
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <AppNavbar logoSrc={logoSrc} />
            <main className="flex-grow">{children}</main>
            <AppFooter logoSrc={logoSrc} />
        </div>
    );
}
