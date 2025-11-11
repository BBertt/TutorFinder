import Layout from "@/Layouts/Layout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";

const Checkout = ({ cartItems }) => {
    const [processing, setProcessing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const cartItemIds = cartItems.map((item) => item.id);
    const totalPrice = cartItems.reduce(
        (acc, item) => acc + parseFloat(item.course.price),
        0
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItemIds.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        setProcessing(true);
        try {
            const response = await axios.post(route("checkout"), {
                course_cart_ids: cartItemIds,
            });
            if (response.data.invoice_url) {
                window.location.href = response.data.invoice_url;
            }
        } catch (error) {
            console.error("Checkout error:", error);
            if (error.response) {
                console.error("Error data:", error.response.data);
                console.error("Error status:", error.response.status);
                if (error.response.status === 422) {
                    const validationErrors = error.response.data.errors;
                    const errorMessages = Object.values(validationErrors)
                        .flat()
                        .join("\n");
                    alert("Validation failed:\n" + errorMessages);
                } else {
                    const message =
                        error.response.data.message ||
                        "An unknown server error occurred.";
                    alert(
                        `Error: ${message} (Status: ${error.response.status})`
                    );
                }
            } else if (error.request) {
                alert(
                    "The server did not respond. Please check your network connection."
                );
            } else {
                alert("An error occurred while setting up the request.");
            }
        }
        setProcessing(false);
    };

    const openConfirmModal = (item) => {
        setItemToDelete(item);
        setIsModalOpen(true);
    };

    const closeConfirmModal = () => {
        setItemToDelete(null);
        setIsModalOpen(false);
    };

    const handleRemoveItem = () => {
        if (itemToDelete) {
            router.delete(route("cart.destroy", itemToDelete.id), {
                preserveScroll: true,
                onSuccess: () => closeConfirmModal(),
            });
        }
    };

    return (
        <>
            <Head title="Shopping Cart" />
            <div className="container mx-auto mt-10 mb-10">
                <h1 className="text-4xl font-extrabold mb-8 text-center">
                    Shopping Cart
                </h1>
                {cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row shadow-lg my-10">
                        <div className="w-full lg:w-3/4 bg-white p-10 dark:bg-darkSecondary dark:border-dark">
                            <div className="flex justify-between border-b pb-8">
                                <h1 className="font-semibold text-2xl">
                                    {cartItems.length} Total in Cart
                                </h1>
                            </div>
                            <div className="flex flex-col gap-6 mt-10">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center p-4 border rounded-lg shadow-sm"
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                src={
                                                    item.course
                                                        .thumbnail_image_url
                                                }
                                                alt={item.course.title}
                                                className="w-20 h-20 object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "https://placehold.co/600x400/99D37C/4F6D40?text=Image+Missing";
                                                }}
                                            />
                                        </div>
                                        <div className="flex-grow ml-4">
                                            <h2 className="font-bold text-lg">
                                                {item.course.title}
                                            </h2>
                                            <p className="text-sm dark:text-white">
                                                {item.course.user
                                                    ? `${item.course.user.first_name} ${item.course.user.last_name}`
                                                    : "Author"}
                                            </p>
                                            <p className="font-bold dark:text-white mt-1">
                                                Rp{" "}
                                                {parseFloat(
                                                    item.course.price
                                                ).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <button
                                                onClick={() =>
                                                    openConfirmModal(item)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full lg:w-1/4 bg-primary text-white p-8 rounded-r-lg">
                            <h1 className="font-bold text-2xl border-b pb-6">
                                Total
                            </h1>
                            <div className="mt-8 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between"
                                    >
                                        <span className="w-1/2 truncate">
                                            {item.course.title}
                                        </span>
                                        <span>
                                            Rp{" "}
                                            {parseFloat(
                                                item.course.price
                                            ).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t mt-8 pt-6">
                                <div className="flex font-bold justify-between text-lg">
                                    <span>Total</span>
                                    <span>
                                        Rp {totalPrice.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="mt-10">
                                <button
                                    type="submit"
                                    disabled={
                                        processing || cartItems.length === 0
                                    }
                                    className="p-2 font-extrabold rounded-full bg-secondary hover:bg-[#000000] w-full"
                                >
                                    Checkout
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-2xl font-semibold">
                            Your cart is empty.
                        </p>
                    </div>
                )}
            </div>
            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleRemoveItem}
                itemName={itemToDelete?.course?.title}
            />
        </>
    );
};

Checkout.layout = (page) => <Layout children={page} />;

export default Checkout;
