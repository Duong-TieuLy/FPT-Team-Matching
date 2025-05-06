import { useState, useEffect } from "react";
import { MoreVertical, ThumbsUp, MessageCircle } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import LoginModal from "../LoginModal";
import axios from "axios";
import dayjs from "dayjs";
import CommentBox from "./CommentBox";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
dayjs.extend(relativeTime);
dayjs.locale("vi");
const API_PROJECT = import.meta.env.VITE_HOST;
const BlogItem = ({ blogs, postId }) => {
  const {
    authorName,
    authorAvatar,
    images,
    createdAt,
    content,
    likeCount,
    comments,
  } = blogs;
  const { isLoggedIn, user, token } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [like, setLike] = useState(likeCount);
  const [liked, setLiked] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentList, setCommentList] = useState(comments || []); // Use existing comments or empty array
  // const [stompClient, setStompClient] = useState(null);

  const handleLike = async () => {
    if (!isLoggedIn) return setShowLogin(true);

    try {
      await axios.post(
        `${API_PROJECT}/api/blogs/like`,
        {
          postId,
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLike((prev) => prev + (liked ? -1 : 1));
      setLiked(!liked);
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleCommentSubmit = (newComment) => {
    setCommentList((prev) => [...prev, newComment]);
    setShowCommentBox(false);
  };

  return (
    <>
      <div className="p-4 mt-4 bg-white rounded-lg shadow relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={authorAvatar}
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{authorName}</h3>
              <p className="text-sm text-gray-500">
                {createdAt ? dayjs(createdAt).fromNow() : "Chưa có"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (!isLoggedIn) return setShowLogin(true);
              setShowMenu(!showMenu);
            }}
            className="p-2 rounded-full cursor-pointer bg-blue-300"
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-4 top-12 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
              <button className="w-full px-4 py-2 text-left bg-gray-100 cursor-pointer text-blue-700">
                Kết bạn
              </button>
            </div>
          )}
        </div>

        <p className="mt-3 text-gray-700">{content}</p>

        {images && (
          <div className="w-full max-h-[600px] overflow-hidden rounded-lg mt-3">
            <img
              src={images}
              alt="Blog"
              className="w-full h-auto max-h-[600px] object-cover"
            />
          </div>
        )}

        {/* Comment list and form */}
        <div className="mt-3">
          <div className="w-full">
            <div className="space-y-2">
              {commentList.map((comment, index) => (
                <div key={index} className="flex items-start gap-3">
                  <img
                    src={comment.authorAvatar || "/avata.jpg"}
                    alt="Commenter"
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-800">
                      {comment.authorName}
                    </p>
                    <p className="text-sm text-gray-600">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment box */}
            {showCommentBox && (
              <div className="mt-4">
                <CommentBox
                  isLoggedIn={isLoggedIn}
                  image={user?.profilePicture || "avatar.jpg"}
                  postId={postId}
                  token={token}
                  onSubmit={handleCommentSubmit} // Pass submit handler
                  setShowCommentBox={setShowCommentBox} // ✅ truyền vào
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between items-center p-3 border-t border-gray-200 rounded-lg bg-gray-100">
            <button
              className={`flex items-center gap-2 cursor-pointer ${
                liked ? "text-blue-500 scale-105" : "text-gray-700"
              } transition-all duration-200 ease-in-out`}
              onClick={() => {
                if (!isLoggedIn) return setShowLogin(true);
                handleLike();
              }}
            >
              <ThumbsUp
                size={18}
                className={`mr-2 ${liked ? "text-blue-500" : ""}`}
              />
              {like} Like
            </button>
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-blue-500 cursor-pointer"
              onClick={() => {
                if (!isLoggedIn) return setShowLogin(true);
                setShowCommentBox(true);
              }}
            >
              <MessageCircle size={18} className="mr-2" />
              Comment
            </button>
          </div>
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default BlogItem;
