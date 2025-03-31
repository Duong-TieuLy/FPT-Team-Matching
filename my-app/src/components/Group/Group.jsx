import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CreateGroupForm from "./AddNewGroup";
import { useGroupContext } from "../../context/GroupContext";

const groups = [
  {
    photo: "/avata.jpg",
    name: "Designer",
    description: "Nhóm học thuật",
    posts: 600,
    members: 320,
    ki: 1,
    visits: "1.2k",
    image: "https://via.placeholder.com/150",
  },
  {
    photo: "/avata.jpg",
    name: "R & D",
    description: "Nhóm bên ngoài",
    posts: 300,
    members: 210,
    ki: "Không bắt buộc",
    visits: "1.1k",
    image: "https://via.placeholder.com/150",
  },
  {
    photo: "/avata.jpg",
    name: "Graphics",
    description: "Nhóm học thuật",
    posts: 320,
    members: 100,
    ki: 2,
    visits: "1.0k",
    image: "https://via.placeholder.com/150",
  },
  {
    photo: "/avata.jpg",
    name: "Marketing",
    description: "Nhóm học thuật",
    posts: 150,
    members: 200,
    ki: 1,
    visits: "900",
    image: "https://via.placeholder.com/150",
  },
];

const GroupsComponent = () => {
  const navigate = useNavigate(); // Khai báo useNavigate
  const [showAddGroup, setShowAddGroup] = useState(false);
  const { isGroupPending, addPendingGroup, isGroupJoined, acceptPendingGroup } =
    useGroupContext();

  const handleShowAddGroup = () => {
    setShowAddGroup(true);
  };

  const handleCloseAddGroup = () => {
    setShowAddGroup(false);
  };

  const handleAddGroup = (groupName) => {
    addPendingGroup(groupName);
  };

  const handleAcceptGroup = (groupName) => {
    acceptPendingGroup(groupName);
  };

  const handleNavigateToGroup = (groupName) => {
    navigate(`/group/${groupName}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <div
        className="relative w-full h-70 bg-cover bg-center mb-10"
        style={{
          backgroundImage:
            "url(https://i.pinimg.com/originals/3d/c4/49/3dc449b04d9ace524a0ecd247e1fdc83.png)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white bg-black bg-opacity-50 px-6 py-2 rounded-lg">
            Groups
          </h1>
          <button
            className="text-4xl bg-amber-700 h-10 w-10 cursor-pointer ml-4 text-white rounded-full"
            onClick={handleShowAddGroup}
          >
            +
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {groups.map((group, index) => {
          const isPending = isGroupPending(group.name);
          const isJoined = isGroupJoined(group.name);

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg text-center"
            >
              <img
                src={group.photo}
                alt={group.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
              />
              <h2 className="text-lg font-semibold text-blue-600">
                {group.name}
              </h2>
              <div className="text-lg font-semibold text-cyan-950">
                <h2>Kì : {group.ki}</h2>
              </div>
              <p className="text-gray-500 text-sm">{group.description}</p>
              <div className="flex justify-around text-sm text-gray-700 mt-4">
                <span>Member: {group.members}</span>
              </div>
              {isPending && (
                <p className="text-yellow-500 text-sm">Chờ leader xử lý</p>
              )}
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
                    handleAddGroup(group.name);
                  } else if (isJoined) {
                    handleNavigateToGroup(group.name); // Điều hướng đến trang nhóm
                  }
                }}
                disabled={isPending}
              >
                {isJoined ? "Enroll" : isPending ? "Chờ leader xử lý" : "Join"}
              </button>

              {isPending && (
                <button
                  className="mt-2 py-1 px-3 rounded-full bg-purple-500 text-white cursor-pointer"
                  onClick={() => handleAcceptGroup(group.name)}
                >
                  Chấp nhận
                </button>
              )}
            </div>
          );
        })}
      </div>
      {showAddGroup && <CreateGroupForm onClose={handleCloseAddGroup} />}
    </div>
  );
};

export default GroupsComponent;
