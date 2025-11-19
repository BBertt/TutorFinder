import AuthPagesLayout from "@/Layouts/AuthPagesLayout";
import { useForm } from "@inertiajs/react";
import { useState, useRef } from "react";

const TutorRegister = () => {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        identificationImage: "",
        certificationImage: "",
    });

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");

    const idImageRef = useRef(null);
    const certImageRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
        post("/tutor/register", { forceFormData: true });
    };

    return (
        <div className="w-full max-w-xs flex flex-col gap-6 py-6">
            <div className="text-center">
                <h1 className="text-5xl font-bold">Tutor Registration</h1>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6">
                {/* First & Last Name */}
                <div className="flex gap-3">
                    <div>
                        <label className="text-sm font-extrabold">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={data.firstName}
                            onChange={(e) => {
                                setData("firstName", e.target.value);
                                clearErrors("firstName");
                                setFirstNameError(
                                    e.target.value
                                        ? ""
                                        : "The first name field is required."
                                );
                            }}
                            name="firstName"
                            placeholder="John"
                            className="px-4 py-2 text-black w-full border-gray-200 rounded-full shadow-sm"
                        />
                        {(firstNameError || errors.firstName) && (
                            <p className="text-red-500 text-sm mt-1">
                                {firstNameError || errors.firstName}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-extrabold">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={data.lastName}
                            onChange={(e) => {
                                setData("lastName", e.target.value);
                                clearErrors("lastName");
                                setLastNameError(
                                    e.target.value
                                        ? ""
                                        : "The last name field is required."
                                );
                            }}
                            name="lastName"
                            placeholder="Doe"
                            className="px-4 py-2 text-black w-full border-gray-200 rounded-full shadow-sm"
                        />
                        {(lastNameError || errors.lastName) && (
                            <p className="text-red-500 text-sm mt-1">
                                {lastNameError || errors.lastName}
                            </p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="text-sm font-extrabold">Email</label>
                    <input
                        type="text"
                        value={data.email}
                        onChange={(e) => {
                            setData("email", e.target.value);
                            clearErrors("email");
                            if (!e.target.value) {
                                setEmailError("The email field is required.");
                            } else if (
                                !/^[^@\s]+@[^@\s]+$/.test(e.target.value)
                            ) {
                                setEmailError(
                                    "Please enter a valid email address."
                                );
                            } else {
                                setEmailError("");
                            }
                        }}
                        name="email"
                        placeholder="example@email.com"
                        className="px-4 py-2 text-black w-full border-gray-200 rounded-full shadow-sm"
                    />
                    {(emailError || errors.email) && (
                        <p className="text-red-500 text-sm mt-1">
                            {emailError || errors.email}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="text-sm font-extrabold">
                        Password (at least 8 characters, include capital
                        letters, numbers, and special characters)
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => {
                            setData("password", e.target.value);
                            clearErrors("password");
                            setPasswordError(
                                e.target.value
                                    ? ""
                                    : "The password field is required."
                            );
                        }}
                        name="password"
                        placeholder="••••••••"
                        className="px-4 py-2 text-black w-full border-gray-200 rounded-full shadow-sm"
                    />
                    {(passwordError || errors.password) && (
                        <p className="text-red-500 text-sm mt-1">
                            {passwordError || errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="text-sm font-extrabold">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={data.confirmPassword}
                        onChange={(e) => {
                            setData("confirmPassword", e.target.value);
                            clearErrors("confirmPassword");
                            setConfirmPasswordError(
                                e.target.value
                                    ? ""
                                    : "The confirm password field is required."
                            );
                        }}
                        name="confirmPassword"
                        placeholder="••••••••"
                        className="px-4 py-2 text-black w-full border-gray-200 rounded-full shadow-sm"
                    />
                    {(confirmPasswordError || errors.confirmPassword) && (
                        <p className="text-red-500 text-sm mt-1">
                            {confirmPasswordError || errors.confirmPassword}
                        </p>
                    )}
                </div>

                {/* Phone Number */}
                <div>
                    <label className="text-sm font-extrabold">
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
                            } else if (!/^\d+$/.test(e.target.value)) {
                                setPhoneNumberError(
                                    "Please enter a valid phone number."
                                );
                            } else {
                                setPhoneNumberError("");
                            }
                        }}
                        name="phoneNumber"
                        placeholder="081234567890"
                        className="px-4 py-2 text-black w-full border-gray-200 rounded-full shadow-sm"
                    />
                    {(phoneNumberError || errors.phoneNumber) && (
                        <p className="text-red-500 text-sm mt-1">
                            {phoneNumberError || errors.phoneNumber}
                        </p>
                    )}
                </div>

                {/* Gender & Date of Birth */}
                <div className="flex gap-3">
                    <div>
                        <label className="text-sm font-extrabold">Gender</label>
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
                        <label className="text-sm font-extrabold">
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
                            className="px-4 py-2 text-black w-full border-gray-200 rounded-full shadow-sm"
                        />
                        {errors.dateOfBirth && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.dateOfBirth}
                            </p>
                        )}
                    </div>
                </div>

                {/* User Identification Image */}
                <div>
                    <label className="text-sm font-extrabold">
                        User Identification Image
                    </label>
                    <button
                        type="button"
                        onClick={() => idImageRef.current.click()}
                        className="w-full px-4 py-2 rounded-full text-primary bg-white text-center font-extrabold flex items-center justify-center gap-2"
                    >
                        <img
                            src="/assets/icons/gallery-add.svg"
                            alt="Add"
                            className="w-5 h-5"
                        />
                        {data.identificationImage
                            ? data.identificationImage.name
                            : "Add Image"}
                    </button>
                    <input
                        type="file"
                        ref={idImageRef}
                        onChange={(e) => {
                            setData("identificationImage", e.target.files[0]);
                            clearErrors("identificationImage");
                        }}
                        name="idImage"
                        className="hidden"
                        accept="image/*"
                    />
                    {errors.identificationImage && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.identificationImage}
                        </p>
                    )}
                </div>

                {/* Certification Image */}
                <div>
                    <label className="text-sm font-extrabold">
                        Certification Image
                    </label>
                    <button
                        type="button"
                        onClick={() => certImageRef.current.click()}
                        className="w-full px-4 py-2 rounded-full text-primary bg-white text-center font-extrabold flex items-center justify-center gap-2"
                    >
                        <img
                            src="/assets/icons/gallery-add.svg"
                            alt="Add"
                            className="w-5 h-5"
                        />
                        {data.certificationImage
                            ? data.certificationImage.name
                            : "Add Image"}
                    </button>
                    <input
                        type="file"
                        ref={certImageRef}
                        onChange={(e) => {
                            setData("certificationImage", e.target.files[0]);
                            clearErrors("certificationImage");
                        }}
                        name="certificationImage"
                        className="hidden"
                        accept="image/*"
                    />
                    {errors.certificationImage && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.certificationImage}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="p-2 font-extrabold rounded-full bg-[#3D3D3D] hover:bg-[#000000] w-full"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

TutorRegister.layout = (page) => <AuthPagesLayout children={page} />;

export default TutorRegister;
