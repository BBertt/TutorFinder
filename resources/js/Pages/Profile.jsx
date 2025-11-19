import { useState } from "react";
import Layout from "@/Layouts/Layout";
import { useForm, usePage } from "@inertiajs/react";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

const Profile = () => {
    const { auth } = usePage().props;

    const [profileImage, setProfileImage] = useState(
        auth.user.profile_image_url || "/assets/icons/profile.svg"
    );
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        firstName: auth.user.first_name,
        lastName: auth.user.last_name,
        phoneNumber: auth.user.phone_number,
        dateOfBirth: auth.user.date_of_birth,
        bio: auth.user.bio,
    });

    const handleProfileChange = (e) => {
        setData("profileImage", e.target.files[0]);
        setProfileImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/profile", {
            forceFormData: true,
            onBefore: (request) => {
                request.data._method = "patch";
            },
        });
        setIsDeleteModalOpen(false);
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    return (
        <div className="max-w-lg w-full mx-auto my-10 bg-primary p-6 rounded-xl text-white flex flex-col items-center dark:bg-darkSecondary dark:border-dark">
            <h2 className="text-xl font-extrabold mb-4">Profile</h2>

            <form className="flex flex-col gap-6 w-full">
                <div className="relative mx-auto w-32 h-32">
                    <img
                        className="w-32 h-32 object-cover rounded-full"
                        src={profileImage}
                        alt="Profile"
                    />
                    <label
                        htmlFor="profileImage"
                        className="absolute bottom-0 right-0 cursor-pointer"
                    >
                        <img
                            src="/assets/icons/edit.svg"
                            alt="Edit"
                            className="w-6 h-6 rounded-full"
                        />
                    </label>
                    <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleProfileChange}
                        className="hidden"
                    />
                    {errors.profileImage && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.profileImage}
                        </p>
                    )}
                </div>
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
                        className="px-4 py-2 text-black w-full border-gray-200 rounded-full shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
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
                        className="px-4 py-2 text-black w-full border-gray-200 rounded-full shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    />
                    {(lastNameError || errors.lastName) && (
                        <p className="text-red-500 text-sm mt-1">
                            {lastNameError || errors.lastName}
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

                            if (e.target.value === "") {
                                setPhoneNumberError("");
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
                        className="px-4 py-2 text-black w-full border-gray-200 rounded-full shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    />
                    {(phoneNumberError || errors.phoneNumber) && (
                        <p className="text-red-500 text-sm mt-1">
                            {phoneNumberError || errors.phoneNumber}
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
                        }}
                        name="dateOfBirth"
                        className="px-4 py-2 text-black w-full border-gray-200 rounded-full shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                    />
                </div>

                {/* Bio hanya muncul kalau role tutor */}
                {auth.user?.role?.name === "tutor" && (
                    <div>
                        <label htmlFor="bio" className="text-sm font-extrabold">
                            Bio
                        </label>
                        <input
                            type="text"
                            value={data.bio || ""}
                            onChange={(e) => setData("bio", e.target.value)}
                            name="bio"
                            placeholder="Write something about yourself"
                            className="px-4 py-2 text-black w-full border-gray-200 rounded-full shadow-sm dark:bg-darkSecondary dark:border-dark dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                )}

                <button
                    type="button"
                    disabled={processing}
                    className="p-2 font-extrabold rounded-full bg-secondary hover:bg-[#000000] w-full dark:bg-primary dark:hover:bg-opacity-80"
                    onClick={() => setIsDeleteModalOpen(true)}
                >
                    Save Changes
                </button>

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleSubmit}
                    title="Update Profile"
                    message="Are you sure you want to update your profile?"
                    confirmText="Yes, Update"
                    cancelText="Cancel"
                    confirmColor="bg-primary"
                />
            </form>
        </div>
    );
};

Profile.layout = (page) => <Layout children={page} />;

export default Profile;
