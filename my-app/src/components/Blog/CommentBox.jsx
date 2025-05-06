import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { postComment } from "../../api/userApi";
import { useAuth } from "../../context/useAuth";
const API_PROJECT = import.meta.env.VITE_HOST;
export default function CommentForm({
  onSubmit,
  image,
  postId,
  setShowCommentBox,
}) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, user, token } = useAuth();

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await postComment({
        postId,
        comment: comment.trim(),
        commentbyid: user?.id,
        token,
      });
      setShowCommentBox?.(false);
      setComment("");
    } catch (err) {
      alert("Đã xảy ra lỗi khi gửi bình luận.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-3 ">
      <img src={image} alt="Profile" className="h-10 w-10 rounded-full" />
      <input
        className="w-full p-2 border rounded-full h-10 "
        rows={3}
        placeholder="Viết bình luận..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        disabled={loading}
        className="mt-2 bg-blue-500 text-white px-4 py-1 border rounded-full hover:bg-blue-600"
      >
        {loading ? "Đang gửi..." : "Gửi"}
      </motion.button>
    </div>
  );
}
