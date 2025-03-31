import { Users, Bell } from "lucide-react";
import { Link } from "react-router-dom";

// Notification Bar Component
const NotificationBar = ({ groupName, notificationCount }) => (
  <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md mb-4">
    <div className="flex items-center gap-2">
      <Users className="text-blue-500" />
      <Link to="/group" className="text-blue-600 font-semibold hover:underline">
        group
      </Link>
      <span className="font-semibold"> &gt; {groupName}</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="relative">
        <Bell className="text-blue-500" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {notificationCount}
          </span>
        )}
      </div>
      <button className="bg-green-100 text-green-700 px-4 py-1 rounded-md hover:bg-green-200">
        Add Task
      </button>
    </div>
  </div>
);

export default NotificationBar;
