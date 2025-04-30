import React from "react";

const StudentGroupDashboard = ({
  groupName,
  groupDescription,
  members,
  announcements,
}) => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{groupName}</h1>
        <p className="text-gray-600 mb-2">Description: {groupDescription}</p>
        <h2 className="text-xl font-semibold mb-2">
          Members ({members.length})
        </h2>
        <ul className="mb-4">
          {members.map((member, index) => (
            <li key={index} className="text-gray-700">
              - {member}
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold mb-2">Announcements</h2>
        <ul>
          {announcements.map((announcement, index) => (
            <li key={index} className="text-gray-700 mb-1">
              🔔 {announcement}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
          <input type="file" className="block mb-2" />
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Upload
          </button>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Group Chat</h3>
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Type your message..."
          />
          <button className="px-4 py-2 bg-green-500 text-white rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentGroupDashboard;
