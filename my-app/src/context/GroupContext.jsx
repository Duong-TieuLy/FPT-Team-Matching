import React, { createContext, useContext, useState } from "react";

const GroupContext = createContext();

export const useGroupContext = () => useContext(GroupContext);

export const GroupProvider = ({ children }) => {
  const [pendingGroups, setPendingGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]); // Nhóm đã tham gia

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

  return (
    <GroupContext.Provider
      value={{
        pendingGroups,
        joinedGroups,
        addPendingGroup,
        removePendingGroup,
        joinGroup,
        acceptPendingGroup, // Hàm leader xác nhận
        isGroupPending,
        isGroupJoined,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
