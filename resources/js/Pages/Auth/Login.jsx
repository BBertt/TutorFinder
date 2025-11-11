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
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48">
                        <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                        ></path>
                        <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                        ></path>
                        <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                        ></path>
                        <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C44.438,36.338,48,30.668,48,24C48,22.659,47.862,21.35,47.611,20.083z"
                        ></path>
                    </svg>
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
