import React from "react";
import { router } from "@inertiajs/react";

export default function VoteButtons({ item, type }) {
    const userVote = item.user_vote?.vote;

    const handleVote = (e, voteValue) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(
            route("votes.store", { type, id: item.id }),
            { vote: voteValue },
            { preserveScroll: true }
        );
    };

    return (
        <div className="flex items-center space-x-4 text-sm text-gray-500">
            <button
                onClick={(e) => handleVote(e, 1)}
                className="flex items-center space-x-1 group"
            >
                <img
                    src="/assets/icons/thumbsUp.png"
                    alt="Like"
                    className={`w-5 h-5 transition-opacity ${
                        userVote === 1
                            ? "opacity-100"
                            : "opacity-50 group-hover:opacity-100"
                    }`}
                />
                <span>{item.likes}</span>
            </button>
            <button
                onClick={(e) => handleVote(e, -1)}
                className="flex items-center space-x-1 group"
            >
                <img
                    src="/assets/icons/thumbsDown.png"
                    alt="Dislike"
                    className={`w-5 h-5 transition-opacity ${
                        userVote === -1
                            ? "opacity-100"
                            : "opacity-50 group-hover:opacity-100"
                    }`}
                />
                <span>{item.dislikes}</span>
            </button>
        </div>
    );
}
