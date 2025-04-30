import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const ChangeLeader = () => {
    const { teamId } = useParams();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newLeaderId, setNewLeaderId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`http://localhost:8080/api/teams/${teamId}/members/task`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMembers(res.data);
            } catch (error) {
                console.error("Error fetching members:", error);
            } finally {
                setLoading(false);
            }
        };

        if (teamId) fetchMembers();
    }, [teamId]);

    const handleChangeLeader = async () => {
        if (!newLeaderId) {
            alert("Please select a member to be the new leader.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            // Lấy currentUserId từ localStorage
            const currentUserId = localStorage.getItem("userId"); // Giả sử bạn đã lưu userId khi login

            // Gửi yêu cầu PUT tới backend
            const response = await axios.put(
                `http://localhost:8080/api/teams/${teamId}/change-leader`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        currentUserId: currentUserId,
                        newLeaderId: newLeaderId,
                    },
                }
            );

            setSuccessMessage(response.data); // Hiển thị thông báo từ backend
            setErrorMessage(""); // Reset thông báo lỗi
        } catch (error) {
            console.error("Error changing leader:", error);
            setErrorMessage("Failed to change leader. Please try again.");
            setSuccessMessage(""); // Reset thông báo thành công
        }
    };

    if (loading) return <div>Loading members...</div>;

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Change Leader</h2>

            <ul className="space-y-2 mb-4">
                {members.map((member, index) => (
                    <motion.li
                        key={member.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex items-center justify-between gap-2 p-2 rounded-md cursor-pointer 
                            ${newLeaderId === member.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
                        onClick={() => setNewLeaderId(member.id)}
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={member.profilePicture || "/default-avatar.png"}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="font-medium">{member.fullName}</span>
                        </div>
                        {newLeaderId === member.id && (
                            <span className="text-blue-500 font-bold">Selected</span>
                        )}
                    </motion.li>
                ))}
            </ul>

            <button
                onClick={handleChangeLeader}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
                Change
            </button>

            {successMessage && (
                <div className="mt-4 text-green-600">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="mt-4 text-red-600">{errorMessage}</div>
            )}
        </div>
    );
};

export default ChangeLeader;
