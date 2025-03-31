import { useState } from "react";
import { MoreVertical } from "lucide-react"; // Import icon 3 chấm
import { useAuth } from "../../context/useAuth";
import LoginModal from "../LoginModal";
const PostCaNhan = () => {
  const { isLoggedIn } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className="p-4 mt-4 bg-white rounded-lg shadow relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/avata.jpg"
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">Anna Sthesia</h3>
              <p className="text-sm text-gray-500">Just Now</p>
            </div>
          </div>

          {/* Nút ba chấm */}

          {/* Menu hiển thị khi bấm */}
        </div>

        {/* Nội dung bài blog */}
        <p className="mt-3 text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla
          dolor, ornare at commodo non, feugiat non nisi.
        </p>

        {/* Ảnh bài blog */}
        <div className="w-full max-h-[600px] overflow-hidden rounded-lg mt-3">
          <img
            src="/Baipost.png"
            alt="Post"
            className="w-full h-auto max-h-[600px] object-cover"
          />
        </div>

        {/* Nút like & comment */}
        <div className="mt-3">
          <div className="flex justify-between items-center p-3 border-t border-gray-200 rounded-lg bg-gray-100">
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-blue-500 cursor-pointer"
              onClick={() => {
                if (!isLoggedIn) return setShowLogin(true);
              }}
            >
              👍 <span>140 Likes</span>
            </button>
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-blue-500 cursor-pointer"
              onClick={() => {
                if (!isLoggedIn) return setShowLogin(true);
              }}
            >
              💬 <span>20 Comments</span>
            </button>
          </div>
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default PostCaNhan;
