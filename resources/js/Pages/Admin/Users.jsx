import { usePage, router } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { useState } from "react";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

const Users = () => {
    const { users } = usePage().props;
    const [selectedId, setSelectedId] = useState(null);

    const handleUpdate = (id) => {
        router.get(`/users/${id}/edit`);
    };

    const handleDelete = () => {
        router.delete(`/users/${selectedId}`, {
            onSuccess: () => {
                setSelectedId(null);
                setIsDeleteModalOpen(false);
            },
        });
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    return (
        <div className="flex flex-col items-center m-10">
            <h1 className="text-2xl font-extrabold mb-6">Users</h1>
            {users.length === 0 ? (
                <h2 className="text-xl font-bold mb-3">
                    There are no Student or Tutor that have registered.
                </h2>
            ) : (
                <table className="border border-collapse text-center">
                    <thead>
                        <tr>
                            <th className="border p-2">Full Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Phone Number</th>
                            <th className="border p-2">Gender</th>
                            <th className="border p-2">Date of Birth</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Bio</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr>
                                <td className="border p-2">
                                    {user.first_name} {user.last_name}
                                </td>
                                <td className="border p-2">{user.email}</td>
                                <td className="border p-2">
                                    {user.phone_number}
                                </td>
                                <td className="border p-2">
                                    {user.gender ? user.gender : "-"}
                                </td>
                                <td className="border p-2">
                                    {user.date_of_birth
                                        ? new Date(
                                              user.date_of_birth
                                          ).toLocaleDateString("en-GB")
                                        : "-"}
                                </td>
                                <td className="border p-2">{user.role.name}</td>
                                <td className="border p-2">
                                    {user.bio ? user.bio : "-"}
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => handleUpdate(user.id)}
                                        className="text-primary font-extrabold"
                                    >
                                        Update
                                    </button>
                                    {" | "}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedId(user.id);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="text-secondary font-extrabold dark:text-white"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setSelectedId(null);
                    setIsDeleteModalOpen(false);
                }}
                onConfirm={handleDelete}
                title="Delete User"
                message="Are you sure you want to delete this user?"
                confirmText="Yes, Delete"
                cancelText="Cancel"
                confirmColor="bg-red-600"
            />
        </div>
    );
};

Users.layout = (page) => <Layout children={page} />;

export default Users;
