import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarItem from "./SidebarItem";
import { useAuth } from "../../../context/useAuth.jsx";

const OtherSection = ({ onMemberClick, onRequestClick, onRatingClick }) => {
  const [teamRes, setTeamRes] = useState(null); // Để lưu thông tin nhóm
  const [isRatingAllowed, setIsRatingAllowed] = useState(false); // Kiểm tra xem người dùng có thể mở form Rating hay không
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem("token");
        const teamId = window.location.href.split("/").pop(); // Lấy teamId từ URL

        // Gọi API để lấy thông tin nhóm
        const response = await axios.get(
          `http://localhost:8080/api/teams/${teamId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeamRes(response.data); // Lưu thông tin nhóm vào state
        console.log("user_id ", user.id);
        console.log("Team Res: ", response.data);
        // Kiểm tra nếu userId giống với leaderId, cho phép mở form Rating
        if (response.data.leaderId === user.id) {
          setIsRatingAllowed(true);
        } else {
          setIsRatingAllowed(false);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhóm: ", error);
      }
    };

    fetchTeamData();
  }, []); // Chạy một lần khi component mount

  return (
    <div>
      <SidebarItem
        label="Member"
        icon={<span className="text-green-500">●</span>}
        onClick={onMemberClick}
      />
      <SidebarItem
        label="Member Request"
        icon={<span className="text-yellow-500">●</span>}
        onClick={onRequestClick}
      />
      {/* Không hiển thị SidebarItem "Ratings" nếu không có quyền */}
      {isRatingAllowed && (
        <SidebarItem
          label="Ratings"
          icon={<span className="text-yellow-500">●</span>}
          onClick={onRatingClick}
        />
      )}
      <SidebarItem
        label="Files"
        icon={<span className="text-red-500">●</span>}
        badge="10"
      />
      <SidebarItem
        label="Transfer leader"
        icon={<span className="text-blue-500">●</span>}
      />
      <SidebarItem
        label="Out group"
        icon={<span className="text-black-500">●</span>}
      />
    </div>
  );
};

export default OtherSection;
