import { Users, Bell } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CreateTaskForm from "./CreateTaskForm";  // 👉 import form riêng
import axios from "axios";

const NotificationBar = ({ groupName, notificationCount }) => {
    const { teamId } = useParams();
    const [isLeader, setIsLeader] = useState(false);
    const [showCreateTask, setShowCreateTask] = useState(false);

    const currentUserId = parseInt(localStorage.getItem("userId"));

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`/api/teams/${teamId}/members`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const current = res.data.find(member => member.id === currentUserId);
                setIsLeader(current?.type === "LEADER");
            } catch (error) {
                console.error("Lỗi khi fetch role:", error);
            }
        };

        if (teamId && currentUserId) fetchRole();
    }, [teamId, currentUserId]);

    const handleAddTaskClick = () => setShowCreateTask(true);
    const handleCloseForm = () => setShowCreateTask(false);

    return (
        <>
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md mb-4">
                <div className="flex items-center gap-2">
                    <Users className="text-blue-500" />
                    <Link to="/group" className="text-blue-600 font-semibold hover:underline">
                        group
                    </Link>
                    <span className="font-semibold"> &gt; {groupName}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Bell className="text-blue-500" />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {notificationCount}
              </span>
                        )}
                    </div>
                    {isLeader && ( // ✅ chỉ leader mới thấy Add Task
                        <button
                            onClick={handleAddTaskClick}
                            className="bg-green-100 text-green-700 px-4 py-1 rounded-md hover:bg-green-200"
                        >
                            Add Task
                        </button>
                    )}
                </div>
            </div>

            {showCreateTask && (
                <CreateTaskForm onClose={handleCloseForm} teamId={teamId} />
            )}
        </>
    );
};

export default NotificationBar;
