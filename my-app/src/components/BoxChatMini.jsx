import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import useWebSocket from "./websocket.js";

export default function BoxChatMini({ user, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);  // Lưu trữ tin nhắn
  const [input, setInput] = useState("");  // Nội dung tin nhắn
  const messagesEndRef = useRef(null);  // Dùng để tự động scroll xuống cuối khi có tin nhắn mới

  // Tạo kênh chung giữa 2 người dùng
  const channel = `/topic/private/${Math.min(currentUser.id, user.id)}-${Math.max(currentUser.id, user.id)}`;

  // WebSocket để gửi và nhận tin nhắn
  const { sendMessage, messagesSocket } = useWebSocket(
      (msg) => {
        // Nhận tin nhắn mới qua WebSocket và cập nhật lại giao diện
        setMessages((prev) => [...prev, msg]);
      },
      channel  // Kênh chung cho 2 người
  );

  // Load lịch sử tin nhắn khi người dùng vào chat
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/messages/private?user1=${currentUser.id}&user2=${user.id}`);
        const data = await response.json();
        setMessages(data); // Lưu tin nhắn vào state
      } catch (error) {
        console.error("Error loading messages", error);
      }
    };

    loadMessages();
  }, [user.id, currentUser.id]);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Chạy khi messages thay đổi

  // Xử lý gửi tin nhắn
  const handleSend = () => {
    if (!input.trim()) return;

    const msg = {
      senderId: currentUser.id,
      receiverId: user.id,
      senderName: user.fullName,
      content: input,
      messageType: "PRIVATE",
    };

    // Gửi tin nhắn qua WebSocket
    sendMessage("/app/chat.private", msg);
    setInput(""); // Xóa input sau khi gửi tin nhắn
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-10 right-75 w-80 bg-white shadow-lg rounded-lg border border-gray-700 z-10"
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
                  className={`flex items-center gap-2 ${msg.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
              >
                {msg.senderId !== currentUser.id && (
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                )}
                <div
                    className={`p-2 rounded-lg w-fit max-w-[80%] text-amber-700 ${msg.senderId === currentUser.id ? "bg-blue-100" : "bg-gray-200"}`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.senderId === currentUser.id && (
                    <img src={currentUser.profilePicture} alt="Avatar" className="w-8 h-8 rounded-full" />
                )}
              </motion.div>
          ))}
          {/* Ref giúp tự động cuộn tới cuối khi tin nhắn mới được thêm vào */}
          <div ref={messagesEndRef} />
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
