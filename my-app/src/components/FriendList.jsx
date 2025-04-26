import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth.jsx";
import { useParams } from "react-router-dom";

const FriendsList = ({ userId: propUserId }) => {
  const { user: currentUser } = useAuth();
  const { userId: paramUserId } = useParams();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [hasSentRequest, setHasSentRequest] = useState(false);

  // Ưu tiên prop -> param -> currentUser
  const targetUserId = parseInt(propUserId || paramUserId || currentUser?.id);

  useEffect(() => {
    if (!targetUserId || !currentUser?.id) return;

    const fetchFriends = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/friends/list/${targetUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFriends(response.data);

        // Kiểm tra nếu đã là bạn (chỉ khi xem user khác)
        if (targetUserId !== currentUser.id) {
          const friend = response.data.find(
              (f) =>
                  (f.requester.id === currentUser.id || f.receiver.id === currentUser.id) &&
                  f.status === "ACCEPTED"
          );
          setIsFriend(!!friend);
        }
      } catch (error) {
        console.error("Không thể tải danh sách bạn bè:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [targetUserId, currentUser?.id]);

  const handleUnfriend = async (friendId) => {
    if (!window.confirm("Bạn có chắc muốn hủy kết bạn?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8080/api/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends((prev) => prev.filter((f) => f.id !== friendId));
    } catch (error) {
      console.error("Không thể hủy kết bạn:", error);
    }
  };

  const handleSendFriendRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token || !currentUser?.id || !targetUserId) return;

    try {
      await axios.post(
          `http://localhost:8080/api/friends/request/${currentUser.id}/${targetUserId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Yêu cầu kết bạn đã được gửi!");
      setHasSentRequest(true);
    } catch (error) {
      console.error("Không thể gửi yêu cầu kết bạn:", error);
    }
  };

  const isViewingOwn = targetUserId === currentUser?.id;

  if (loading) return <div>Đang tải...</div>;

  return (
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-900">
          {isViewingOwn ? "Danh sách bạn bè của bạn" : "Danh sách bạn bè của người này"}
        </h2>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {friends.map((friend) => {
            const displayFriend =
                friend.requester.id === targetUserId ? friend.receiver : friend.requester;

            return (
                <div
                    key={friend.id}
                    className="flex items-center p-4 border rounded-lg shadow-sm bg-white"
                >
                  <img
                      src={displayFriend?.profilePicture || "/avata.jpg"}
                      alt={displayFriend?.fullName}
                      className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-700">
                      {displayFriend?.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Bạn bè từ: {new Date(friend.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  {isViewingOwn ? (
                      <button
                          onClick={() => handleUnfriend(friend.id)}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm"
                      >
                        Hủy kết bạn
                      </button>
                  ) : isFriend ? (
                      <span className="text-green-600 font-semibold">Bạn bè</span>
                  ) : hasSentRequest ? (
                      <span className="text-yellow-500 font-medium">Đã gửi lời mời</span>
                  ) : (
                      <button
                          onClick={handleSendFriendRequest}
                          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg text-sm"
                      >
                        Gửi yêu cầu kết bạn
                      </button>
                  )}
                </div>
            );
          })}
        </div>
      </div>
  );
};

export default FriendsList;
