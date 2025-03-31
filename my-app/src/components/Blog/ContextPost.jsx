import CreateBlog from "./CreatePost";
import BlogItem from "./BlogItem";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import getBlogs from "../../api/userApi";

const MainContent = () => {
  const { isLoggedIn } = useAuth();
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    getBlogs()
      .then((data) => setBlogs(data))
      .catch(console.error);
  }, []);

  return (
    <main className="flex justify-center bg-gray-100 min-h-screen py-10">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4 flex flex-col gap-4 mt-5">
        {/* Chỉ hiển thị CreatePost nếu đã đăng nhập */}
        {isLoggedIn && <CreateBlog />}

        {/* Danh sách bài viết luôn hiển thị */}

        {blogs.map((blog) => (
          <BlogItem
            key={blog.id}
            name={blog.author.userName}
            avatar={blog.author.profilePictureUrl}
            time={blog.createdAt}
            image={blog.images}
            content={blog.content}
            like={blog.likeCount}
          />
        ))}
        <BlogItem />
      </div>
    </main>
  );
};

export default MainContent;
