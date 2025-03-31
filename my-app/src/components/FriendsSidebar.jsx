import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../context/useAuth";
import BoxChatMini from "./BoxChatMini";

const friendsList = [
  {
    name: "Anna Sthesia",
    status: "Just Now",
    avatar: "/avata.jpg",
    user: "lecturer",
  },
  {
    name: "Paul Molive",
    status: "Admin",
    avatar: "/avata.jpg",
    user: "lecturer",
  },
  {
    name: "Paige Turner",
    status: "Admin",
    avatar: "/avata.jpg",
    user: "student",
  },
];

export default function FriendsSidebar({ isOpen, toggleSidebar }) {
  const { isLoggedIn } = useAuth();
  const sidebarRef = useRef(null);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleSidebar]);

  return (
    <>
      {/* Nút toggle */}
      <button
        onClick={toggleSidebar}
        disabled={!isLoggedIn}
        className={`fixed top-1/2 right-0 transform -translate-y-1/2 p-3 rounded-l-full shadow-lg ${
          isLoggedIn
            ? "bg-blue-500 text-white"
            : "bg-blue-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Sidebar danh sách bạn bè */}
      <div
        ref={sidebarRef}
        className={`fixed top-20 right-0 h-full bg-white shadow-lg w-72 transition-all duration-500 ease-in-out transform z-20 rounded-2xl ${
          isOpen
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        }`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Friends</h2>
          <div className="space-y-3">
            {friendsList.map((friend, index) => (
              <button
                key={index}
                onClick={() => setActiveChat(friend)}
                className="flex items-center gap-3 p-3 border rounded-lg w-full text-left hover:bg-gray-100 transition cursor-pointer"
              >
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{friend.name}</p>
                  <p className="text-sm text-gray-500">{friend.user}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hiển thị Chat Box */}
      {activeChat && (
        <BoxChatMini user={activeChat} onClose={() => setActiveChat(null)} />
      )}
    </>
  );
}
