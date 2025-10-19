import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/Layout';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';

const Chat = ({ contacts, receiver, messages: initialMessages }) => {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    useEffect(() => {
        if (!receiver) return;

        const interval = setInterval(async () => {
            try {
                const response = await axios.get(route('chat.getMessages', { receiver: receiver.id }));
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        }, 2000); // Poll every 2 seconds

        return () => clearInterval(interval);
    }, [receiver]);

    const handleContactClick = (contactId) => {
        router.get(route('chat.show', { receiver: contactId }), {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['receiver', 'messages'],
        });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !receiver) return;

        const tempMessage = {
            id: Date.now(), // Temporary ID
            message: newMessage,
            sender_id: auth.user.id,
            created_at: new Date().toISOString(),
        };

        setMessages(prevMessages => [...prevMessages, tempMessage]);
        setNewMessage('');

        try {
            axios.post(route('chat.store', { receiver: receiver.id }), {
                message: newMessage,
            }).then(response => {
                // The message is already added optimistically.
                // You might want to update the message with the one from the server
                // if it contains more data (e.g., persisted ID, timestamp)
            }).catch(error => {
                // If the message failed to send, remove it from the list
                setMessages(prevMessages => prevMessages.filter(m => m.id !== tempMessage.id));
            });
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages(prevMessages => prevMessages.filter(m => m.id !== tempMessage.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto flex flex-col">
                <div className="flex-grow flex border border-gray-200 rounded-lg shadow-lg">
                    {/* Contacts List */}
                    <div className="w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col z-10">
                        <div className="p-4 font-bold text-lg border-b border-gray-200">Contacts</div>
                        <ul className="flex-1 overflow-y-auto">
                            {contacts.map((contact) => (
                                <li
                                    key={contact.id}
                                    className={`p-4 cursor-pointer hover:bg-gray-200 ${receiver?.id === contact.id ? 'bg-gray-300 font-semibold' : ''}`}
                                    onClick={() => handleContactClick(contact.id)}
                                >
                                    {contact.first_name} {contact.last_name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Chat Area */}
                    <div className="w-3/4 flex flex-col bg-white">
                        {receiver ? (
                            <>
                                <div className="p-4 font-bold text-lg border-b border-gray-200 bg-gray-50">Chat with {receiver.first_name} {receiver.last_name}</div>
                                <div className="flex-1 p-4 overflow-y-auto">
                                    {messages.map((message, index) => (
                                        <div
                                            key={message.id || index}
                                            className={`flex mb-3 ${message.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-md p-3 rounded-xl shadow-md ${message.sender_id === auth.user.id
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-200 text-black'
                                                    }`}>
                                                <p className="text-sm">{message.message}</p>
                                                <span className="text-xs opacity-75 mt-1 block text-right">{new Date(message.created_at).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-200">
                                    <form onSubmit={handleSendMessage} className="flex items-center">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary px-5"
                                            placeholder="Type a message..."
                                        />
                                        <button
                                            type="submit"
                                            className="ml-3 px-6 py-3 bg-primary text-white rounded-full hover:bg-opacity-80 disabled:bg-opacity-50 transition-colors"
                                            disabled={!newMessage.trim() || !receiver}
                                        >
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
                                Select a contact to start chatting
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Chat;
