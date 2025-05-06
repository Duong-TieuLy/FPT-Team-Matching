import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
const API_PROJECT = import.meta.env.VITE_HOST;
const FriendRequestDropdown = ({ showFriends, setShowFriends }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        console.log("TOKEN:", token);
        console.log("USER ID:", userId);
        if (!token || !userId) {
          console.warn("Missing token or user ID");
          return;
        }

        const res = await axios.get(
          `${API_PROJECT}/api/friends/pending/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPendingRequests(res.data);
      } catch (error) {
        console.error("Failed to fetch pending friend requests:", error);
      }
    };

    if (showFriends) {
      fetchPendingRequests();
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFriends]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowFriends(false);
    }
  };

  const handleConfirm = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_PROJECT}/api/friends/${requestId}/respond?accept=true`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật lại danh sách lời mời
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error confirming friend request:", error);
    }
  };

  const handleDelete = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_PROJECT}/api/friends/${requestId}/respond?accept=false`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error deleting friend request:", error);
    }
  };

  return (
    <AnimatePresence>
      {showFriends && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute right-10 top-12 bg-white shadow-lg rounded-lg w-80 p-4 z-50"
        >
          <h3 className="text-lg font-semibold text-blue-600">
            Friend Requests
          </h3>
          <div className="mt-2 space-y-3 max-h-96 overflow-y-auto">
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500">No pending requests.</p>
            ) : (
              pendingRequests.map((request) => {
                const { requester } = request;
                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-2 border-b"
                  >
                    <img
                      src={requester.profilePicture || "/avata.jpg"}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 ml-3">
                      <p className="text-gray-800 font-medium">
                        {requester.fullName}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {requester.userID?.major || "Unknown major"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirm(request.id)}
                        className="px-3 py-1 text-white bg-blue-500 rounded-md text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="px-3 py-1 text-white bg-gray-600 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FriendRequestDropdown;
