import { useState, useEffect } from "react";
import useWebSocket from "../../websocket.js";

const GroupChatBox = ({ groupName, teamId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const { sendMessage } = useWebSocket(
        (msg) => {
            setMessages((prev) => [...prev, msg]);
        },
        `/topic/team/${teamId}`
    );

    useEffect(() => {
        fetch(`/api/messages/team/${teamId}`)
            .then((res) => res.json())
            .then((data) => setMessages(data));
    }, [teamId]);

    const handleSend = () => {
        if (!input.trim()) return;
        const msg = {
            senderId: currentUser.id,
            teamId: teamId,
            content: input,
            messageType: "TEAM",
        };
        sendMessage(`/app/team`, msg);
        setMessages((prev) => [...prev, { ...msg, senderId: currentUser }]);
        setInput("");
    };

    return (
        <div className="bg-gray-50 p-3 rounded-lg shadow mt-4">
            <h3 className="text-lg font-semibold mb-2">Chat nhóm: {groupName}</h3>
            <div className="h-64 overflow-y-auto p-2 bg-white rounded-lg mb-2">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-1 p-2 rounded-lg ${
                            message.senderId?.id === currentUser.id
                                ? "bg-blue-100 text-right"
                                : "bg-gray-200 text-left"
                        }`}
                    >
                        <span className="font-semibold">{message.senderId?.name || "Bạn"}: </span>
                        {message.content}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default GroupChatBox;
