import { useState } from "react";

const CreateBlog = () => {
  const [blogText, setBlogText] = useState("");
  const [image, setImage] = useState(null);

  // Xử lý khi chọn ảnh
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Hiển thị ảnh trước khi upload
    }
  };

  // Xử lý gửi bài viết
  const handleSubmit = () => {
    console.log("Bài đăng:", blogText, "Ảnh:", image);
    // Sau này có thể gọi API upload ở đây
    setBlogText("");
    setImage(null);
  };

  return (
    <div className="p-4 border rounded-3xl mt-3 border-gray-900 bg-white shadow-md">
      <h2 className="text-lg font-semibold text-cyan-950">Create Blog</h2>

      {/* Nhập nội dung bài viết */}
      <div className="flex items-center gap-3 mt-3">
        <img
          src="/avata.jpg"
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
        <input
          type="text"
          value={blogText}
          onChange={(e) => setBlogText(e.target.value)}
          placeholder="Write something here..."
          className="w-full p-2 text-black border rounded-full outline-none"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>

      {/* Hiển thị ảnh nếu đã chọn */}
      {image && (
        <div className="mt-3">
          <img
            src={image}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Các nút chức năng */}
      <div className="flex justify-around mt-3">
        <label className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">
          📷 Add Photo
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
        <button className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">
          👥 Tag Friend
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">
          😊 Feeling/Activity
        </button>
      </div>
    </div>
  );
};

export default CreateBlog;
