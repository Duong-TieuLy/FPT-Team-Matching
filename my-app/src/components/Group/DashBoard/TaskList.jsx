import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

const TaskList = () => {
    const { teamId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null); // Task hiện tại đang được chỉnh sửa
    const [newStatus, setNewStatus] = useState(""); // Trạng thái mới được chọn
    const [showModal, setShowModal] = useState(false); // Kiểm tra modal có hiển thị hay không

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/tasks/team/${teamId}`);
                setTasks(response.data);
            } catch (err) {
                setError('Không thể tải danh sách task');
            } finally {
                setLoading(false);
            }
        })();
    }, [teamId]);

    const handleEdit = (task) => {
        setSelectedTask(task); // Cập nhật task đang chỉnh sửa
        setNewStatus(task.status); // Gán trạng thái hiện tại cho modal
        setShowModal(true); // Hiển thị modal
    };

    const handleStatusChange = (status) => {
        setNewStatus(status); // Cập nhật trạng thái mới
    };

    const handleSave = async () => {
        try {
            const leaderId = localStorage.getItem("userId"); // Lấy leaderId từ localStorage (hoặc bất kỳ nơi nào bạn lưu trữ)

            // Cập nhật trạng thái task thông qua API PUT
            await axios.put(`http://localhost:8080/api/tasks/${selectedTask.id}/status?leaderId=${leaderId}`, {
                newStatus: newStatus // Truyền trạng thái mới trong body của request
            });

            // Đóng modal sau khi lưu
            setShowModal(false);

            // Tải lại danh sách task mới
            const response = await axios.get(`http://localhost:8080/api/tasks/team/${teamId}`);
            setTasks(response.data);
        } catch (err) {
            console.error('Error updating task status:', err);
            alert('Cập nhật trạng thái thất bại. Vui lòng thử lại!');
        }
    };

    const handleDelete = async (taskId) => {
        try {
            const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage (hoặc nơi bạn lưu trữ)

            await axios.delete(`http://localhost:8080/api/tasks/${taskId}?userId=${userId}`);

            const response = await axios.get(`http://localhost:8080/api/tasks/team/${teamId}`);
            setTasks(response.data);

            alert('Task đã được xóa thành công!');
        } catch (err) {
            console.error('Error deleting task:', err);
            alert('Xóa task thất bại. Vui lòng thử lại!');
        }
    };

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Task List</h2>
            {tasks.length === 0 ? (
                <div className="text-gray-600">Không có task nào</div>
            ) : (
                tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => handleEdit(task)}
                        onDelete={() => handleDelete(task.id)}
                    />
                ))
            )}

            {/* Modal Edit Status */}
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Update Status</h3>
                        <div className="space-y-4">
                            {["IN_PROGRESS", "COMPLETED", "NOT_COMPLETED"].map((status) => (
                                <div key={status} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={status}
                                        name="status"
                                        value={status}
                                        checked={newStatus === status}
                                        onChange={() => handleStatusChange(status)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={status}>{status.replace("_", " ")}</label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TaskCard = ({ task, onEdit, onDelete }) => {
    const statusStyles = {
        "IN_PROGRESS": "bg-orange-100 text-orange-800",
        "COMPLETED": "bg-green-200 text-green-800",
        "NOT_COMPLETED": "bg-red-200 text-red-800",
    };

    return (
        <article className="flex flex-col md:flex-row md:items-center bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 relative border border-gray-200">
            <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 md:mb-1" title={task.taskName}>
                    {task.taskName}
                </h2>
                <p className="text-gray-700 mb-4 md:mb-2 leading-relaxed">{task.description}</p>
                <div className="flex items-center space-x-4 text-gray-700 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                        <span>{task.assignedStudentName || "Chưa giao"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <i className="far fa-calendar-alt"></i>
                        <time dateTime={task.deadline}>Deadline: {task.deadline}</time>
                    </div>
                    <div>
                        <span className={`inline-block px-3 py-1 rounded-full ${statusStyles[task.status]} font-semibold select-none`}>
                            {task.status.replace("_", " ")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2 mt-4 md:mt-0 md:ml-4">
                <button
                    onClick={onEdit}
                    className="flex items-center justify-center p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200"
                    aria-label="Edit task"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="ml-1 hidden md:inline">Edit</span>
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center justify-center p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                    aria-label="Delete task"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="ml-1 hidden md:inline">Delete</span>
                </button>
            </div>
        </article>
    );
};

export default TaskList;
