import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import EditProfileModal from "./EditProfileModal";

const ProfileModal = ({ onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const modalRef = useRef(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute right-5 mt-120 w-72 bg-white shadow-lg rounded-lg border border-gray-200"
      >
        <div className="bg-blue-500 text-white p-4 rounded-t-lg text-start">
          <h2 className="text-lg font-bold">Hello {user?.name}</h2>
          <p>Available</p>
        </div>

        <div className="p-4 space-y-4">
          {[
            {
              icon: "/iconProfile.png",
              title: "My Profile",
              desc: "View personal profile details.",
              onClick: () => navigate("/profile"), // Điều hướng đến /profile
            },
            {
              icon: "/iconedit.png",
              title: "Edit Profile",
              desc: "Modify your personal details.",
              onClick: () => setIsEditProfileOpen(true),
            },
            {
              icon: "/iconsetting.png",
              title: "Account settings",
              desc: "Manage your account parameters.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={item.onClick}
            >
              <img src={item.icon} className="w-9 h-9" alt={item.title} />
              <div>
                <h3 className="font-bold text-gray-700">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full p-2 bg-gray-500 text-white rounded-b-lg hover:bg-red-600"
        >
          Sign out
        </button>
        {isEditProfileOpen && (
          <EditProfileModal
            onClose={() => setIsEditProfileOpen(false)}
            user={user}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;
