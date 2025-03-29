import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import CreatePost from "../Blog/CreatePost";
import PostCaNhan from "./PostCaNhan";
import AboutStudent from "./AboutStudent";
import FriendsList from "../FriendList";
import axios from "axios";

const ProfileStudent = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState("Timeline");
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState({ rating: 0, feedback: "" });
  const [notifications, setNotifications] = useState([]);
  const [comments, setComments] = useState([]); // Giả sử comment liên quan đến bài đăng

// Lấy dữ liệu khi user thay đổi
  useEffect(() => {
    if (user?.id) {
      fetchRatings();
      fetchNotifications();
      fetchComments();
    }
  }, [user]);

// Lấy danh sách đánh giá
  const fetchRatings = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/ratings/student/${user.id}`);
      setRatings(response.data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  // Gửi đánh giá mới
    const submitRating = async () => {
      try {
        await axios.post("http://localhost:8080/api/ratings/student-to-student", null, {
          params: {
            givenByStudentId: user.id,
            ratedStudentId: user.id, // Thay bằng ID khác nếu cần
            teamId: 1,               // Thay bằng teamId thực tế
            rating: newRating.rating,
            feedback: newRating.feedback,
          },
        });
        setNewRating({ rating: 0, feedback: "" });
        fetchRatings();
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
    };

    // Lấy danh sách thông báo
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/notifications/user/${user.id}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

// Lấy danh sách bình luận (giả sử liên quan đến bài đăng của user)
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/user/${user.id}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

    return (
    <div className="flex flex-col items-center w-full  p-4 bg-gray-100">
      <div className="relative  w-full max-w-5xl bg-white shadow-md rounded-xl overflow-hidden">
        {/* Cover Image */}
        <div className="h-40 bg-gradient-to-r from-orange-200 to-blue-200 relative">
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 border-4 border-white rounded-full overflow-hidden">
            <img
              src="/avata.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-14 mb-7 text-center">
          <h2 className="text-xl font-semibold text-cyan-950">Student Name</h2>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-600">11</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-600">35</p>
              <p className="text-gray-500 text-sm">Post</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-600">46</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 w-full max-w-3xl bg-white shadow-md rounded-xl p-2">
        <div className="flex justify-around border-b">
          <button
            onClick={() => setActiveTab("Timeline")}
            className={`pb-2 font-semibold cursor-pointer ${
              activeTab === "Timeline"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab("About")}
            className={`pb-2 font-semibold cursor-pointer ${
              activeTab === "About"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab("Friends")}
            className={`pb-2 font-semibold cursor-pointer ${
              activeTab === "Friends"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Friends
          </button>
          <button
                      onClick={() => setActiveTab("Ratings")}
                      className={`pb-2 font-semibold cursor-pointer ${
                        activeTab === "Ratings" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                      }`}
                    >
                      Ratings
                    </button>
                    <button
                      onClick={() => setActiveTab("Notifications")}
                      className={`pb-2 font-semibold cursor-pointer ${
                        activeTab === "Notifications" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                      }`}
                    >
                      Notifications
                    </button>
                  </div>
                </div>

      {/* Content */}
      <div className="w-full max-w-4xl mt-4 flex gap-6 ">
        <div
          className={
            activeTab === "About" || activeTab === "Friends" || activeTab === "Ratings" || activeTab === "Notifications"
              ? "w-full"
              : "w-2/3"
          }
        >
          {activeTab === "Timeline" && (
            <>
              <CreatePost />
              {/* Hiển thị bài đăng kèm bình luận */}
                            {comments.length > 0 && (
                              <div className="mt-4">
                                <h3 className="text-lg font-semibold text-cyan-950">Comments on Your Posts</h3>
                                <ul>
                                  {comments.map((comment) => (
                                    <li key={comment.id} className="border-b py-2">
                                      <p>{comment.content}</p>
                                      <p className="text-sm text-gray-500">By: {comment.author?.username}</p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
              <PostCaNhan />
              <PostCaNhan />
              <PostCaNhan />
            </>
          )}
          {activeTab === "About" && role === "Bret" && (
            <AboutStudent className="w-full" />
          )}
          {activeTab === "Friends" && role === "Bret" && (
            <FriendsList className="w-full" />
          )}
          {activeTab === "Ratings" && (
                  <div className="bg-white shadow-md rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-cyan-950">Ratings</h3>
                    <ul className="mt-4">
                      {ratings.map((rating) => (
                        <li key={rating.id} className="border-b py-2">
                          <p>Rating: {rating.rating} / 5</p>
                          <p>Feedback: {rating.feedback || "No feedback"}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={newRating.rating}
                        onChange={(e) => setNewRating({ ...newRating, rating: parseFloat(e.target.value) })}
                        className="border p-2 rounded mr-2"
                        placeholder="Rating (0-5)"
                      />
                      <input
                        type="text"
                        value={newRating.feedback}
                        onChange={(e) => setNewRating({ ...newRating, feedback: e.target.value })}
                        className="border p-2 rounded mr-2"
                        placeholder="Feedback"
                      />
                      <button
                        onClick={submitRating}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Submit Rating
                      </button>
                    </div>
                  </div>
                )}
        </div>

        {activeTab === "Ratings" && (
                    <div className="bg-white shadow-md rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-cyan-950">Ratings</h3>
                      <ul className="mt-4">
                        {ratings.map((rating) => (
                          <li key={rating.id} className="border-b py-2">
                            <p>Rating: {rating.rating} / 5</p>
                            <p>Feedback: {rating.feedback || "No feedback"}</p>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={newRating.rating}
                          onChange={(e) => setNewRating({ ...newRating, rating: parseFloat(e.target.value) })}
                          className="border p-2 rounded mr-2"
                          placeholder="Rating (0-5)"
                        />
                        <input
                          type="text"
                          value={newRating.feedback}
                          onChange={(e) => setNewRating({ ...newRating, feedback: e.target.value })}
                          className="border p-2 rounded mr-2"
                          placeholder="Feedback"
                        />
                        <button
                          onClick={submitRating}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Submit Rating
                        </button>
                      </div>
                    </div>
                  )}

              {activeTab === "Notifications" && (
                          <div className="bg-white shadow-md rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-cyan-950">Notifications</h3>
                            <ul className="mt-4">
                              {notifications.map((notification) => (
                                <li key={notification.id} className="border-b py-2">
                                  <p>{notification.message}</p>
                                  <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

        {/* Photo Section - Chỉ hiển thị khi ở tab Timeline */}
        {activeTab === "Timeline" && (
          <div className="w-1/3 bg-white shadow-md rounded-xl p-4 h-fit">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-cyan-950">Photos</h3>
              <button className="text-blue-500 text-sm">Add Photo</button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6 mb-6">
              <img
                src="/Baipost.png"
                className="w-full h-20 object-cover rounded-lg"
              />
              <img
                src="/Baipost.png"
                className="w-full h-20 object-cover rounded-lg"
              />
              <img
                src="/Baipost.png"
                className="w-full h-20 object-cover rounded-lg"
              />
              <img
                src="/Baipost.png"
                className="w-full h-20 object-cover rounded-lg"
              />
              <img
                src="/Baipost.png"
                className="w-full h-20 object-cover rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileStudent;
