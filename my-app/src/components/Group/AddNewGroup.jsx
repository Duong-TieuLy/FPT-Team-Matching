import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { useAuth } from "../../context/useAuth";
import EditUser from "../EditUser";

const CreateGroupForm = ({ onCreate, onClose }) => {
  const { user, token } = useAuth();
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [comments, setComments] = useState([]); // Thêm state cho comments
  const [commentsLoading, setCommentsLoading] = useState(false); // Thêm state loading cho comments
  const [commentsError, setCommentsError] = useState(null); // Thêm state error cho comments

  useEffect(() => {
    console.log("Current user:", user);
    console.log("User role:", user?.role);
    console.log("User ID:", user?.id);
    console.log("Auth token:", token);

    if (user?.role === "LECTURER") {
      setFormData(prev => ({
        ...prev,
        teamType: "NON_ACADEMIC"
      }));
    }

    // Gọi API để lấy danh sách comment của blog (giả sử blogId = 1)
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/comments/blog/1");
        setComments(response.data);
      } catch (err) {
        setCommentsError("Không thể tải danh sách comment");
        console.error(err);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [user, token]);

  const [formData, setFormData] = useState({
    teamName: "",
    description: "",
    teamType: "ACADEMIC",
    teamPicture: "/avata.jpg"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        teamPicture: imageUrl
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Sending request with user:", user);
      console.log("Token:", token);

      let teamPictureUrl = formData.teamPicture;

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        const uploadResponse = await axios.post(
          "http://localhost:8080/api/teams/upload",
          uploadData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        teamPictureUrl = uploadResponse.data;
      }

      const requestData = {
        teamName: formData.teamName,
        description: formData.description,
        teamType: formData.teamType,
        teamPicture: teamPictureUrl
      };

      const response = await axios.post(
        "http://localhost:8080/api/teams",
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log("Response:", response.data);

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
          onClick={e => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-4">Create New Team</h2>

          {user && (
            <div className="mb-4">
              <button
                onClick={() => setShowEditUser(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Chỉnh sửa thông tin cá nhân
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Team Name</label>
              <input
                type="text"
                value={formData.teamName}
                onChange={e => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Team Type</label>
              {user?.role === "LECTURER" ? (
                  <input
                      type="text"
                      value="External Team"
                      disabled
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600"
                  />
              ) : (
                  <select
                      value={formData.teamType}
                      onChange={e => setFormData(prev => ({ ...prev, teamType: e.target.value }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      required
                  >
                    <option value="ACADEMIC">Academic Team</option>
                    <option value="NON_ACADEMIC">External Team</option>
                  </select>
              )}
            </div>

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
                  loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Creating...' : 'Create Team'}
              </button>
            </div>
          </form>

          {/* Hiển thị danh sách comment của blog */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Bình luận của Blog (Ví dụ)</h3>
            {commentsLoading && <p>Đang tải comment...</p>}
            {commentsError && <p className="text-red-500">{commentsError}</p>}
            {!commentsLoading && !commentsError && comments.length === 0 && <p>Chưa có comment nào.</p>}
            {!commentsLoading && !commentsError && comments.length > 0 && (
              <ul className="space-y-4">
                {comments.map(comment => (
                  <li key={comment.id} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{comment.author.username}</p> {/* Hiển thị username của author */}
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {showEditUser && (
            <EditUser
              userId={user.id}
              onClose={() => setShowEditUser(false)}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateGroupForm;