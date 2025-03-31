import { motion } from "framer-motion";

const MemberList = ({ members }) => (
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-lg font-semibold mb-2">Members</h2>
    <ul className="space-y-2">
      {members.map((member, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
        >
          <img
            src={member.avatar || "/avatar.jpg"}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium">{member.name}</span>
        </motion.li>
      ))}
    </ul>
  </div>
);

export default MemberList;
