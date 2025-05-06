import React, { createContext, useContext, useState, useEffect } from "react";

const GroupContext = createContext();
const API_PROJECT = import.meta.env.VITE_HOST;
export const useGroupContext = () => useContext(GroupContext);

export const GroupProvider = ({ children }) => {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [pendingGroups, setPendingGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);

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
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
