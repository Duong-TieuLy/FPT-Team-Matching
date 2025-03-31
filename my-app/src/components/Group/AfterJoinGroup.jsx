import { useState } from "react";
import NotificationBar from "./NotificationBar";
import Sidebar from "./Sidebar";
import MemberList from "./DashBoard/MemberList";
import MemberRequestList from "./DashBoard/MemberRequestList";
import GroupChatBox from "./DashBoard/GroupChatBox"; // Import thêm Chat Box

const GroupDashBoard = () => {
  const [activeTab, setActiveTab] = useState(""); // Lưu trạng thái tab đang được chọn
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
            />
            <div className="w-3/4 bg-gray-50 p-6 rounded-lg shadow-inner">
              <h1 className="text-2xl font-semibold mb-4">Dashboard Content</h1>
              {activeTab === "members" && <MemberList members={members} />}
              {activeTab === "requests" && (
                <MemberRequestList requests={memberRequests} />
              )}
              {/* Hiển thị Box Chat ở đây */}
              {activeTab === "" && <GroupChatBox groupName="Team Awesome" />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GroupDashBoard;
