import { useEffect, useRef, useState } from "react";
import axios from "axios";
const API_PROJECT = import.meta.env.VITE_HOST;
function AddMember({ teamId, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const currentUserId = localStorage.getItem("userId"); // Lấy currentUserId từ localStorage

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      axios
        .get(
          `${API_PROJECT}/api/search/student?keyword=${encodeURIComponent(
            searchQuery
          )}`,
          {
            cancelToken: cancelToken.token,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (Array.isArray(res.data)) {
            const studentsOnly = res.data.filter(
              (user) => user.role === "STUDENT"
            );
            setSearchResults(studentsOnly);
          } else {
            console.error("Dữ liệu trả về không hợp lệ:", res.data);
            setSearchResults([]);
          }
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            console.error("Không tìm thấy sinh viên:", err);
          }
          setSearchResults([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      cancelToken.cancel();
    };
  }, [searchQuery]);

  const handleAdd = async (studentId) => {
    try {
      setAddingId(studentId);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_PROJECT}/api/teams/${teamId}/add-student`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { studentIdToAdd: studentId },
        }
      );
      alert("Thêm sinh viên thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên:", error);
      alert("Thành viên này đã ở trong nhóm!");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div
      className="relative mb-4 border p-4 rounded-md bg-gray-50"
      ref={containerRef}
    >
      <button
        onClick={onClose} // Đóng modal khi nhấn vào nút "✖"
        className="absolute top-2 right-3 text-red-500 text-xl hover:underline"
      >
        ✖
      </button>

      <div className="flex items-center space-x-2 mt-8">
        <input
          type="text"
          placeholder="Tìm kiếm sinh viên (tên, email, SĐT)..."
          className="w-full px-4 py-2 bg-blue-100 rounded-lg outline-none text-black focus:ring-2 focus:ring-blue-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {loading && (
          <button
            disabled
            className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50"
          >
            Searching...
          </button>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="mt-4 space-y-3 border-t pt-3">
          {searchResults.map((student) => (
            <div
              key={student.id}
              className="p-2 border rounded bg-white shadow-sm flex items-center space-x-4"
            >
              {/* Profile Picture */}
              <img
                src={student.profilePicture || "/path/to/default-avatar.png"} // Replace with default avatar if not available
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Student Info */}
              <div className="flex-1">
                <p className="font-bold">{student.fullName}</p>
                <p className="text-sm text-gray-600">
                  {student.role.toUpperCase()}
                </p>
                <p className="text-sm">{student.email || " "}</p>
                <p className="text-sm">{student.phoneNumber || " "}</p>
              </div>

              {/* Add Button */}
              <button
                onClick={() => handleAdd(student.id)}
                disabled={addingId === student.id}
                className={`ml-4 text-sm px-3 py-1 rounded ${
                  addingId === student.id
                    ? "bg-gray-300"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {addingId === student.id ? "Adding..." : "Add"}
              </button>
            </div>
          ))}
        </div>
      )}

      {searchQuery && !loading && searchResults.length === 0 && (
        <p className="p-2 text-gray-500">Không tìm thấy sinh viên.</p>
      )}
    </div>
  );
}

export default AddMember;
