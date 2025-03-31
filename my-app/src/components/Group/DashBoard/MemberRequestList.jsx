import { motion } from "framer-motion";

const MemberRequestList = ({ requests = [] }) => (
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-lg font-semibold mb-2">Member Requests</h2>
    <ul className="space-y-2">
      {requests.map((request, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            <img
              src={request.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">{request.name}</span>
          </div>
          <div className="space-x-2">
            <button className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
              Chấp nhận
            </button>
            <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
              Từ chối
            </button>
          </div>
        </motion.li>
      ))}
    </ul>
  </div>
);

export default MemberRequestList;
