// Sidebar Component
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import SidebarItem from "./SidebarItem";
// Sidebar Project Component
const SidebarProject = ({ projectName, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <ChevronRight className={`transform ${isOpen ? "rotate-90" : ""}`} />
          <span>{projectName}</span>
        </div>
      </div>
      {isOpen && <ul className="ml-6 space-y-1">{children}</ul>}
    </div>
  );
};

const ProjectSection = () => (
  <div>
    <SidebarItem
      label="Add Project"
      icon={<span className="text-xl">+</span>}
    />
    <SidebarProject projectName="Secrat Project">
      <SidebarItem label="Task 1" />
      <SidebarItem label="Task 2" />
      <SidebarItem label="Task 3" />
      <SidebarItem label="Task 4" />
    </SidebarProject>
    <SidebarProject projectName="Bnie Mobile App">
      <SidebarItem label="Task A" />
      <SidebarItem label="Task B" />
    </SidebarProject>
  </div>
);

export default ProjectSection;
