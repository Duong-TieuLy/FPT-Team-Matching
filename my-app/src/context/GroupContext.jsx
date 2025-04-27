import React, { createContext, useContext, useState, useEffect } from "react";
const GroupContext = createContext();

export const useGroupContext = () => useContext(GroupContext);

export const GroupProvider = ({ children }) => {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [pendingGroups, setPendingGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);

  // Thêm các state mới để quản lý thông tin nhóm
  const [teamType, setTeamType] = useState(""); // "ACADEMIC" or "COMMUNITY"
  const [isLeader, setIsLeader] = useState(false);
  const [hasLecturer, setHasLecturer] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) {
      setUsername(savedUser);
    }
  }, []);

  const addPendingGroup = (groupName) => {
    setPendingGroups((prev) => [...prev, groupName]);
  };

  const removePendingGroup = (groupName) => {
    setPendingGroups((prev) => prev.filter((name) => name !== groupName));
  };

  const joinGroup = (groupName) => {
    removePendingGroup(groupName);
    setJoinedGroups((prev) => [...prev, groupName]);
  };

  const acceptPendingGroup = (groupName) => {
    if (pendingGroups.includes(groupName)) {
      joinGroup(groupName);
    }
  };

  const isGroupPending = (groupName) => pendingGroups.includes(groupName);
  const isGroupJoined = (groupName) => joinedGroups.includes(groupName);

  const updateTeamInfo = (type, leaderStatus, lecturerStatus) => {
    setTeamType(type);
    setIsLeader(leaderStatus);
    setHasLecturer(lecturerStatus);
  };

  return (
    <GroupContext.Provider
      value={{
        username,
        pendingGroups,
        joinedGroups,
        addPendingGroup,
        removePendingGroup,
        joinGroup,
        acceptPendingGroup,
        isGroupPending,
        isGroupJoined,
        // Thêm các thông tin nhóm vào context
        teamType,
        isLeader,
        hasLecturer,
        updateTeamInfo, // Hàm để cập nhật thông tin nhóm
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
