import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const API_PROJECT = import.meta.env.VITE_HOST;
const CreateTaskForm = ({ onClose }) => {
  const { teamId } = useParams();
  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    deadline: "",
    assignedStudentId: "",
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_PROJECT}/api/teams/${teamId}/members/task`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeamMembers(response.data);
      } catch (error) {
        console.error("Lỗi khi tải thành viên:", error);
      } finally {
        setLoadingMembers(false);
      }
    };

    if (teamId) fetchTeamMembers();
  }, [teamId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const leaderId = localStorage.getItem("userId");

      await axios.post(`${API_PROJECT}/api/tasks/${teamId}/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        params: { leaderId },
      });

      alert("Tạo task thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo task:", error);
      alert("Tạo task thất bại.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
          <i className="fas fa-tasks text-blue-600"></i> Create New Task
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Tên task */}
          <div>
            <label
              htmlFor="taskName"
              className="block text-gray-700 font-medium mb-1"
            >
              Task Name <span className="text-red-500">*</span>
            </label>
            <input
              id="taskName"
              name="taskName"
              type="text"
              placeholder="Nhập tên task"
              value={formData.taskName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Mô tả chi tiết task"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Giao cho */}
          <div>
            <label
              htmlFor="assignedStudentId"
              className="block text-gray-700 font-medium mb-1"
            >
              Assign to <span className="text-red-500">*</span>
            </label>
            {loadingMembers ? (
              <div className="text-gray-500 italic">Loading...</div>
            ) : teamMembers.length === 0 ? (
              <div className="text-red-500 italic">
                No team members available for assignment.
              </div>
            ) : (
              <select
                id="assignedStudentId"
                name="assignedStudentId"
                value={formData.assignedStudentId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Member</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.fullName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label
              htmlFor="deadline"
              className="block text-gray-700 font-medium mb-1"
            >
              Deadline
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <i className="fas fa-save"></i> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
