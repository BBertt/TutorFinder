import { Link } from "@inertiajs/react";
import { ThemeToggle } from "@/Components/ThemeToggle";

const GuestNavbar = ({}) => {
    const logoSrc = "/assets/logo.png";
    console.log("Logo Source:", logoSrc);
    return (
        <nav className="bg-accent shadow-sm sticky top-0 z-50 dark:bg-gray-800 dark:border-b dark:border-gray-700">
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

                    <div className="hidden md:flex items-center space-x-10 font-extrabold">
                        <Link
                            href="/courses"
                            className="text-[#3D3D3D] hover:text-[#4F6D40] dark:text-gray-300 dark:hover:text-primary"
                        >
                            Find a Course and Tutor
                        </Link>
                        <Link
                            href="/forums"
                            className="text-[#3D3D3D] hover:text-[#4F6D40] dark:text-gray-300 dark:hover:text-primary"
                        >
                            Forum
                        </Link>
                        <Link
                            href="/about"
                            className="text-[#3D3D3D] hover:text-[#4F6D40] dark:text-gray-300 dark:hover:text-primary"
                        >
                            About Us
                        </Link>

                        <ThemeToggle />

                        <Link
                            href="/login"
                            className="px-4 py-2 rounded-xl text-white bg-[#4F6D40] hover:bg-[#3D3D3D] hover:text-white dark:bg-primary dark:hover:bg-opacity-80"
                        >
                            Log In
                        </Link>

                        <Link
                            href="/register"
                            className="text-[#3D3D3D] hover:text-[#4F6D40] dark:text-gray-300 dark:hover:text-primary"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default GuestNavbar;
