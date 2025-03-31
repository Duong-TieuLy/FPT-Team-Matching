import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function BoxChatMini({ user, onClose }) {
  const [messages, setMessages] = useState([
    { sender: user.name, text: "Xin chào!", avatar: "/avata.jpg" },
    {
      sender: "Bạn",
      text: "Chào bạn!",
      avatar: "/avata.jpg",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          sender: "Bạn",
          text: input,
          avatar: "https://via.placeholder.com/40",
        },
      ]);
      setInput("");
    }
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
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold text-gray-900">{user.name}</span>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-blue-600 p-1 rounded-full cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat Content */}
      <div className="p-3 h-60 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: msg.sender === "Bạn" ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2 ${
              msg.sender === "Bạn" ? "justify-end" : ""
            }`}
          >
            {msg.sender !== "Bạn" && (
              <img
                src={msg.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <div
              className={`p-2 rounded-lg w-fit max-w-[80%] text-amber-700 ${
                msg.sender === "Bạn" ? "bg-blue-100" : "bg-gray-200"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
            {msg.sender === "Bạn" && (
              <img
                src={msg.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
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
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 text-gray-800 p-2 text-sm border rounded-l-lg focus:outline-none"
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 rounded-r-lg hover:bg-blue-600 cursor-pointer"
        >
          Gửi
        </button>
      </div>
    </motion.div>
  );
}
