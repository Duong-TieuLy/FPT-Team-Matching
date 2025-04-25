import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import CreatePost from "../Blog/CreatePost";
import PostCaNhan from "./PostCaNhan";
import AboutStudent from "./AboutStudent";
import FriendsList from "../FriendList";
import axios from 'axios';

const ProfileStudent = ({ userId }) => {
  const {user } = useAuth();
  const [activeTab, setActiveTab] = useState("Timeline");
  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const idToUse = userId || user?.id;

    if (idToUse) {
      axios.get(`/api/users/dto/${idToUse}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
          .then((response) => {
            setProfileData(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching user profile data:", error);
            setLoading(false);
          });
    }
  }, [userId, user?.id]);

  useEffect(() => {
    if (userId && user?.id) {
      axios.get(`/api/friends/check/${user?.id}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
          .then(response => {
            setIsFriend(response.data);  // Assuming response is a boolean
          })
          .catch(error => {
            console.error("Error checking friendship status:", error);
          });
    }
  }, [userId, user?.id, token]);

  const handleSendFriendRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // Ensure there's a token before making the request

    try {
      await axios.post(`/api/friends/request/${user?.id}/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Friend request sent!");
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="flex flex-col items-center w-full p-4 bg-gray-100">
        <div className="relative w-full max-w-5xl bg-white shadow-md rounded-xl overflow-hidden">
          {/* Cover Image */}
          <div className="h-40 bg-gradient-to-r from-orange-200 to-blue-200 relative">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 border-4 border-white rounded-full overflow-hidden">
              <img
                  src={profileData?.profilePicture || "/default-avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-14 mb-7 text-center">
            <h2 className="text-xl font-semibold text-cyan-950">
              {profileData?.fullName || 'Loading...'}
            </h2>

            {/* Stats */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-600">Biệt danh</p>
                <p className="text-gray-500 text-sm">Không có</p>
              </div>
            </div>

            {/* Friend Request Button (only visible if viewing another user's profile) */}
            {userId && !isFriend && user?.id !== userId && (
                <button
                    onClick={handleSendFriendRequest}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Send Friend Request
                </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 w-full max-w-3xl bg-white shadow-md rounded-xl p-2">
          <div className="flex justify-around border-b">
            <button
                onClick={() => setActiveTab("Timeline")}
                className={`pb-2 font-semibold cursor-pointer ${
                    activeTab === "Timeline" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                }`}
            >
              Timeline
            </button>
            <button
                onClick={() => setActiveTab("About")}
                className={`pb-2 font-semibold cursor-pointer ${
                    activeTab === "About" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                }`}
            >
              About
            </button>
            <button
                onClick={() => setActiveTab("Friends")}
                className={`pb-2 font-semibold cursor-pointer ${
                    activeTab === "Friends" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                }`}
            >
              Friends
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="w-full max-w-4xl mt-4 flex gap-6">
          <div
              className={activeTab === "About" || activeTab === "Friends" ? "w-full" : "w-2/3"}
          >
            {activeTab === "Timeline" && (
                <>
                  <CreatePost />
                  <PostCaNhan />
                </>
            )}
            {activeTab === "About" && <AboutStudent className="w-full" />}
            {activeTab === "Friends" && <FriendsList className="w-full" />}
          </div>

          {/* Photo Section - Only visible when on Timeline tab */}
          {activeTab === "Timeline" && (
              <div className="w-1/3 bg-white shadow-md rounded-xl p-4 h-fit">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-cyan-950">Photos</h3>
                  <button className="text-blue-500 text-sm">Add Photo</button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-6 mb-6">
                  <img src="/Baipost.png" className="w-full h-20 object-cover rounded-lg" />
                  <img src="/Baipost.png" className="w-full h-20 object-cover rounded-lg" />
                  <img src="/Baipost.png" className="w-full h-20 object-cover rounded-lg" />
                  <img src="/Baipost.png" className="w-full h-20 object-cover rounded-lg" />
                  <img src="/Baipost.png" className="w-full h-20 object-cover rounded-lg" />
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default ProfileStudent;
