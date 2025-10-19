import GuestNavbar from "@/Components/Landing/GuestNavbar";

const About = () => {
    return (
        <div className="flex flex-col">
            <GuestNavbar />

            {/* Hero Section */}
            <section className="bg-primary text-white py-16 flex flex-col items-center text-center">
                <h1 className="text-4xl font-extrabold mb-4">
                    About TutorFinder
                </h1>
                <p className="max-w-2xl text-lg">
                    TutorFinder is a modern web-based application designed to
                    make it easy for users to find the right personalized
                    courses and tutors. Having previously used similar learning
                    platforms, we noticed a lack of interaction between learners
                    and tutors. That's why we decided to create features like
                    forums and chat, not only for communication between users
                    and tutors, but also among users themselves, making the
                    learning experience more enjoyable.
                </p>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-secondary text-center text-white">
                <h2 className="text-4xl font-extrabold mb-4">Our Mission</h2>
                <div className="flex justify-evenly items-center gap-8">
                    {[
                        "Provide flexibility based on user preferences",
                        "Help users find the right course and tutor",
                        "Encourage interactive learning",
                    ].map((text, idx) => (
                        <div
                            key={idx}
                            className="flex-1 flex flex-col gap-3 max-w-xs p-6 rounded-lg shadow-md border bg-white"
                        >
                            <h3 className="text-xl font-bold text-black">
                                {text}
                            </h3>
                            <img
                                className="w-32 h-32 mx-auto object-cover"
                                src="/assets/images/landing/books.png"
                                alt="Books"
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
