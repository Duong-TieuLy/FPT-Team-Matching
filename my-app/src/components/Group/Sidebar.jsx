import ProjectSection from "./SidebarItem/ProjectSection";
import OtherSection from "./SidebarItem/OtherSection";
import GroupChatBox from "./DashBoard/GroupChatBox";

const Sidebar = ({ onMemberClick, onRequestClick }) => (
  <aside className="w-1/4 bg-white p-4 rounded-xl shadow-md">
    <input
      type="text"
      placeholder="Search"
      className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
    />

    {/* Khung Project Section */}
    <div className="bg-gray-50 p-3 rounded-lg shadow mb-4">
      <ProjectSection />
    </div>

    {/* Khung Other Section */}
    <div className="bg-gray-50 p-3 rounded-lg shadow">
      <OtherSection
        onMemberClick={onMemberClick}
        onRequestClick={onRequestClick}
      />
    </div>
  </aside>
);

export default Sidebar;
