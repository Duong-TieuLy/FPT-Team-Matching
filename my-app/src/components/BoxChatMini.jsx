import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import useWebSocket from "./websocket.js";

export default function BoxChatMini({ user, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const { sendMessage } = useWebSocket(
      (msg) => {
        setMessages((prev) => [...prev, msg]);  // Chỉ lưu vào state
      },
      `/user/${currentUser.id}/queue/private`  // Từ Spring: @SendToUser
  );

  useEffect(() => {
    // Load lịch sử tin nhắn (chỉ load khi bắt đầu, không lưu vào DB)
    fetch(
        `/api/messages/private?user1=${currentUser.id}&user2=${user.id}`
    )
        .then((res) => res.json())
        .then((data) => setMessages(data)); // Chỉ hiển thị từ response API
  }, [user.id, currentUser.id]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = {
      senderId: currentUser.id,
      receiverId: user.id,
      content: input,
      messageType: "PRIVATE",
    };

    // Gửi tin nhắn qua WebSocket mà không lưu vào database
    sendMessage("/app/private", msg);

    // Chỉ lưu vào state để hiển thị tin nhắn, không gọi API lưu vào database
    setMessages((prev) => [...prev, { ...msg, senderId: currentUser }]);

    setInput("");
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-10 right-75 w-80 bg-white shadow-lg rounded-lg border border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-blue-500 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
            <span className="font-semibold text-gray-900">{user.name}</span>
          </div>
          <button onClick={onClose} className="hover:bg-blue-600 p-1 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Chat Content */}
        <div className="p-3 h-60 overflow-y-auto space-y-2">
          {messages.map((msg, index) => (
              <motion.div
                  key={index}
                  className={`flex items-center gap-2 ${msg.senderId?.id === currentUser.id ? "justify-end" : ""}`}
              >
                {msg.senderId?.id !== currentUser.id && (
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                )}
                <div
                    className={`p-2 rounded-lg w-fit max-w-[80%] text-amber-700 ${
                        msg.senderId?.id === currentUser.id ? "bg-blue-100" : "bg-gray-200"
                    }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.senderId?.id === currentUser.id && (
                    <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                )}
              </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-2 border-t flex">
          <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 text-gray-800 p-2 text-sm border rounded-l-lg"
              placeholder="Nhập tin nhắn..."
          />
          <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-3 rounded-r-lg hover:bg-blue-600"
          >
            Gửi
          </button>
        </div>
      </motion.div>
  );
}
