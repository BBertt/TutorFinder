import Layout from "@/Layouts/Layout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from 'react';
import axios from 'axios';

const Checkout = ({ cartItems }) => {
    const [selectedCartItemIds, setSelectedCartItemIds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const newTotalPrice = cartItems
            .filter(item => selectedCartItemIds.includes(item.id))
            .reduce((acc, item) => acc + parseFloat(item.course.price), 0);
        setTotalPrice(newTotalPrice);
    }, [selectedCartItemIds, cartItems]);

    const handleCheckboxChange = (e, itemId) => {
        if (e.target.checked) {
            setSelectedCartItemIds([...selectedCartItemIds, itemId]);
        } else {
            setSelectedCartItemIds(selectedCartItemIds.filter(id => id !== itemId));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedCartItemIds.length === 0) {
            alert('Please select at least one course to purchase.');
            return;
        }
        setProcessing(true);
        try {
            const response = await axios.post(route('checkout'), {
                course_cart_ids: selectedCartItemIds,
            });
            if (response.data.invoice_url) {
                window.location.href = response.data.invoice_url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                
                if (error.response.status === 422) {
                    // Validation error
                    const validationErrors = error.response.data.errors;
                    const errorMessages = Object.values(validationErrors).flat().join('\n');
                    alert('Validation failed:\n' + errorMessages);
                } else {
                    // Other server error
                    const message = error.response.data.message || 'An unknown server error occurred.';
                    alert(`Error: ${message} (Status: ${error.response.status})`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                alert('The server did not respond. Please check your network connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('An error occurred while setting up the request.');
            }
        }
        setProcessing(false);
    };

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
                                                <div className="flex items-center">
                                                     <input
                                                        type="checkbox"
                                                        id={`course-${item.id}`}
                                                        className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        onChange={(e) => handleCheckboxChange(e, item.id)}
                                                        checked={selectedCartItemIds.includes(item.id)}
                                                    />
                                                    <div>
                                                        <h2 className="font-bold">
                                                            {item.course.title}
                                                        </h2>
                                                        <p className="text-sm text-gray-600">
                                                            {item.course.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-bold">
                                                    Rp {item.course.price}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end items-center gap-4">
                                        <p className="font-bold text-xl">
                                            Total: Rp {totalPrice.toFixed(2)}
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={processing || selectedCartItemIds.length === 0}
                                            className="p-2 font-extrabold rounded-full bg-secondary hover:bg-[#000000] text-white w-48 disabled:bg-gray-400"
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
