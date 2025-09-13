import AuthLayout from "@/Layouts/AuthLayout";

import { useForm, Link } from "@inertiajs/react";
import { useState } from "react";

const Register = () => {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
    });

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");

    const submit = (e) => {
        e.preventDefault(e);
        post("/register");
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-xs flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="text-5xl font-bold">Create an Account</h1>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="flex gap-3">
                        <div>
                            <label
                                htmlFor="firstName"
                                className="text-sm font-extrabold"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                value={data.firstName}
                                onChange={(e) => {
                                    setData("firstName", e.target.value);
                                    clearErrors("firstName");

                                    if (!e.target.value) {
                                        setFirstNameError(
                                            "The first name field is required."
                                        );
                                    } else {
                                        setFirstNameError("");
                                    }
                                }}
                                name="firstName"
                                placeholder="John"
                                className="px-4 py-2 rounded-full text-black w-full"
                            />
                            {(firstNameError || errors.firstName) && (
                                <p className="text-red-500 text-sm mt-1">
                                    {firstNameError || errors.firstName}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="lastName"
                                className="text-sm font-extrabold"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={data.lastName}
                                onChange={(e) => {
                                    setData("lastName", e.target.value);
                                    clearErrors("lastName");

                                    if (!e.target.value) {
                                        setLastNameError(
                                            "The last name field is required."
                                        );
                                    } else {
                                        setLastNameError("");
                                    }
                                }}
                                name="lastName"
                                placeholder="Doe"
                                className="px-4 py-2 rounded-full text-black w-full"
                            />
                            {(lastNameError || errors.lastName) && (
                                <p className="text-red-500 text-sm mt-1">
                                    {lastNameError || errors.lastName}
                                </p>
                            )}
                        </div>
                    </div>

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

                                if (!value) {
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

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-extrabold"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={data.confirmPassword}
                            onChange={(e) => {
                                setData("confirmPassword", e.target.value);
                                clearErrors("confirmPassword");

                                if (!value) {
                                    setConfirmPasswordError(
                                        "The confirm password field is required."
                                    );
                                } else {
                                    setConfirmPasswordError("");
                                }
                            }}
                            name="confirmPassword"
                            placeholder="••••••••"
                            className="px-4 py-2 rounded-full text-black w-full"
                        />
                        {(confirmPasswordError || errors.confirmPassword) && (
                            <p className="text-red-500 text-sm mt-1">
                                {confirmPasswordError || errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="phoneNumber"
                            className="text-sm font-extrabold"
                        >
                            Phone Number
                        </label>
                        <input
                            type="text"
                            value={data.phoneNumber}
                            onChange={(e) => {
                                setData("phoneNumber", e.target.value);
                                clearErrors("phoneNumber");

                                if (!e.target.value) {
                                    setPhoneNumberError(
                                        "The phone number field is required."
                                    );
                                } else {
                                    setPhoneNumberError("");
                                }
                            }}
                            name="phoneNumber"
                            placeholder="081234567890"
                            className="px-4 py-2 rounded-full text-black w-full"
                        />
                        {(phoneNumberError || errors.phoneNumber) && (
                            <p className="text-red-500 text-sm mt-1">
                                {phoneNumberError || errors.phoneNumber}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <div>
                            <label className="text-sm font-extrabold">
                                Gender
                            </label>

                            <div className="flex items-center gap-4 mt-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={data.gender === "male"}
                                        onChange={(e) => {
                                            setData("gender", e.target.value);
                                            clearErrors("gender");
                                        }}
                                    />
                                    Male
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={data.gender === "female"}
                                        onChange={(e) => {
                                            setData("gender", e.target.value);
                                            clearErrors("gender");
                                        }}
                                    />
                                    Female
                                </label>
                            </div>

                            {errors.gender && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.gender}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="dateOfBirth"
                                className="text-sm font-extrabold"
                            >
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={data.dateOfBirth}
                                onChange={(e) => {
                                    setData("dateOfBirth", e.target.value);
                                    clearErrors("dateOfBirth");
                                }}
                                name="dateOfBirth"
                                className="px-4 py-2 rounded-full text-black w-full"
                            />
                            {errors.dateOfBirth && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.dateOfBirth}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="p-2 font-extrabold rounded-full bg-[#3D3D3D] hover:bg-[#000000] w-full"
                    >
                        Create Account
                    </button>
                </form>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center w-full">
                        <div className="w-1/2 border-t border-white"></div>
                        <span className="px-3 text-sm">OR</span>
                        <div className="w-1/2 border-t border-white"></div>
                    </div>
                    <Link
                        href="/login"
                        className="p-2 text-center text-[#4F6D40] font-extrabold rounded-full bg-[#FFFFFF] hover:bg-[#3D3D3D] hover:text-white w-full"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Register;
