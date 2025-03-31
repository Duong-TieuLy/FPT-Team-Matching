import { useState } from "react";

const friendsData = [
  { name: "Petey Cruiser", friends: 15, image: "/avata.jpg" },
  { name: "Anna Sthesia", friends: 50, image: "/avata.jpg" },
  { name: "Paul Molive", friends: 10, image: "/avata.jpg" },
  { name: "Gail Forcewind", friends: 20, image: "/avata.jpg" },
  { name: "Paige Turner", friends: 12, image: "/avata.jpg" },
  { name: "b Frapples", friends: 6, image: "/avata.jpg" },
];

const FriendsList = () => {
  const [friends, setFriends] = useState(friendsData);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-900">Friends</h2>
      <div className="flex space-x-4 border-b pb-2 text-gray-500">
        <span className="text-blue-500 cursor-pointer">All Friends</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {friends.map((friend, index) => (
          <div
            key={index}
            className="flex items-center p-4 border rounded-lg shadow-sm bg-white"
          >
            <img
              src={friend.image}
              alt={friend.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-gray-700">{friend.name}</h3>
              <p className="text-sm text-gray-500">{friend.friends} friends</p>
            </div>
            <button className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 font-semibold">
              ✓ Friend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
