import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGroupContext } from "../../context/GroupContext";

const CommunityGroups = () => {
  const [communityGroups, setCommunityGroups] = useState([]);
  const { isGroupPending, addPendingGroup, isGroupJoined } = useGroupContext();

  useEffect(() => {
    const fetchCommunityGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/teams/community-available", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const groupsWithMemberCount = await Promise.all(response.data.map(async (group) => {
          // Lấy số lượng thành viên cho từng nhóm
          const memberCountResponse = await axios.get(`http://localhost:8080/api/teams/${group.id}/members/count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          group.memberCount = memberCountResponse.data; // Gán số lượng thành viên vào nhóm
          return group;
        }));
        setCommunityGroups(groupsWithMemberCount);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhóm cộng đồng:", error);
      }
    };

    fetchCommunityGroups();
  }, []);

  const handleJoinGroup = (groupId) => {
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("userId");

    if (!studentId) {
      alert("Chưa đăng nhập!");
      return;
    }

    axios
        .post(`http://localhost:8080/api/teams/teams/${groupId}/join?studentId=${studentId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          addPendingGroup(groupId); // Thêm nhóm vào danh sách nhóm đang chờ xử lý
        })
        .catch((error) => {
          console.error("Lỗi khi gửi yêu cầu tham gia nhóm:", error);
        });
  };

  const renderGroupList = (groupList) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {groupList.map((group) => {
          const isPending = isGroupPending(group.id);
          const isJoined = isGroupJoined(group.id);
          console.log(group);
          return (
              <div key={group.id} className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <img
                    src={group.teamPicture || "/avata.jpg"}
                    alt={group.teamName}
                    className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                />
                <h2 className="text-lg font-semibold text-blue-600">{group.teamName}</h2>
                <p className="text-xs text-gray-400 mb-1">
                  {group.teamType ? (group.teamType === "ACADEMIC" ? "ACADEMIC" : "NON_ACADEMIC") : ""}
                </p>
                <p className="text-gray-500 text-sm">{group.description}</p>
                <div className="flex justify-around text-sm text-gray-700 mt-4">
                  <span>Member: {group.memberCount || 0}</span>
                </div>
                {isPending && <p className="text-yellow-500 text-sm">Waiting for leader</p>}
                <button
                    className={`mt-4 py-2 px-4 rounded-full cursor-pointer ${
                        isJoined
                            ? "bg-green-500 text-white"
                            : isPending
                                ? "bg-gray-400"
                                : "bg-blue-500 text-white"
                    }`}
                    onClick={() => {
                      if (!isJoined && !isPending) {
                        handleJoinGroup(group.id);
                      }
                    }}
                    disabled={isPending}
                >
                  {isJoined
                      ? "Joined"
                      : isPending
                          ? "Waiting for leader"
                          : "Request to join"}
                </button>
              </div>
          );
        })}
      </div>
  );

  return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">Community Group</h2>
        {renderGroupList(communityGroups)}
      </div>
  );
};

export default CommunityGroups;
