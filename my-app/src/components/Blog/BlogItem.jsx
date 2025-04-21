import { useState, useEffect, useRef } from "react";
import { MoreVertical, ThumbsUp, MessageCircle } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import LoginModal from "../LoginModal";
import axios from "axios";
// import { Client, stompClientRef, SockJS } from "@stomp/stompjs";

const BlogItem = ({ postId, name, avatar, images, time, content, like }) => {
  const { isLoggedIn, user, token } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [likeCount, setLikeCount] = useState(like);
  const [liked, setLiked] = useState(false);
  // const stompClient = useRef(null);
  // useEffect(() => {
  //   const socket = new Client({
  //     brokerURL: "ws://localhost:8080/ws",
  //     onConnect: () => {
  //       console.log("Connected!");
  //     },
  //     onDisconnect: () => {
  //       console.log("Disconnected!");
  //     },
  //   });

  //   socket.activate();

  //   return () => {
  //     socket.deactivate(); // Đảm bảo dừng khi component unmount
  //   };
  // }, []);

  const handleLike = async () => {
    if (!isLoggedIn) return setShowLogin(true);

    try {
      await axios.post(
        "http://localhost:8080/api/blogs/like",
        {
          postId,
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Chỉ cập nhật trên frontend, không socket gì cả
      setLikeCount((prev) => prev + (liked ? -1 : 1));
      setLiked(!liked);
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  return (
    <>
      <div className="p-4 mt-4 bg-white rounded-lg shadow relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500">{time}</p>
            </div>
          </div>

          {/* Menu icon */}
          <button
            onClick={() => {
              if (!isLoggedIn) return setShowLogin(true);
              setShowMenu(!showMenu);
            }}
            className="p-2 rounded-full cursor-pointer bg-blue-300"
          >
            <MoreVertical size={20} />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-4 top-12 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
              <button className="w-full px-4 py-2 text-left bg-gray-100 cursor-pointer text-blue-700">
                Kết bạn
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <p className="mt-3 text-gray-700">{content}</p>

        {/* Images */}
        {images && (
          <div className="w-full max-h-[600px] overflow-hidden rounded-lg mt-3">
            <img
              src={images}
              alt="Blog"
              className="w-full h-auto max-h-[600px] object-cover"
            />
          </div>
        )}

        {/* Like & comment */}
        <div className="mt-3">
          <div className="flex justify-between items-center p-3 border-t border-gray-200 rounded-lg bg-gray-100">
            <button
              className={`flex items-center gap-2 cursor-pointer ${
                liked ? "text-blue-500 scale-105" : "text-gray-700"
              } transition-all duration-200 ease-in-out`}
              onClick={handleLike}
            >
              <ThumbsUp
                size={18}
                className={`mr-2 ${liked ? "text-blue-500" : ""}`}
              />
              {likeCount} Thích
            </button>
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-blue-500 cursor-pointer"
              onClick={() => {
                if (!isLoggedIn) return setShowLogin(true);
              }}
            >
              <MessageCircle size={18} className="mr-2" />
              Bình luận
            </button>
          </div>
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default BlogItem;
