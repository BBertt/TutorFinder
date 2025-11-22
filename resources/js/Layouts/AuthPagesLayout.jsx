const AuthPagesLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex">
            <div className="w-2/3 flex items-center justify-center bg-[#F5F5F5]">
                <img src="/assets/images/tutor-finder.svg" alt="TutorFinder" />
            </div>

            <div className="w-1/3 flex items-center justify-center bg-primary text-white">
                {children}
            </div>
        </div>
    );
};

export default AuthPagesLayout;
