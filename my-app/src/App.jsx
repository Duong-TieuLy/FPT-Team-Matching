import { useState } from "react";
import { Search, Menu, Group, User } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import NavbarIcons from "./components/NavbarIcons";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/useAuth";
import MainContent from "./components/Blog/ContextPost";
import FriendsSidebar from "./components/FriendsSidebar"; // Import sidebar bạn bè
import ProfileStudent from "./components/Profile/ProfileInfoStudent";
import GroupsComponent from "./components/Group/Group";
import GroupDashBoard from "./components/Group/AfterJoinGroup";
import UserList from "./api/UserList";

function App() {
  const { isLoggedIn, role, user } = useAuth();
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFriendsSidebarOpen, setIsFriendsSidebarOpen] = useState(false);

  return (
    <>
      {/* Sidebar chính */}
      <Sidebar
        isOpen={isSidebarOpen}
        isLoggedIn={isLoggedIn}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-2 bg-white shadow-md z-20">
        {/* Left: Logo và Menu */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 p-3">
            <img src="/image.png" alt="Logo" className="h-10 w-12" />
            <h1 className="text-gray-700 text-lg font-semibold">SocialIV</h1>
          </div>

          {/* Menu Icon (Toggle Sidebar) */}
          <Menu
            className="w-6 h-6 cursor-pointer text-gray-400"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        {/* Middle: Search Bar */}
        <div className="relative w-100 md:block">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search here..."
            className="w-full px-4 py-2 bg-blue-100 rounded-lg outline-none text-black"
          />
          <Search className="absolute right-3 top-2.5 w-6 h-5 text-gray-500" />
        </div>

        {/* Right: Navbar Icons */}
        <NavbarIcons
          isLoggedIn={isLoggedIn}
          userProfile={user?.id || "/default-profile.jpg"}
        />
      </nav>

      {/* Sidebar bạn bè (cố định bên phải màn hình) */}
      <FriendsSidebar
        isOpen={isFriendsSidebarOpen}
        toggleSidebar={() => setIsFriendsSidebarOpen(!isFriendsSidebarOpen)}
      />

      <Routes>
        <Route path="/" element={<MainContent />} />
        {role === "Bret" && (
          <Route path="/profile" element={<ProfileStudent />} />
        )}
        <Route path="/group" element={<GroupsComponent />} />
        <Route path="/group/:namegroup" element={<GroupDashBoard />} />
        <Route path="api/user" element={<UserList />} />
      </Routes>
    </>
  );
}

export default App;
