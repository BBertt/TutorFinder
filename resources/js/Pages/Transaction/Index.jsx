import Layout from "@/Layouts/Layout";
import { Head, Link, router } from "@inertiajs/react";

const Index = ({ transactions, auth }) => {
    const handleCancel = (id) => {
        router.post(route('transactions.cancel', id), {}, { preserveScroll: true });
    };
    const handlePay = (id) => {
        router.post(route('transactions.pay', id), {}, { preserveScroll: true });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "failed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <>
            <Head title="Transaction List" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200 dark:bg-darkSecondary dark:border-dark">
                            <h1 className="text-2xl font-bold mb-4">
                                Transaction List
                            </h1>
                            {transactions && transactions.length > 0 ? (
                                <div className="space-y-6">
                                    {transactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="border rounded-lg p-4"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h2 className="text-lg font-semibold">
                                                        Transaction #
                                                        {
                                                            transaction.external_id
                                                        }
                                                    </h2>
                                                    <p className="text-sm text-gray-400">
                                                        {new Date(
                                                            transaction.created_at
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p
                                                        className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${getStatusClass(
                                                            transaction.status
                                                        )}`}
                                                    >
                                                        {transaction.status}
                                                    </p>
                                                    <p className="font-bold text-lg">
                                                        Rp{" "}
                                                        {parseFloat(
                                                            transaction.total_amount
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </p>
                                                    {transaction.status === 'pending' && (
                                                        <div className="mt-2 flex gap-2 justify-end">
                                                            <button onClick={() => handleCancel(transaction.id)} className="px-3 py-1 rounded bg-red-600 text-white">Cancel</button>
                                                            <button onClick={() => handlePay(transaction.id)} className="px-3 py-1 rounded bg-primary text-white">Pay</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-2">
                                                    Courses:
                                                </h3>
                                                <div className="flex flex-col gap-4 mt-2">
                                                    {transaction.details &&
                                                        transaction.details.map(
                                                            (detail) => (
                                                                <div
                                                                    key={
                                                                        detail.id
                                                                    }
                                                                    className="flex items-center p-4 border rounded-lg shadow-sm"
                                                                >
                                                                    {detail.course ? (
                                                                        <>
                                                                            <div className="flex-shrink-0">
                                                                                <img
                                                                                    src={
                                                                                        detail
                                                                                            .course
                                                                                            .thumbnail_image_url
                                                                                    }
                                                                                    alt={
                                                                                        detail
                                                                                            .course
                                                                                            .title
                                                                                    }
                                                                                    className="w-20 h-20 object-cover rounded-lg"
                                                                                    onError={(
                                                                                        e
                                                                                    ) => {
                                                                                        e.target.onerror =
                                                                                            null;
                                                                                        e.target.src =
                                                                                            "https://placehold.co/600x400/99D37C/4F6D40?text=Image+Missing";
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div className="flex-grow ml-4">
                                                                                <Link
                                                                                    href={route(
                                                                                        "courses.show",
                                                                                        detail
                                                                                            .course
                                                                                            .id
                                                                                    )}
                                                                                >
                                                                                    <h2 className="font-bold text-lg hover:underline">
                                                                                        {
                                                                                            detail
                                                                                                .course
                                                                                                .title
                                                                                        }
                                                                                    </h2>
                                                                                </Link>
                                                                                <p className="text-sm text-gray-400">
                                                                                    {detail
                                                                                        .course
                                                                                        .user
                                                                                        ? detail
                                                                                              .course
                                                                                              .user
                                                                                              .name
                                                                                        : "Author"}
                                                                                </p>
                                                                                <p className="font-bold mt-1">
                                                                                    Rp{" "}
                                                                                    {parseFloat(
                                                                                        detail.price_at_transaction
                                                                                    ).toLocaleString(
                                                                                        "id-ID"
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <p className="w-full text-center">
                                                                            Course
                                                                            information
                                                                            is
                                                                            not
                                                                            available.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>You have no transactions yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

Index.layout = (page) => <Layout children={page} />;

export default Index;
