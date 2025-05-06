import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Users, Bell, Mail } from "lucide-react";
import LoginModal from "./LoginModal";
import FriendRequestDropdown from "./FriendRequestDropdown";
import TaskAssignmentDropdown from "./TaskAssignmentDropdown";
import MailDropdown from "./MailDropdown";
import { useAuth } from "../context/useAuth";
import ProfileModal from "./Profile/ProfileModal";
const API_PROJECT = import.meta.env.VITE_HOST;
const NavbarIcons = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showMail, setShowMail] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const friendsDropdownRef = useRef(null);
  const taskDropdownRef = useRef(null);
  const mailDropdownRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);

  // Tự động đóng khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        friendsDropdownRef.current &&
        !friendsDropdownRef.current.contains(event.target)
      ) {
        setShowFriends(false);
      }
      if (
        taskDropdownRef.current &&
        !taskDropdownRef.current.contains(event.target)
      ) {
        setShowTask(false);
      }
      if (
        mailDropdownRef.current &&
        !mailDropdownRef.current.contains(event.target)
      ) {
        setShowMail(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex items-center gap-8 text-blue-500">
        <Link to="/">
          <Home className="w-6 h-6 cursor-pointer hidden sm:block" />
        </Link>

        <div className="relative" ref={friendsDropdownRef}>
          <Users
            className="w-6 h-6 cursor-pointer hidden sm:block"
            onClick={() => {
              if (!isLoggedIn) return setShowLogin(true);
              setShowFriends((prev) => !prev);
            }}
          />
          {showFriends && (
            <FriendRequestDropdown
              showFriends={showFriends}
              setShowFriends={setShowFriends}
            />
          )}
        </div>

        <div className="relative" ref={taskDropdownRef}>
          <Bell
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
              if (!isLoggedIn) return setShowLogin(true);
              setShowTask((prev) => !prev);
            }}
          />
          {showTask && (
            <TaskAssignmentDropdown
              showTasks={showTask}
              setShowTasks={setShowTask}
            />
          )}
        </div>

        <div className="relative">
          <Mail
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
              if (!isLoggedIn) return setShowLogin(true);
              setShowMail((prev) => !prev);
            }}
          />
          {showMail && (
            <MailDropdown showMails={showMail} setShowMails={setShowMail} />
          )}
        </div>

        {isLoggedIn && user ? (
          <button
            className="flex gap-4 cursor-pointer"
            onClick={() => setShowProfile(true)}
          >
            <img
              src={user.profilePicture}
              alt="User"
              className="mt-0 w-12 h-12 rounded-full border border-gray-300"
            />
            <div className="flex flex-col sm:block">
              <h1 className="text-gray-900 ">{user.fullName}</h1>
              <h2 className="text-gray-900">{user.role}</h2>
            </div>
          </button>
        ) : (
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded-md cursor-pointer"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
        )}
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default NavbarIcons;
