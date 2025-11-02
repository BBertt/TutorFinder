import AuthPagesLayout from "@/Layouts/AuthPagesLayout";

import { Head, Link, useForm } from "@inertiajs/react";

const VerifyEmail = ({ status }) => {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <div className="w-full max-w-xs flex flex-col gap-6">
            <div className="text-center">
                <h1 className="text-5xl font-bold">Verify Your Email</h1>
            </div>

            <div className="text-center text-sm text-white">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </div>

            {status === "verification-link-sent" && (
                <div className="text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-6">
                <button
                    type="submit"
                    disabled={processing}
                    className="p-2 font-extrabold rounded-full bg-secondary hover:bg-[#000000] w-full"
                >
                    Resend Verification Email
                </button>
            </form>

            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center w-full">
                    <div className="w-1/2 border-t border-white"></div>
                    <span className="px-3 text-sm">OR</span>
                    <div className="w-1/2 border-t border-white"></div>
                </div>

                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="p-2 text-center text-[#4F6D40] font-extrabold rounded-full bg-[#FFFFFF] hover:bg-[#3D3D3D] hover:text-white w-full"
                >
                    Log Out
                </Link>
            </div>
        </div>
    );
};

VerifyEmail.layout = (page) => <AuthPagesLayout children={page} />;

export default VerifyEmail;