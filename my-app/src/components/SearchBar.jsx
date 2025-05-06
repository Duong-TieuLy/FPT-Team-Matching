import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_PROJECT = import.meta.env.VITE_HOST;
function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState({ users: [], teams: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null); // ref đến container chính

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const cancelToken = axios.CancelToken.source();

    const delayDebounce = setTimeout(() => {
      if (search.trim() !== "") {
        setLoading(true);

        axios
          .get(
            `${API_PROJECT}/api/search?keyword=${encodeURIComponent(
              search
            )}&currentUserId=${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              cancelToken: cancelToken.token,
            }
          )
          .then((res) => setResults(res.data))
          .catch((err) => {
            if (!axios.isCancel(err)) {
              console.error("Search failed", err);
            }
          })
          .finally(() => setLoading(false));
      } else {
        setResults({ users: [], teams: [] });
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      cancelToken.cancel();
    };
  }, [search]);

  // Reset search khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSearch("");
        setResults({ users: [], teams: [] });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto" ref={containerRef}>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm người dùng hoặc nhóm..."
        className="w-full px-4 py-2 bg-blue-100 rounded-lg outline-none text-black"
      />

      {search && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg mt-1 rounded-md z-50 max-h-72 overflow-y-auto">
          {loading && <p className="p-2 text-gray-500">🔍 Đang tìm kiếm...</p>}

          {!loading &&
            results.users.length === 0 &&
            results.teams.length === 0 && (
              <p className="p-2 text-gray-500">Không có kết quả phù hợp.</p>
            )}

          {!loading && (
            <>
              {results.users.length > 0 && (
                <div className="border-b border-gray-300">
                  <p className="px-2 pt-2 text-xs text-gray-400">
                    👤 Người dùng
                  </p>
                  {results.users.map((user) => (
                    <div
                      key={user.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/pageprofile/${user.id}`)}
                    >
                      {user.fullName}
                    </div>
                  ))}
                </div>
              )}

              {results.teams.length > 0 && (
                <div className="pt-2">
                  <p className="px-2 pt-2 text-xs text-gray-400">👥 Nhóm</p>
                  {results.teams.map((team) => (
                    <div
                      key={team.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/team/${team.id}`)} // nếu có trang team
                    >
                      {team.teamName}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
