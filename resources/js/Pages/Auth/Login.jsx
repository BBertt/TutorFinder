import AuthPagesLayout from "@/Layouts/AuthPagesLayout";
import { useForm, Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import SuccessModal from "@/Components/Modals/SuccessModal";

const Login = () => {
    const { flash, status } = usePage().props;

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: "",
        password: "",
    });

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // state modal sukses
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // tampilkan modal jika ada flash.success atau verification link sent
    useEffect(() => {
        if (flash.success || status === "verification-link-sent") {
            setSuccessMessage(
                flash.success ||
                    "A new verification link has been sent to your email."
            );
            setIsSuccessModalOpen(true);
        }
    }, [flash, status]);

    const submit = (e) => {
        e.preventDefault();
        post("/login");
    };

    const resendVerification = (e) => {
        e.preventDefault();
        if (!data.email) return;
        post(route("verification.resend"), { preserveScroll: true });
    };

    const needsVerification = (errors.email || "")
        .toLowerCase()
        .includes("verify your email");

    return (
        <div className="w-full max-w-xs flex flex-col gap-6">
            {/* Success Modal */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Success!"
                message={successMessage}
            />

            <div className="text-center">
                <h1 className="text-5xl font-bold">
                    Welcome!
                    <br />
                    Please Log In
                </h1>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div>
                    <label htmlFor="email" className="text-sm font-extrabold">
                        Email
                    </label>
                    <input
                        type="text"
                        value={data.email}
                        onChange={(e) => {
                            setData("email", e.target.value);
                            clearErrors("email");

                            if (!e.target.value) {
                                setEmailError("The email field is required.");
                            } else {
                                setEmailError("");
                            }
                        }}
                        name="email"
                        placeholder="example@email.com"
                        className="px-4 py-2 rounded-full text-black w-full"
                    />
                    {(emailError || errors.email) && (
                        <p className="text-red-500 text-sm mt-1">
                            {emailError || errors.email}
                        </p>
                    )}
                    {needsVerification && (
                        <button
                            type="button"
                            onClick={resendVerification}
                            disabled={processing || !data.email}
                            className="p-2 font-extrabold rounded-full bg-secondary hover:bg-[#000000] w-2/3"
                        >
                            Resend Verification Email
                        </button>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="text-sm font-extrabold"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => {
                            setData("password", e.target.value);
                            clearErrors("password");

                            if (!e.target.value) {
                                setPasswordError(
                                    "The password field is required."
                                );
                            } else {
                                setPasswordError("");
                            }
                        }}
                        name="password"
                        placeholder="••••••••"
                        className="px-4 py-2 rounded-full text-black w-full"
                    />
                    {(passwordError || errors.password) && (
                        <p className="text-red-500 text-sm mt-1">
                            {passwordError || errors.password}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="p-2 font-extrabold rounded-full bg-secondary hover:bg-[#000000] w-full"
                >
                    Log In
                </button>
            </form>

            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center w-full">
                    <div className="w-1/2 border-t border-white"></div>
                    <span className="px-3 text-sm">OR</span>
                    <div className="w-1/2 border-t border-white"></div>
                </div>

                <a
                    href={route("google.auth.redirect")}
                    className="p-2 flex items-center justify-center text-center text-black font-bold rounded-full bg-white hover:bg-gray-200 w-full"
                >
                    Sign in with Google
                </a>

                <Link
                    href="/register"
                    className="p-2 text-center text-[#4F6D40] font-extrabold rounded-full bg-[#FFFFFF] hover:bg-[#3D3D3D] hover:text-white w-full"
                >
                    Sign Up
                </Link>
            </div>
        </div>
    );
};

Login.layout = (page) => <AuthPagesLayout children={page} />;

export default Login;
