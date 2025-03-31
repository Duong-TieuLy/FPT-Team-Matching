import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

const EditProfileModal = ({ onClose, user }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    userName: user?.userName || "",
    city: user?.city || "",
    dateOfBirth: user?.dateOfBirth || "",
    maritalStatus: user?.maritalStatus || "Single",
    age: user?.age || "",
    country: user?.country || "USA",
    state: user?.state || "",
    address: user?.address || "",
    gender: user?.gender || "Male",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md transition-opacity duration-300 z-20"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative bg-white bg-opacity-90 rounded-[30px] shadow-lg w-[800px] flex overflow-hidden"
        >
          {/* Nút đóng */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          >
            <X className="w-7 h-7 cursor-pointer" />
          </motion.button>

          <div className="w-full p-8 backdrop-blur-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Personal Information
            </h2>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src="/avata.jpg"
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full text-white">
                  ✎
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["Fullname", "city", "hoc ki", "address"].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  className="border p-2 rounded-md w-full text-gray-600"
                />
              ))}
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="border p-2 rounded-md w-full text-gray-600"
              >
                <option>Teacher</option>
                <option>Student</option>
              </select>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onClose}
                className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer   "
              >
                Submit
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
