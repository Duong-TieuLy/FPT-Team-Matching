import { useEffect, useRef, useState } from "react";
import axios from "axios";
const API_PROJECT = import.meta.env.VITE_HOST;
function AssignLecturer({ teamId, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");

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
          `${API_PROJECT}/api/search/lecturer?keyword=${encodeURIComponent(
            searchQuery
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            cancelToken: cancelToken.token,
          }
        )
        .then((res) => {
          if (Array.isArray(res.data)) {
            const lecturersOnly = res.data.filter(
              (user) => user.role === "LECTURER"
            );
            setSearchResults(lecturersOnly);
          } else if (res.data && Array.isArray(res.data.users)) {
            const lecturersOnly = res.data.users.filter(
              (user) => user.role === "LECTURER"
            );
            setSearchResults(lecturersOnly);
          } else {
            console.error("Dữ liệu trả về không hợp lệ:", res.data);
            setSearchResults([]);
          }
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            console.error("Không tìm thấy giảng viên:", err);
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

  const handleAssign = async (lecturerId) => {
    try {
      setAssigningId(lecturerId);
      const token = localStorage.getItem("token");
      const requesterId = localStorage.getItem("userId");

      const res = await axios.post(
        `${API_PROJECT}/api/lecturer-join-requests`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { teamId, lecturerId, requesterId },
        }
      );

      alert("Gửi lời mời thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi lời mời:", error);
      alert("Không thể gửi lời mời này.");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div
      className="relative mb-4 border p-4 rounded-md bg-gray-50"
      ref={containerRef}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-red-500 text-xl hover:underline"
      >
        ✖
      </button>

      <div className="flex items-center space-x-2 mt-8">
        <input
          type="text"
          placeholder="Tìm giảng viên (tên, email, SĐT)..."
          className="w-full px-4 py-2 bg-green-100 rounded-lg outline-none text-black focus:ring-2 focus:ring-green-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {loading && (
          <button
            disabled
            className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-50"
          >
            Searching...
          </button>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="mt-4 space-y-3 border-t pt-3">
          {searchResults.map((lecturer) => (
            <div
              key={lecturer.id}
              className="p-2 border rounded bg-white shadow-sm flex items-center space-x-4"
            >
              <img
                src={lecturer.profilePicture || "/avatar.jpg"}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-bold">{lecturer.fullName}</p>
                <p className="text-sm text-gray-600">
                  {lecturer.role.toUpperCase()}
                </p>
                <p className="text-sm">{lecturer.email || " "}</p>
                <p className="text-sm">{lecturer.phoneNumber || " "}</p>
              </div>
              <button
                onClick={() => handleAssign(lecturer.id)}
                disabled={assigningId === lecturer.id}
                className={`ml-4 text-sm px-3 py-1 rounded ${
                  assigningId === lecturer.id
                    ? "bg-gray-300"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {assigningId === lecturer.id ? "Inviting..." : "Invite"}
              </button>
            </div>
          ))}
        </div>
      )}

      {searchQuery && !loading && searchResults.length === 0 && (
        <p className="p-2 text-gray-500">Không tìm thấy giảng viên.</p>
      )}
    </div>
  );
}

export default AssignLecturer;
