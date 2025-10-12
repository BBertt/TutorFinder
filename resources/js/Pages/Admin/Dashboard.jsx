import Layout from "@/Layouts/Layout";
import { Link } from "@inertiajs/react";

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center m-10">
            <h1 className="text-2xl font-extrabold mb-6">Admin Dashboard</h1>

            <div className="w-full flex flex-wrap justify-evenly items-center text-white">
                <Link
                    href={route('admin.tutors')}
                    className="max-w-md w-full p-10 bg-primary rounded-xl hover:bg-secondary text-center"
                >
                    <h2 className="text-xl font-bold mb-2">
                        Manage Tutor Registration
                    </h2>
                    <p>Approve or reject pending tutor registrations.</p>
                </Link>

                <Link
                    href={route('admin.users')}
                    className="max-w-md w-full p-10 bg-secondary rounded-xl hover:bg-[#000000] text-center"
                >
                    <h2 className="text-xl font-bold mb-2">Manage Users</h2>
                    <p>Manage all users in the system.</p>
                </Link>

                <Link
                    href={route('admin.transactions')}
                    className="max-w-md w-full p-10 bg-primary rounded-xl hover:bg-secondary text-center"
                >
                    <h2 className="text-xl font-bold mb-2">History</h2>
                    <p>View users transactions history</p>
                </Link>
            </div>
        </div>
    );
};

Dashboard.layout = (page) => <Layout children={page} />;

export default Dashboard;
