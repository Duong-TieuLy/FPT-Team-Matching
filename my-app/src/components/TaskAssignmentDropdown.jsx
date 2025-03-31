import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const TaskAssignmentDropdown = ({ showTasks, setShowTasks }) => {
  const dropdownRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Xử lý click ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTasks(false);
      }
    };

    if (showTasks) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTasks, setShowTasks]);

  // Fetch task khi dropdown mở, nhưng tránh fetch lại nếu đã có dữ liệu gần đây
  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch("https://api.example.com/tasks");
  //       const data = await response.json();
  //       setTasks(data);
  //     } catch (error) {
  //       console.error("Error fetching tasks:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (showTasks && tasks.length === 0) {
  //     fetchTasks();
  //   }
  // }, [showTasks]);

  return (
    <AnimatePresence>
      {showTasks && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute right-10 top-12 bg-white shadow-lg rounded-lg w-80 p-4"
        >
          <h3 className="text-lg font-semibold text-blue-600">
            Task Assignments
          </h3>
          <div className="mt-2 space-y-3">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading tasks...</p>
            ) : tasks.length > 0 ? (
              tasks.map((task, index) => (
                <div key={index} className="flex items-center p-2 border-b">
                  <img
                    src={task.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 ml-3">
                    <p className="text-gray-700 font-medium">{task.name}</p>
                    <p className="text-gray-500 text-sm">{task.description}</p>
                  </div>
                  <span className="text-xs text-gray-400">{task.time}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No new assignments</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskAssignmentDropdown;
