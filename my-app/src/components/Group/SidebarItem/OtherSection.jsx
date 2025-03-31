import SidebarItem from "./SidebarItem";

const OtherSection = ({ onMemberClick, onRequestClick }) => (
  <div>
    <SidebarItem
      label="Member"
      icon={<span className="text-green-500">●</span>}
      onClick={onMemberClick}
    />
    <SidebarItem
      label="Member Request"
      icon={<span className="text-yellow-500">●</span>}
      onClick={onRequestClick}
    />
    <SidebarItem
      label="Files"
      icon={<span className="text-red-500">●</span>}
      badge="10"
    />
    <SidebarItem
      label="Transfer leader"
      icon={<span className="text-blue-500">●</span>}
    />
    <SidebarItem
      label="Out group"
      icon={<span className="text-black-500">●</span>}
    />
  </div>
);
export default OtherSection;
