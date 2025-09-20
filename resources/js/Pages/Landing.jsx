import { Link } from "@inertiajs/react";

const GuestNavbar = () => {
    const logoSrc = "/assets/logo.svg";
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
                    <div className="hidden md:flex items-center space-x-6 font-extrabold">
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
                            How It Works?
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
                            className="px-4 py-2 rounded-full text-white bg-[#4F6D40] hover:bg-[#3D3D3D] hover:text-white"
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

const Landing = () => {
    return (
        <div className="flex flex-col">
            <GuestNavbar />
            <section className="bg-primary text-white py-16 flex flex-col items-center justify-between">
                <div className="flex justify-between items-center w-full">
                    <img
                        className="w-40 h-40 object-cover"
                        src="/images/landing/ellipse.png"
                    />
                    <div className="flex-1 max-w-2xl flex flex-col gap-6">
                        <h1 className="text-4xl font-extrabold">
                            Find the Right Course and Tutor For You!
                        </h1>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="What would you like to learn?"
                                className="px-4 py-2 text-black rounded-lg w-full"
                            />
                            <button className="bg-[#3D3D3D] px-6 py-2 rounded-lg font-bold">
                                Search
                            </button>
                        </div>
                        <div className="mt-6 flex flex-col items-center">
                            <p className="font-bold text-lg">
                                Come Teach with us
                            </p>
                            <Link
                                href="/tutor/register"
                                className="bg-[#3D3D3D] text-white hover:bg-white hover:text-[#4F6D40] px-6 py-2 rounded-full font-bold mt-2"
                            >
                                Register as a Tutor
                            </Link>
                        </div>
                    </div>
                    <img
                        className="w-40 h-40 object-cover"
                        src="/images/landing/rectangle.png"
                    />
                </div>
            </section>

            {/* Steps Section */}
            <section className="px-8 py-16 text-center">
                <h2 className="text-secondary text-3xl font-extrabold mb-12">
                    Finding a Subject is Simple
                </h2>
                <div className="flex justify-evenly items-center gap-8">
                    {[
                        "Find the subject you want to learn",
                        "Choose the subject",
                        "Consult with the tutor",
                    ].map((text, idx) => (
                        <div
                            key={idx}
                            className="flex-1 flex flex-col gap-3 max-w-xs p-6 rounded-lg shadow-md border"
                        >
                            <h3 className="text-xl font-bold">
                                Step {idx + 1}
                            </h3>
                            <p>{text}</p>
                            <img
                                className="w-32 h-32 mx-auto object-cover"
                                src="/images/landing/books.png"
                                alt="books"
                            />
                        </div>
                    ))}
                </div>
                <p className="mt-12 font-bold">What are you waiting for?</p>
                <span className="font-extrabold">Sign Up Now!</span>
            </section>

            {/* Top Tutor Section */}
            <section className="bg-primary text-white px-8 py-16">
                <h2 className="text-3xl font-extrabold text-center mb-12">
                    Top Tutor of the Week
                </h2>
                <div className="flex justify-evenly items-center gap-8">
                    <div className="bg-secondary rounded-xl p-6 flex gap-4 items-center">
                        <div className="w-24 h-24rounded-full"></div>
                        <div>
                            <h3 className="font-bold">Tutor Name</h3>
                            <p className="text-sm mt-2">
                                “Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit...”
                            </p>
                        </div>
                    </div>
                    <div className="bg-secondary rounded-xl p-6 flex gap-4 items-center">
                        <div className="w-24 h-24rounded-full"></div>
                        <div>
                            <h3 className="font-bold">Tutor Name</h3>
                            <p className="text-sm mt-2">
                                “Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit...”
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
