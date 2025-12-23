import { Link, usePage, useForm } from "@inertiajs/react";
import GuestNavbar from "@/Components/Landing/GuestNavbar";

const Landing = () => {
    const { reviews } = usePage().props;
    const { data, setData, get } = useForm({
        search: "",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get("/courses");
        setData("search", "");
    };

    return (
        <div className="flex flex-col">
            <GuestNavbar />
            <section className="bg-primary text-white py-16 flex flex-col dark:bg-darkSecondary dark:border-dark">
                <div className="flex justify-between items-center w-full">
                    <img
                        className="w-40 h-40 object-cover"
                        src="/assets/images/landing/ellipse.png"
                    />
                    <div className="flex-1 max-w-2xl flex flex-col gap-6">
                        <h1 className="text-4xl font-extrabold">
                            Find the Right Course and Tutor For You!
                        </h1>
                        <form className="flex" onSubmit={handleSearch}>
                            <input
                                id="search"
                                name="search"
                                type="Search"
                                value={data.search}
                                onChange={(e) => {
                                    setData("search", e.target.value);
                                }}
                                placeholder="What would you like to learn?"
                                className="px-4 py-2 text-black rounded-lg w-full"
                            />
                            <button
                                type="submit"
                                className="bg-secondary px-6 py-2 rounded-lg font-bold dark:bg-primary dark:hover:bg-opacity-80"
                            >
                                Search
                            </button>
                        </form>
                        <div className="mt-6 flex flex-col items-center">
                            <p className="font-bold text-lg">
                                Come Teach with us
                            </p>
                            <Link
                                href="/tutor/register"
                                className="bg-secondary text-white hover:text-white hover:bg-black px-6 py-2 rounded-full font-bold mt-2 dark:bg-primary dark:hover:bg-opacity-80 dark:text-white"
                            >
                                Register as a Tutor
                            </Link>
                        </div>
                    </div>
                    <img
                        className="w-40 h-40 object-cover"
                        src="/assets/images/landing/rectangle.png"
                    />
                </div>
            </section>

            {/* Steps Section */}
            <section className="px-8 py-16 text-center dark:bg-darkPrimary dark:text-white">
                <h2 className="text-secondary text-3xl font-extrabold mb-12 dark:text-white">
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
                            className="flex flex-col flex-wrap flex-1 gap-3 max-w-xs p-6 rounded-lg shadow-md border dark:bg-darkSecondary dark:border-dark"
                        >
                            <h3 className="text-xl font-bold">
                                Step {idx + 1}
                            </h3>
                            <p>{text}</p>
                            <img
                                className="w-32 h-32 mx-auto object-cover"
                                src="/assets/images/landing/books.png"
                                alt="Books"
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
                <div className="flex justify-between gap-8">
                    {reviews.map((tutor) => (
                        <Link
                            key={tutor.id}
                            href={`/tutors/${tutor.id}`}
                            className="flex-1"
                        >
                            <div className="bg-secondary rounded-xl p-6 flex gap-4 items-center dark:bg-darkSecondary dark:border-dark">
                                <img
                                    className="w-24 h-24 rounded-full"
                                    src={
                                        tutor?.profile_image_url
                                            ? tutor?.profile_image_url
                                            : "/assets/icons/profile.svg"
                                    }
                                    alt="Profile"
                                />
                                <div>
                                    <h3 className="font-bold">
                                        {tutor.first_name} {tutor.last_name}
                                    </h3>
                                    <p className="text-sm mt-2">{tutor.bio}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Landing;
