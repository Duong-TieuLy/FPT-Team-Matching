import { useState } from "react";
import axios from "axios";
import NotificationBar from "./NotificationBar";
import Sidebar from "./Sidebar";
import MemberList from "./DashBoard/MemberList";
import MemberRequestList from "./DashBoard/MemberRequestList";
import GroupChatBox from "./DashBoard/GroupChatBox"; // Import thêm Chat Box
import RatingForm from "./DashBoard/RatingForm";
import TaskList from "./DashBoard/TaskList";
import ChangeLeader from "./DashBoard/ChangeLeader";
import OutGroupModel from "./DashBoard/OutGroupModel";
import { useParams } from "react-router-dom";
const API_PROJECT = import.meta.env.VITE_HOST;
const GroupDashBoard = () => {
  const [activeTab, setActiveTab] = useState("");
  const [showOutGroupModel, setShowOutGroupModel] = useState(false);
  const { teamId } = useParams();
  const members = [
    {
      name: "Alice",
      avatar: "/avata.jpg",
    },
    { name: "Bob", avatar: "/avata.jpg" },
    {
      name: "Charlie",
      avatar: "/avata.jpg",
    },
    { name: "David", avatar: "/avata.jpg" },
  ];

  const memberRequests = [
    {
      name: "Nguyễn Văn A",
      avatar: "/avata.jpg",
    },
    {
      name: "Trần Thị B",
      avatar: "/avata.jpg",
    },
  ];

  const handleOutGroup = async () => {
    if (!window.confirm("Bạn có chắc muốn rời nhóm?")) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      const userId = localStorage.getItem("userId");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Xác thực bằng JWT
        },
        params: {
          userId: userId,
        },
      };

      const response = await axios.delete(
        `${API_PROJECT}/api/teams/${teamId}/leave`,
        config
      );
      console.log(response.data); // Hiển thị thông báo thành công
      setShowOutGroupModel(false); // Đóng modal sau khi rời nhóm thành công
      alert("Rời nhóm thành công!");
    } catch (error) {
      console.error("Có lỗi khi rời nhóm:", error.response?.data || error);
      setShowOutGroupModel(false); // Đóng modal nếu có lỗi
      alert("Rời nhóm thất bại.");
    }
  };

  const handleCancelOutGroup = () => {
    setShowOutGroupModel(false); // Đóng modal nếu người dùng hủy
  };

  return (
    <main className="flex justify-center bg-gray-100 min-h-screen pt-20">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-4">
        <div className="w-full">
          <NotificationBar groupName="Team Awesome" notificationCount={5} />
          <div className="flex gap-4">
            <Sidebar
              onMemberClick={() =>
                setActiveTab(activeTab === "members" ? "" : "members")
              }
              onRequestClick={() =>
                setActiveTab(activeTab === "requests" ? "" : "requests")
              }
              onTaskClick={() =>
                setActiveTab(activeTab === "tasking" ? "" : "tasking")
              }
              onRatingClick={() =>
                setActiveTab(activeTab === "rating" ? "" : "rating")
              }
              onChangeLeaderClick={() =>
                setActiveTab(activeTab === "changing" ? "" : "changing")
              }
              onOutGroupClick={() => setShowOutGroupModel(true)}
            />
            <div className="w-3/4 bg-gray-50 p-6 rounded-lg shadow-inner">
              <h1 className="text-2xl font-semibold mb-4">Dashboard Content</h1>
              {activeTab === "members" && <MemberList members={members} />}
              {activeTab === "tasking" && <TaskList />}
              {activeTab === "requests" && (
                <MemberRequestList requests={memberRequests} />
              )}
              {activeTab === "rating" && <RatingForm />}
              {activeTab === "changing" && <ChangeLeader />}
              {/* Hiển thị Box Chat ở đây */}
              {activeTab === "" && <GroupChatBox groupName="Team Awesome" />}
            </div>
          </div>
        </div>
      </div>

      {showOutGroupModel && (
        <OutGroupModel
          message="Bạn xác định muốn rời nhóm chứ?"
          onConfirm={handleOutGroup}
          onCancel={handleCancelOutGroup}
        />
      )}
    </main>
  );
};

export default GroupDashBoard;
