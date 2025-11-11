import { usePage } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

const Tutors = () => {
    const { tutors } = usePage().props;
    const [image, setImage] = useState(null);

    const handleApprove = (id) => {
        router.patch(`/tutors/${id}/approve`);
        setIsModalOpen(false);
    };

    const handleReject = (id) => {
        router.patch(`/tutors/${id}/reject`);
        setIsModalOpen(false);
    };

    const [selectedId, setSelectedId] = useState(null);
    const [actionType, setActionType] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col items-center m-10">
            <h1 className="text-2xl font-extrabold mb-6">Tutor Registration</h1>
            {tutors.length === 0 ? (
                <h2 className="text-xl font-bold mb-3">
                    There are no Tutor Registration Form Submitted.
                </h2>
            ) : (
                <table className="border border-collapse text-center">
                    <thead>
                        <tr>
                            <th className="border p-2">Full Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Phone Number</th>
                            <th className="border p-2">Gender</th>
                            <th className="border p-2">Identification Image</th>
                            <th className="border p-2">Certification Image</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tutors.map((tutor) => (
                            <tr>
                                <td className="border p-2">
                                    {tutor.first_name} {tutor.last_name}
                                </td>
                                <td className="border p-2">{tutor.email}</td>
                                <td className="border p-2">
                                    {tutor.phone_number}
                                </td>
                                <td className="border p-2">{tutor.gender}</td>
                                <td className="border p-2">
                                    <div
                                        className="flex justify-center items-center"
                                        onClick={() =>
                                            setImage(
                                                tutor.identification_image_url
                                            )
                                        }
                                    >
                                        <img
                                            src="/assets/icons/download.svg"
                                            alt="Download"
                                            className="w-6 h-6 cursor-pointer"
                                        />
                                    </div>
                                </td>
                                <td className="border p-2">
                                    <div
                                        className="flex justify-center items-center"
                                        onClick={() =>
                                            setImage(
                                                tutor.certification_image_url
                                            )
                                        }
                                    >
                                        <img
                                            src="/assets/icons/download.svg"
                                            alt="Download"
                                            className="w-6 h-6 cursor-pointer"
                                        />
                                    </div>
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => {
                                            setSelectedId(tutor.id);
                                            setActionType("approved");
                                            setIsModalOpen(true);
                                        }}
                                        className="text-primary font-extrabold"
                                    >
                                        Approve
                                    </button>
                                    {" | "}
                                    <button
                                        onClick={() => {
                                            setSelectedId(tutor.id);
                                            setActionType("rejected");
                                            setIsModalOpen(true);
                                        }}
                                        className="text-secondary font-extrabold"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {image && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="rounded-lg shadow-lg max-w-xl relative">
                        <button
                            onClick={() => setImage(null)}
                            className="absolute top-1 right-1 px-3 py-1 bg-red-500 text-white rounded-md"
                        >
                            X
                        </button>
                        <img
                            src={image}
                            alt="Preview"
                            className="max-h-[70vh] mx-auto rounded-md"
                        />
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setSelectedId(null);
                    setActionType(null);
                    setIsModalOpen(false);
                }}
                onConfirm={() => {
                    if (actionType === "approved") {
                        handleApprove(selectedId);
                    } else {
                        handleReject(selectedId);
                    }
                }}
                title={
                    actionType === "approved" ? "Approve User" : "Reject User"
                }
                message={
                    actionType === "approved"
                        ? "Are you sure you want to approve this user?"
                        : "Are you sure you want to reject this user?"
                }
                confirmText={
                    actionType === "approved" ? "Yes, Approve" : "Yes, Reject"
                }
                cancelText="Cancel"
                confirmColor={
                    actionType === "approved" ? "bg-primary" : "bg-red-600"
                }
            />
        </div>
    );
};

Tutors.layout = (page) => <Layout children={page} />;

export default Tutors;
