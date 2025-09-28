import { usePage, router } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { useState } from "react";

const Users = () => {
    const { users, flash } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleOpen = (id) => {
        setSelectedId(id);
        setIsOpen(true);
    };

    const handleClose = () => {
        setSelectedId(null);
        setIsOpen(false);
    };

    const handleUpdate = (id) => {
        router.get(`/users/${id}/edit`);
    };

    const handleDelete = () => {
        router.delete(`/users/${selectedId}`, {
            onSuccess: () => {
                handleClose();
            },
        });
    };

    return (
        <div className="flex flex-col items-center m-10">
            <h1 className="text-2xl font-extrabold mb-6">Users</h1>
            {flash.success && (
                <div className="bg-green-500 text-white px-4 py-2 rounded mb-4 w-full">
                    {flash.success}
                </div>
            )}
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
                                <td className="border p-2">{user.gender}</td>
                                <td className="border p-2">
                                    {new Date(
                                        user.date_of_birth
                                    ).toLocaleDateString("en-GB")}
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
                                        onClick={() => handleOpen(user.id)}
                                        className="text-secondary font-extrabold"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="rounded-lg bg-white p-4 shadow-lg max-w-md w-full flex flex-col justify-center items-center">
                        <h2 className="text-xl font-bold mb-3">
                            Are you sure you want to delete this user?
                        </h2>
                        <div className="flex justify-center items-center gap-4 w-full">
                            <button
                                type="button"
                                className="p-2 font-extrabold rounded-full bg-primary text-white hover:bg-secondary w-full"
                                onClick={() => handleDelete(selectedId)}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                className="p-2 font-extrabold rounded-full bg-secondary text-white hover:bg-[#000000] w-full"
                                onClick={handleClose}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

Users.layout = (page) => <Layout children={page} />;

export default Users;
