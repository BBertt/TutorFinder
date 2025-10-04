import { Link } from "@inertiajs/react";

const GuestNavbar = () => {
    const logoSrc = "/assets/logo.png";
    return (
        <nav className="bg-accent shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <img
                                className="h-12 w-auto"
                                src={logoSrc}
                                alt="TutorFinder Logo"
                            />
                        </Link>
                    </div>

                    {/* Menu */}
                    <div className="hidden md:flex items-center space-x-10 font-extrabold">
                        <Link
                            href="#"
                            className="text-[#3D3D3D] hover:text-[#4F6D40]"
                        >
                            Find a Course and Tutor
                        </Link>
                        <Link
                            href="#"
                            className="text-[#3D3D3D] hover:text-[#4F6D40]"
                        >
                            Forum
                        </Link>
                        <Link
                            href="/about"
                            className="text-[#3D3D3D] hover:text-[#4F6D40]"
                        >
                            About Us
                        </Link>

                        {/* Login Button */}
                        <Link
                            href="/login"
                            className="px-4 py-2 rounded-xl text-white bg-[#4F6D40] hover:bg-[#3D3D3D] hover:text-white"
                        >
                            Log In
                        </Link>

                        {/* Register Link */}
                        <Link
                            href="/register"
                            className="text-[#3D3D3D] hover:text-[#4F6D40]"
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
