import OtherSection from "./SidebarItem/OtherSection";
import GroupChatBox from "./DashBoard/GroupChatBox";
const API_PROJECT = import.meta.env.VITE_HOST;
const Sidebar = ({
  onMemberClick,
  onRequestClick,
  onRatingClick,
  onTaskClick,
  onChangeLeaderClick,
  onOutGroupClick,
}) => (
  <aside className="w-1/4 bg-white p-4 rounded-xl shadow-md">
    <input
      type="text"
      placeholder="Search"
      className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
    />

    {/* Khung Other Section */}
    <div className="bg-gray-50 p-3 rounded-lg shadow">
      <OtherSection
        onMemberClick={onMemberClick}
        onRequestClick={onRequestClick}
        onRatingClick={onRatingClick} // ✅ Truyền xuống đây
        onTaskClick={onTaskClick}
        onChangeLeaderClick={onChangeLeaderClick}
        onOutGroupClick={onOutGroupClick}
      />
    </div>
  </aside>
);

export default Sidebar;
