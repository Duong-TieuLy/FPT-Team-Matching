const SidebarItem = ({ icon, label, badge, onClick }) => (
  <li
    onClick={onClick}
    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
  >
    <div className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        {badge}
      </span>
    )}
  </li>
);

export default SidebarItem;
