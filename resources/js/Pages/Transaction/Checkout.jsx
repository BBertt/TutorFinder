import Layout from "@/Layouts/Layout";
import { Head, useForm, usePage } from "@inertiajs/react";

const Checkout = ({ cartItems }) => {
    const { auth } = usePage().props;
    const { post, processing } = useForm();

    const handleSubmit = (e) => {
        e.preventDefault();
        const course_cart_ids = cartItems.map((item) => item.id);
        post(
            route("checkout"),
            {
                course_cart_ids,
            },
            {
                onSuccess: (page) => {
                    window.location.href = page.props.invoice_url;
                },
            }
        );
    };

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.course.price,
        0
    );

    return (
        <>
            <Head title="Checkout" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
                            {cartItems.length > 0 ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-4 mb-4">
                                        {cartItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-center p-4 border rounded-lg"
                                            >
                                                <div>
                                                    <h2 className="font-bold">
                                                        {item.course.title}
                                                    </h2>
                                                    <p className="text-sm text-gray-600">
                                                        {item.course.description}
                                                    </p>
                                                </div>
                                                <p className="font-bold">
                                                    Rp {item.course.price}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end items-center gap-4">
                                        <p className="font-bold text-xl">
                                            Total: Rp {totalPrice}
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="p-2 font-extrabold rounded-full bg-secondary hover:bg-[#000000] text-white w-48"
                                        >
                                            Checkout
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p>Your cart is empty.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

Checkout.layout = (page) => <Layout children={page} />;

export default Checkout;
