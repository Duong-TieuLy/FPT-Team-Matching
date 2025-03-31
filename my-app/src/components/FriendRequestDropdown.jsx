import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

const FriendRequestDropdown = ({ showFriends, setShowFriends }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFriends(false);
      }
    };

    if (showFriends) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFriends, setShowFriends]);

  return (
    <AnimatePresence>
      {showFriends && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute right-10 top-12 bg-white shadow-lg rounded-lg w-80 p-4"
        >
          <h3 className="text-lg font-semibold text-blue-600">
            Friend Requests
          </h3>
          <div className="mt-2 space-y-3">
            <div className="flex items-center justify-between p-2 border-b">
              <img
                src="/avata.jpg"
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 ml-3">
                <p className="text-gray-700 font-medium">Jaques Amole</p>
                <p className="text-gray-500 text-sm">40 friends</p>
              </div>
              <button className="px-3 py-1 text-white bg-blue-500 rounded-md">
                Confirm
              </button>
              <button className="px-3 py-1 text-white bg-gray-600 rounded-md">
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FriendRequestDropdown;
