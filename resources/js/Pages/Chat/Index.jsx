import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/Layout';
import { usePage, router } from '@inertiajs/react';

const Chat = ({ contacts, receiver, messages: initialMessages }) => {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!receiver) return;

        const interval = setInterval(async () => {
            try {
                const response = await axios.get(route('chat.getMessages', { receiver: receiver.id }));
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [receiver]);

    const handleContactClick = (contactId) => {
        router.get(route('chat.show', { receiver: contactId }));
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !receiver) return;

        router.post(route('chat.store', { receiver: receiver.id }), {
            message: newMessage,
        }, {
            onSuccess: () => {
                setNewMessage('');
                // Manually add the new message to the state to avoid waiting for the next poll
                setMessages([...messages, { message: newMessage, sender_id: auth.user.id, created_at: new Date().toISOString() }]);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="flex h-[calc(100vh-160px)]">
                {/* Contacts List */}
                <div className="w-1/4 bg-gray-100 border-r border-gray-200 overflow-y-auto">
                    <div className="p-4 font-bold border-b border-gray-200">Contacts</div>
                    <ul>
                        {contacts.map((contact) => (
                            <li
                                key={contact.id}
                                className={`p-4 cursor-pointer hover:bg-gray-200 ${receiver?.id === contact.id ? 'bg-gray-300' : ''}`}
                                onClick={() => handleContactClick(contact.id)}
                            >
                                {contact.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Chat Area */}
                <div className="w-3/4 flex flex-col">
                    {receiver ? (
                        <>
                            <div className="p-4 font-bold border-b border-gray-200 bg-gray-100">Chat with {receiver.name}</div>
                            <div className="flex-1 p-4 overflow-y-auto bg-white">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-lg p-3 rounded-lg mb-2 ${
                                                message.sender_id === auth.user.id
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-300 text-black'
                                            }`}>
                                            <p>{message.message}</p>
                                            <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 bg-gray-100 border-t border-gray-200">
                                <form onSubmit={handleSendMessage} className="flex">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Type a message..."
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 disabled:bg-blue-300"
                                        disabled={!newMessage.trim() || !receiver}
                                    >
                                        Send
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a contact to start chatting
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Chat;
