import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
const API_PROJECT = import.meta.env.VITE_HOST;
const CreateGroupForm = ({ onCreate, onClose }) => {
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    teamName: "",
    description: "",
    teamType: "ACADEMIC",
    teamPicture: "/avata.jpg",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === "LECTURER") {
      setFormData((prev) => ({
        ...prev,
        teamType: "ACADEMIC",
      }));
    }
  }, [user]);

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    const res = await axios.post(`${API_PROJECT}/api/upload`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.url; // ví dụ: http://localhost:8080/uploads/image.jpg
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedUrl = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        teamPicture: uploadedUrl,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_PROJECT}/api/teams`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        onCreate && onCreate(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error details:", error.response?.data);
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 w-[500px]"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-4">Create New Team</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Team Picture */}
            <div className="flex justify-center mb-4">
              <label className="relative cursor-pointer">
                <img
                  src={formData.teamPicture}
                  alt="Team"
                  className="w-32 h-32 rounded-full object-cover border-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 4v16m8-8H4"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </label>
            </div>

            {/* Team Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Team Name
              </label>
              <input
                type="text"
                value={formData.teamName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, teamName: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows="3"
                required
              />
            </div>

            {/* Team Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Team Type
              </label>
              {user?.role === "LECTURER" ? (
                <input
                  type="text"
                  value="ACADEMIC"
                  disabled
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600"
                />
              ) : (
                <select
                  value={formData.teamType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      teamType: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="ACADEMIC">Academic Team</option>
                  <option value="NON_ACADEMIC">External Team</option>
                </select>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white ${
                  loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {loading ? "Creating..." : "Create Team"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateGroupForm;
