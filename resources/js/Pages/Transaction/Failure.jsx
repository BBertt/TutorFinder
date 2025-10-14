import Layout from '@/Layouts/Layout';
import { Head, Link } from '@inertiajs/react';

const Failure = () => {
    return (
        <>
            <Head title="Payment Failed" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-center">
                            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Failed</h1>
                            <p className="mt-2 text-gray-600">
                                Unfortunately, we were unable to process your payment.
                            </p>
                            <p className="text-gray-600">
                                Please try again or check your transaction history for more details.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route('transactions.index')}
                                    className="inline-flex items-center px-4 py-2 bg-primary border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-opacity-90 active:bg-opacity-90 focus:outline-none focus:border-primary focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Go to My Transactions
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

Failure.layout = (page) => <Layout children={page} />;

export default Failure;
