import { useState, useEffect } from "react";
import useWebSocket from "../../websocket.js";
import { useAuth } from "../../../context/useAuth.jsx";
import { useParams } from "react-router-dom";
const API_PROJECT = import.meta.env.VITE_HOST;
const GroupChatBox = () => {
  const { user } = useAuth();
  const { teamId } = useParams(); // Lấy teamId từ URL
  const [messages, setMessages] = useState([]); // Lưu trữ danh sách tin nhắn
  const [input, setInput] = useState(""); // Lưu trữ nội dung tin nhắn mới
  const [loading, setLoading] = useState(false); // Trạng thái tải tin nhắn
  const [error, setError] = useState(null); // Lỗi tải tin nhắn
  const token = localStorage.getItem("token");

  // Hàm để cập nhật danh sách tin nhắn
  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]); // Thêm tin nhắn mới vào danh sách
  };

  const { sendMessage } = useWebSocket(
    handleNewMessage,
    `/topic/team.${teamId}` // Kênh WebSocket để lắng nghe tin nhắn mới
  );

  // Hàm gửi tin nhắn
  const handleSendMessage = () => {
    if (input.trim()) {
      const messagePayload = {
        senderId: user.id,
        senderName: user.fullName,
        teamId: teamId,
        content: input,
        timestamp: new Date().toISOString(),
        messageType: "TEAM",
      };

      sendMessage(`/app/chat.team.${teamId}`, messagePayload); // Gửi tin nhắn qua WebSocket
      setInput(""); // Xóa ô nhập tin nhắn sau khi gửi
    }
  };

  // Hàm tải tin nhắn cũ từ server
  const loadMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_PROJECT}/api/messages/team/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data); // Cập nhật danh sách tin nhắn
      } else {
        throw new Error("Lỗi khi tải tin nhắn");
      }
    } catch (error) {
      console.error("Lỗi khi kết nối đến server", error);
      setError("Không thể tải tin nhắn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Khi component load hoặc teamId thay đổi, tải lại tin nhắn
  useEffect(() => {
    setMessages([]); // Clear previous messages
    loadMessages();
  }, [teamId]); // Mỗi khi teamId thay đổi, tin nhắn sẽ được tải lại

  // Scroll to the latest message whenever messages are updated
  useEffect(() => {
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-gray-50 p-3 rounded-lg shadow mt-4">
      <h3 className="text-lg font-semibold mb-2">Chat nhóm: {teamId}</h3>
      <div className="h-64 overflow-y-auto p-2 bg-white rounded-lg mb-2 chat-container">
        {loading ? (
          <div>Đang tải tin nhắn...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-1 p-2 rounded-lg ${
                message.senderId === user.id
                  ? "bg-blue-100 text-gray-700"
                  : "bg-green-100 text-gray-700"
              }`}
            >
              <span className="font-semibold">
                {message.senderName || user.fullName || "Thành viên"}:{" "}
              </span>
              {message.content}
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default GroupChatBox;
