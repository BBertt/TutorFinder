import React, { useState, useEffect } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import GuestNavbar from "@/Components/Landing/GuestNavbar";
import { ThemeToggle } from "@/Components/ThemeToggle";
import SuccessModal from "@/Components/Modals/SuccessModal";
import ErrorModal from "@/Components/Modals/ErrorModal";

const AppNavbar = ({ logoSrc }) => {
    const { categories, auth, filters } = usePage().props;
    const { url } = usePage();

    const [open, setOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const isForumsPage = url.startsWith("/forums");

    const isTutor = auth.user?.role_id === 2;

    const { data, setData, get } = useForm({
        search: filters?.search || "",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const targetUrl = isForumsPage
            ? route("forums.index")
            : route("courses.index");
        get(targetUrl, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const placeholder = isForumsPage ? "Search Forums..." : "Search Courses...";

    const showCategories = !isForumsPage && !isTutor;

    return (
        <nav className="bg-accent shadow-sm sticky top-0 z-50 dark:bg-darkSecondary dark:border-b dark:border-dark">
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
                        {!isTutor && (
                            <form
                                className="relative flex items-center"
                                onSubmit={handleSearch}
                            >
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <img
                                        className="w-4 h-4 dark:invert"
                                        src="/assets/icons/magnifying-glass.svg"
                                        alt="Search"
                                    />
                                </div>
                                <input
                                    id="search"
                                    name="search"
                                    value={data.search}
                                    onChange={(e) =>
                                        setData("search", e.target.value)
                                    }
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 sm:text-sm dark:bg-darkSecondary dark:border-g dark:text-white dark:placeholder-gray-400"
                                    placeholder={placeholder}
                                    type="Search"
                                />
                                {showCategories && (
                                    <div className="relative ml-2">
                                        <img
                                            className={`w-7 h-7 cursor-pointer ${
                                                !dropdown && "dark:invert"
                                            }`}
                                            src={
                                                dropdown
                                                    ? "/assets/icons/arrow-down-primary.svg"
                                                    : "/assets/icons/arrow-down-secondary.svg"
                                            }
                                            alt="Filter"
                                            onClick={() =>
                                                setDropdown(!dropdown)
                                            }
                                        />
                                        {dropdown && (
                                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border dark:bg-darkSecondary dark:border-dark z-20">
                                                {categories.map((category) => (
                                                    <Link
                                                        key={category.id}
                                                        href={`/courses?category=${category.id}`}
                                                        className="block w-full text-left px-4 py-2 text-sm text-secondary hover:bg-gray-200 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                                        onClick={() =>
                                                            setDropdown(false)
                                                        }
                                                    >
                                                        {category.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </form>
                        )}
                    </div>

                    <div className="hidden md:flex items-center space-x-10">
                        {!isTutor && (
                            <Link
                                href="/cart"
                                className="flex gap-2 items-center"
                            >
                                <img
                                    className={`w-7 h-7 ${
                                        !url.startsWith("/cart") &&
                                        "dark:invert"
                                    }`}
                                    src={
                                        url.startsWith("/cart")
                                            ? "/assets/icons/cart-primary.svg"
                                            : "/assets/icons/cart-secondary.svg"
                                    }
                                    alt="Cart"
                                />
                                <span className="font-medium text-gray-700 dark:text-gray-200">
                                    Cart
                                </span>
                            </Link>
                        )}

                        <Link
                            href={
                                isTutor
                                    ? route("tutor.courses.index")
                                    : route("courses.index")
                            }
                            className="flex gap-2 items-center"
                        >
                            <img
                                className={`w-7 h-7 ${
                                    !url.startsWith("/courses") &&
                                    !url.startsWith("/tutor/courses") &&
                                    "dark:invert"
                                }`}
                                src={
                                    url.startsWith("/courses") ||
                                    url.startsWith("/tutor/courses")
                                        ? "/assets/icons/course-primary.svg"
                                        : "/assets/icons/course-secondary.svg"
                                }
                                alt="Courses"
                            />
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                                {isTutor ? "Your Courses" : "Courses"}
                            </span>
                        </Link>

                        <Link
                            href="/forums"
                            className="flex gap-2 items-center"
                        >
                            <img
                                className={`w-7 h-7 ${
                                    !url.startsWith("/forums") && "dark:invert"
                                }`}
                                src={
                                    url.startsWith("/forums")
                                        ? "/assets/icons/forum-primary.svg"
                                        : "/assets/icons/forum-secondary.svg"
                                }
                                alt="Forums"
                            />
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                                Forum
                            </span>
                        </Link>

                        <Link href="/chat" className="flex gap-2 items-center">
                            <img
                                className={`w-7 h-7 ${
                                    !url.startsWith("/chat") && "dark:invert"
                                }`}
                                src={
                                    url.startsWith("/chat")
                                        ? "/assets/icons/messages-primary.svg"
                                        : "/assets/icons/messages-secondary.svg"
                                }
                                alt="Messages"
                            />
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                                Chat
                            </span>
                        </Link>

                        <ThemeToggle />

                        <div className="relative">
                            <div
                                onClick={() => setOpen(!open)}
                                className="cursor-pointer"
                            >
                                <img
                                    className="w-7 h-7 rounded-full object-cover"
                                    src={
                                        auth.user.profile_image_url ||
                                        "/assets/icons/profile.svg"
                                    }
                                    alt="Profile"
                                />
                            </div>

                            {open && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md border border-gray-200 z-1 dark:bg-darkSecondary dark:border-dark">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-secondary hover:bg-gray-200 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                        onClick={() => setOpen(false)}
                                    >
                                        Profile
                                    </Link>

                                    {!isTutor && (
                                        <Link
                                            href="/purchased-courses"
                                            className="block px-4 py-2 text-secondary hover:bg-gray-200 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                            onClick={() => setOpen(false)}
                                        >
                                            Purchased Courses
                                        </Link>
                                    )}
                                    <Link
                                        href="/transactions"
                                        className="block px-4 py-2 text-secondary hover:bg-gray-200 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                        onClick={() => setOpen(false)}
                                    >
                                        Transaction History
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="w-full text-left px-4 py-2 text-secondary hover:bg-gray-200 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
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
        <footer className="bg-gradient-to-r from-[#99D37C] to-[#4F6D40] dark:from-gray-800 dark:to-gray-900">
            <div className="container mx-auto py-12 px-4 justify-between sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="space-y-4">
                        <img
                            className="h-24 w-auto"
                            src={logoSrc}
                            alt="TutorFinder Logo"
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-white">
                            Navigation
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/courses"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    Courses
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/forums"
                                    className="text-base text-white hover:text-gray-300 font-bold"
                                >
                                    Forums
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

export default function Layout({ children, showFooter = true }) {
    const logoSrc = "/assets/logo.png";
    const { auth, flash } = usePage().props;

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (flash.success) {
            setSuccessMessage(flash.success);
            setIsSuccessModalOpen(true);
        }

        if (flash.error) {
            setErrorMessage(flash.error);
            setIsErrorModalOpen(true);
        }
    }, [flash]);

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-darkPrimary dark:text-white">
            {auth.user ? <AppNavbar logoSrc={logoSrc} /> : <GuestNavbar />}
            <main className="flex-grow">{children}</main>
            {showFooter && <AppFooter logoSrc={logoSrc} />}

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Success!"
                message={successMessage}
            />

            <ErrorModal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title="Error!"
                message={errorMessage}
            />
        </div>
    );
}
