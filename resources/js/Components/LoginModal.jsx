import React from "react";
import { router } from "@inertiajs/react";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

export default function LoginModal({ isOpen, onClose }) {
    const handleLoginRedirect = () => {
        router.get(route("login"));
    };

    return (
        <ConfirmationModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleLoginRedirect}
            title="Login Required"
            message="You must be logged in to view this content. Would you like to log in now?"
            confirmText="Yes, Log In"
            cancelText="Cancel"
        />
    );
}
