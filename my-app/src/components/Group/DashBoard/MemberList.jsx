import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import AddMember from "./AddMember";
import AssignLecturer from "./AssignLecturer";
const API_PROJECT = import.meta.env.VITE_HOST;
const MemberList = () => {
  const { teamId } = useParams();
  const [members, setMembers] = useState([]);
  const [teamType, setTeamType] = useState(""); // "ACADEMIC" or "COMMUNITY"
  const [hasLecturer, setHasLecturer] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [isLecturer, setIsLecturer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // Để xử lý loading khi xoá
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAssignLecturer, setShowAssignLecturer] = useState(false);

  const currentUserId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_PROJECT}/api/teams/${teamId}/members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMembers(res.data);

        const lecturerExists = res.data.some(
          (member) => member.type === "LECTURER"
        );
        const leader = res.data.find((member) => member.type === "LEADER");
        const current = res.data.find((member) => member.id === currentUserId);

        setHasLecturer(lecturerExists);
        setIsLeader(current?.type === "LEADER");
        setIsLecturer(current?.type === "LECTURER");

        const teamRes = await axios.get(`${API_PROJECT}/api/teams/${teamId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Team Res: ", teamRes.data);

        setTeamType(teamRes.data?.teamType || "");
      } catch (error) {
        console.error("Lỗi khi tải danh sách thành viên:", error);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) fetchMembers();
  }, [teamId, currentUserId]);

  const handleDeleteMember = async (studentIdToRemove) => {
    if (!window.confirm("Bạn có chắc muốn xóa thành viên này khỏi nhóm?"))
      return;

    try {
      setDeletingId(studentIdToRemove);
      const token = localStorage.getItem("token");

      await axios.delete(`${API_PROJECT}/api/teams/${teamId}/remove-student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          studentIdToRemove,
        },
      });

      setMembers((prev) =>
        prev.filter((member) => member.id !== studentIdToRemove)
      );
      alert("Xoá thành viên thành công!");
    } catch (error) {
      console.error("Lỗi khi xoá thành viên:", error);
      alert("Xoá thất bại. Bạn không thể xoá thành viên này.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div>Đang tải danh sách thành viên...</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Members</h2>
        <div className="flex gap-2">
          {(isLeader || isLecturer) && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => setShowAddMember((prev) => !prev)}
            >
              + Add Member
            </button>
          )}
          {teamType === "ACADEMIC" && isLeader && !hasLecturer && (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={() => setShowAssignLecturer(true)}
            >
              + Invite Lecturer
            </button>
          )}
        </div>
      </div>

      <ul className="space-y-2">
        {members.map((member, index) => {
          const isBothLeaderAndLecturer =
            member.type === "LEADER" && member.type === "LECTURER";

          const canRemove =
            (isLeader || isLecturer) && !isBothLeaderAndLecturer;
          return (
            <motion.li
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <img
                  src={member.memberPicture}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <span className="font-medium">{member.fullName}</span>
                  <div className="text-sm text-gray-500">{member.type}</div>
                </div>
              </div>
              {canRemove && (
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  disabled={deletingId === member.id}
                  className={`text-red-500 hover:text-red-700 ${
                    deletingId === member.id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {deletingId === member.id ? "Removing..." : "Remove"}
                </button>
              )}
            </motion.li>
          );
        })}
      </ul>
      {/* ✅ Hiển thị component AddMember khi cần */}
      {showAddMember && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
            <AddMember
              teamId={teamId}
              onClose={() => setShowAddMember(false)}
              onAddSuccess={(newMember) => {
                setMembers((prev) => [...prev, newMember]);
              }}
            />
          </div>
        </div>
      )}

      {showAssignLecturer && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
            <AssignLecturer
              teamId={teamId}
              onClose={() => setShowAssignLecturer(false)}
              onAssignSuccess={(newLecturer) => {
                setMembers((prev) => [...prev, newLecturer]);
                setHasLecturer(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;
