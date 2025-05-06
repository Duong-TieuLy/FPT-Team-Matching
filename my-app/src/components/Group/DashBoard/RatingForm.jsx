import React, { useState } from "react";
import axios from "axios";
const API_PROJECT = import.meta.env.VITE_HOST;
const RatingForm = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ratingData = { rating, feedback, teamId: 1 }; // Thay teamId bằng giá trị thực tế
    try {
      const response = await axios.post(
        `${API_PROJECT}/api/ratings`,
        ratingData
      );
      console.log("Rating submitted:", response.data);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Gửi đánh giá nhóm
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Điểm đánh giá (0 - 5)
        </label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Nhập điểm"
          min="0"
          max="5"
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phản hồi
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Viết phản hồi của bạn..."
          rows="4"
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200"
      >
        Gửi đánh giá
      </button>
    </form>
  );
};

export default RatingForm;
