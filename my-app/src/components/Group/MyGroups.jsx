import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.jsx";
const API_PROJECT = import.meta.env.VITE_HOST;
const MyGroups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token không tồn tại");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_PROJECT}/api/teams/user/${user.username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Không thể tải danh sách nhóm");
        const data = await response.json();
        // Lấy số lượng thành viên cho từng nhóm
        for (let group of data) {
          const countResponse = await fetch(
            `${API_PROJECT}/api/teams/${group.id}/members/count`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (countResponse.ok) {
            const memberCount = await countResponse.json();
            group.members = memberCount; // Gán số lượng thành viên vào mỗi nhóm
          } else {
            group.members = 0; // Nếu không lấy được số lượng thành viên, gán là 0
          }
        }
        setMyGroups(data);
      } catch (error) {
        console.error("Lỗi khi tải nhóm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  const handleCreateGroup = (newGroup) => {
    const formattedGroup = {
      teamName: newGroup.teamName,
      description: newGroup.description,
      photo: newGroup.teamPicture,
      members: newGroup.members ? newGroup.members.length : 1,
    };
  };

  const renderGroupList = (groupList) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {groupList.map((group, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-2xl shadow-lg text-center"
        >
          <img
            src={group.teamPicture || "/avata.jpg"} // Hình ảnh mặc định
            alt={group.teamName}
            className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
          />
          <h2 className="text-lg font-semibold text-blue-600">
            {group.teamName}
          </h2>
          <p className="text-xs text-gray-400 mb-1">
            {group.teamType
              ? group.teamType === "ACADEMIC"
                ? "ACADEMIC"
                : "NON_ACADEMIC"
              : ""}
          </p>
          <p className="text-gray-500 text-sm">{group.description}</p>
          <div className="flex justify-around text-sm text-gray-700 mt-4">
            <span>Member: {group.members}</span>
          </div>
          <button
            className="mt-4 py-2 px-4 rounded-full bg-blue-500 text-white cursor-pointer"
            onClick={() => {
              navigate(`/group/${group.id}`);
            }}
          >
            Join
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Nhóm của tôi</h2>
      {loading ? (
        <p className="text-center">Loading...</p> // Hiển thị khi đang tải dữ liệu
      ) : myGroups.length > 0 ? (
        renderGroupList(myGroups)
      ) : (
        <p className="text-center">You are not a member of any groups.</p>
      )}
    </div>
  );
};

export default MyGroups;
