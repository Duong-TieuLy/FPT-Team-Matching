import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
const API_PROJECT = import.meta.env.VITE_HOST;
const EditProfileModal = ({ onClose, user }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    gender: user?.gender || "MALE",
    email: user?.email || "",
    skills: user?.skills || [],
    hobbies: user?.hobbies || [],
    projects: user?.projects || [],
    phoneNumber: user?.phoneNumber || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value.split(",").map((item) => item.trim()),
    });
  };

  const handleSubmit = () => {
    console.log("Updated Profile:", formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-20"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative bg-white rounded-2xl shadow-lg w-[600px] p-8"
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          >
            <X className="w-7 h-7" />
          </motion.button>

          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Edit Profile
          </h2>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src="/avata.jpg"
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full text-white">
                ✎
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="border p-2 rounded-md w-full text-gray-600"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded-md w-full text-gray-600"
            />
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border p-2 rounded-md w-full text-gray-600"
            />
            <div>
              <label className="block mb-1 text-gray-700">Gender:</label>
              <div className="flex gap-4">
                {["MALE", "FEMALE", "OTHER"].map((g) => (
                  <label key={g} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                    />
                    <span className="ml-2">
                      {g.charAt(0) + g.slice(1).toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-gray-700">
                Skills (comma separated):
              </label>
              <input
                name="skills"
                value={formData.skills.join(", ")}
                onChange={(e) => handleArrayChange("skills", e.target.value)}
                placeholder="e.g. Java, Spring, SQL"
                className="border p-2 rounded-md w-full text-gray-600"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">
                Hobbies (comma separated):
              </label>
              <input
                name="hobbies"
                value={formData.hobbies.join(", ")}
                onChange={(e) => handleArrayChange("hobbies", e.target.value)}
                placeholder="e.g. Football, Coding, Reading"
                className="border p-2 rounded-md w-full text-gray-600"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">
                Projects (comma separated):
              </label>
              <input
                name="projects"
                value={formData.projects.join(", ")}
                onChange={(e) => handleArrayChange("projects", e.target.value)}
                placeholder="e.g. Website Clone, Chat App"
                className="border p-2 rounded-md w-full text-gray-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
