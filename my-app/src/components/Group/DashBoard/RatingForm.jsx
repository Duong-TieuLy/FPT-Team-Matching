import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/useAuth.jsx";

const RatingForm = () => {
  const { user, token } = useAuth();
  const { teamId } = useParams();
  const teamIdNumber = Number(teamId);
  const [members, setMembers] = useState([]);
  const [ratings, setRatings] = useState([]);

  // Fetch team members data when component mounts or teamId changes
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/teams/${teamId}/members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMembers(res.data); // Assuming the API returns an array of members with id and fullName
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    if (teamId) {
      fetchMembers();
    }
  }, [teamId, token]);

  useEffect(() => {
    // Initialize ratings state based on fetched members
    setRatings(
      members.map((member) => ({
        memberId: member.id,
        rating: 0,
        feedback: "",
      }))
    );
  }, [members]);

  // Tính toán người đánh giá dựa theo role
  const { given_by_student_id, given_by_lecturer_id } = useMemo(() => {
    if (!user) return { given_by_student_id: null, given_by_lecturer_id: null };
    if (user.role === "STUDENT") {
      return { given_by_student_id: user.id, given_by_lecturer_id: null };
    } else if (user.role === "LECTURER") {
      return { given_by_student_id: null, given_by_lecturer_id: user.id };
    } else {
      return { given_by_student_id: null, given_by_lecturer_id: null };
    }
  }, [user]);

  const handleRatingChange = (index, field, value) => {
    const updatedRatings = [...ratings];
    updatedRatings[index][field] = value;
    setRatings(updatedRatings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ratingData = ratings.map((rating) => ({
      feedback: rating.feedback,
      given_by_lecturer_id, // Giảng viên đánh giá (có thể null)
      given_by_student_id, // Sinh viên đánh giá (có thể null)
      rated_lecturer_id: null, // ID của giảng viên được đánh giá (có thể null)
      rated_student_id: rating.memberId, // ID của sinh viên được đánh giá
      rating: rating.rating,
      teamId: teamIdNumber, // ID của nhóm
    }));
    console.log("Data :", ratingData);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/ratings",
        { ratings: ratingData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Ratings submitted:", response.data);
    } catch (error) {
      console.error("Error submitting ratings:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-6 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Đánh giá thành viên nhóm
      </h2>

      {/* Flat structure with all ratings and feedbacks at the same level */}
      {members.map((member, index) => (
        <div key={member.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">
              {member.fullName}
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điểm đánh giá (0 - 5)
            </label>
            <input
              type="number"
              value={ratings[index]?.rating}
              onChange={(e) =>
                handleRatingChange(index, "rating", e.target.value)
              }
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
              value={ratings[index]?.feedback}
              onChange={(e) =>
                handleRatingChange(index, "feedback", e.target.value)
              }
              placeholder="Viết phản hồi..."
              rows="3"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200"
      >
        Gửi đánh giá tất cả
      </button>
    </form>
  );
};

export default RatingForm;
