import { Home, Users, CheckSquare, Menu, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
const API_PROJECT = import.meta.env.VITE_HOST;
const Sidebar = ({ isOpen, toggleSidebar, userRole }) => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  // 🌟 Role-based routes
  const routes = {
    noLogin: [
      {
        path: "/",
        label: "Home",
        icon: <Home className="w-6 h-6" />,
        requiresAuth: false,
      },
      {
        path: "/profile",
        label: "Profile",
        icon: <User className="w-6 h-6" />,
        requiresAuth: true,
      },
      {
        path: "/group",
        label: "Group",
        icon: <Users className="w-6 h-6" />,
        requiresAuth: true,
      },
      {
        path: "/message",
        label: "Message Group",
        icon: <CheckSquare className="w-6 h-6" />,
        requiresAuth: true,
      },
    ],
  };

  const handleLinkClick = (e, requiresAuth) => {
    if (requiresAuth && !isLoggedIn) {
      e.preventDefault();
      alert("Please log in to access this section.");
    }
  };

  const sidebarItems = routes[userRole] || routes.noLogin;

  return (
    <div
      className={`fixed left-0 top-0 h-full z-20 ${
        isOpen ? "w-64" : "w-16"
      } bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
    >
      <button className="p-4 text-gray-500" onClick={toggleSidebar}>
        {isOpen ? "✖" : <Menu className="w-6 h-6" />}
      </button>

      <div className="flex flex-col items-start mt-9 space-y-2 px-2">
        {sidebarItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
          const isDisabled = item.requiresAuth && !isLoggedIn;
          return (
            <Link
              key={item.path}
              to={isDisabled ? "#" : item.path}
              onClick={(e) => handleLinkClick(e, item.requiresAuth)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full ${
                isActive
                  ? "bg-[#e2f2ff] text-blue-400"
                  : isDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700"
              }`}
              style={{ pointerEvents: isDisabled ? "none" : "auto" }}
            >
              {item.icon}
              {isOpen && (
                <span className="transition-opacity duration-500">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
