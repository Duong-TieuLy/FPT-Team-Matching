import React, { useState } from "react";
import CreateGroupForm from "./CreateGroupForm.jsx";
import CommunityGroups from "./CommunityGroups";
import MyGroups from "./MyGroups";

const Group = () => {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [activeTab, setActiveTab] = useState("my");

  const handleShowAddGroup = () => setShowAddGroup(true);
  const handleCloseAddGroup = () => setShowAddGroup(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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

      <div className="flex justify-center mb-8">
        <button
          className={`px-6 py-2 mr-4 cursor-pointer ${
            activeTab === "my" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handleTabChange("my")}
        >
          My Group
        </button>
        <button
          className={`px-6 py-2 cursor-pointer ${
            activeTab === "community" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handleTabChange("community")}
        >
          Community Group
        </button>
      </div>

      {activeTab === "my" ? <MyGroups /> : <CommunityGroups />}

      {showAddGroup && <CreateGroupForm onClose={handleCloseAddGroup} />}
    </div>
  );
};

export default Group;
