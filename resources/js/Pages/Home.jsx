import React from "react";
import { Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";

function Home() {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold">Welcome to the Homepage!</h1>
                <p className="mt-4 text-gray-700">
                    Here comes the main content of the homepage.
                </p>
            </div>
        </>
    );
}

Home.layout = (page) => <Layout children={page} />;

export default Home;
