import { useCallback, useEffect, useState, useRef } from "react";
import CreateBlog from "./CreatePost";
import BlogItem from "./BlogItem";
import { useAuth } from "../../context/useAuth";
import getBlogs from "../../api/userApi";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
const API_PROJECT = import.meta.env.VITE_HOST;
const MainContent = () => {
  const { isLoggedIn } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const stompClientRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialBlogs = async () => {
      try {
        setIsLoading(true);
        const data = await getBlogs(0, 10);
        if (isMounted) {
          setBlogs(data);
          setPage(1);
          setHasMore(data.length > 0);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialBlogs();

    const socket = new SockJS(`${API_PROJECT}/ws`);
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      console.log("Connected to WebSocket");
      stompClient.subscribe("/topic/blogs", (message) => {
        const newBlog = JSON.parse(message.body);
        setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
      });
    });

    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
      isMounted = false;
    };
  }, []);

  const loadMoreBlogs = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const data = await getBlogs(page, 10);
      setBlogs((prevBlogs) => [...prevBlogs, ...data]);
      setPage((prevPage) => prevPage + 1);
      if (data.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMoreBlogs();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreBlogs]);

  return (
    <main className="flex justify-center bg-gray-100 min-h-screen py-10">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4 flex flex-col gap-4 mt-5">
        {isLoggedIn && <CreateBlog />}

        {blogs.map((blog, index) => (
          <BlogItem key={`${blog.id}-${index}`} postId={blog.id} blogs={blog} />
        ))}

        {isLoading && <div className="text-center py-4">Đang tải...</div>}
        {!hasMore && <div className="text-center py-4">Đã hết bài viết.</div>}
      </div>
    </main>
  );
};

export default MainContent;
