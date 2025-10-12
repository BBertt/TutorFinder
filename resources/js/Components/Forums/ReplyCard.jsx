import React from "react";
import VoteButtons from "./VoteButtons";

const ReplyCard = ({ reply, type = "reply" }) => {
    const authorName = `${reply.user.first_name} ${reply.user.last_name}`;
    return (
        <div className="flex items-start space-x-4">
            <img
                className="w-12 h-12 rounded-full"
                src={
                    reply.user.profile_image_path
                        ? `/${reply.user.profile_image_path}`
                        : `https://ui-avatars.com/api/?name=${authorName}&background=random`
                }
                alt={authorName}
            />
            <div>
                <p className="font-bold">{authorName}</p>
                <p className="text-gray-700 mt-1">{reply.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                    <VoteButtons item={reply} type={type} />
                    <button className="text-sm font-semibold text-gray-500 hover:underline">
                        Reply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReplyCard;
