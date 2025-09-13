import AuthLayout from "@/Layouts/AuthLayout";

import { useForm, Link } from "@inertiajs/react";
import { useState } from "react";

const Login = () => {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: "",
        password: "",
    });

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const submit = (e) => {
        e.preventDefault(e);
        post("/login");
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-xs flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="text-5xl font-bold">
                        Welcome!
                        <br />
                        Please Log In
                    </h1>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="text-sm font-extrabold"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => {
                                setData("email", e.target.value);
                                clearErrors("email");

                                if (!e.target.value) {
                                    setEmailError(
                                        "The email field is required."
                                    );
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
                        className="p-2 font-extrabold rounded-full bg-[#3D3D3D] hover:bg-[#000000] w-full"
                    >
                        Log In
                    </button>
                </form>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center w-full">
                        <div className="w-1/2 border-t border-white"></div>
                        <span className="px-3 text-sm">OR</span>
                        <div className="w-1/2 border-t border-white"></div>
                    </div>
                    <Link
                        href="/register"
                        className="p-2 text-center text-[#4F6D40] font-extrabold rounded-full bg-[#FFFFFF] hover:bg-[#3D3D3D] hover:text-white w-full"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Login;
