import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const MailDropdown = ({ showMails, setShowMails }) => {
    const dropdownRef = useRef(null);
    const [mails, setMails] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMails = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const lecturerId = localStorage.getItem("userId");

                if (!token || !lecturerId) {
                    console.warn("Missing token or lecturer ID");
                    return;
                }

                const res = await axios.get(`http://localhost:8080/api/lecturer-join-requests/pending/${lecturerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setMails(res.data);
            } catch (error) {
                console.error("Error fetching mails:", error);
            } finally {
                setLoading(false);
            }
        };

        if (showMails) {
            fetchMails();
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMails]);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowMails(false);
        }
    };

    const handleRespond = async (requestId, action) => {
        const token = localStorage.getItem("token");
        const lecturerId = localStorage.getItem("userId");

        if (!token || !lecturerId) return;

        const mail = mails.find((m) => m.id === requestId);
        const leaderId = mail?.leaderId;

        try {
            const params = new URLSearchParams({
                requestId,
                lecturerId,
                leaderId,
                accept: action === "ACCEPT",
            });

            const response = await axios.post(
                `http://localhost:8080/api/lecturer-join-requests/respond?${params.toString()}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data.message);
            setMails((prev) => prev.filter((mail) => mail.id !== requestId));
        } catch (error) {
            console.error(`Failed to ${action} request`, error.response?.data?.message || error.message);
        }
    };

    return (
        <AnimatePresence>
            {showMails && (
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, scale: 0.95, y: -15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute right-4 top-14 bg-white shadow-2xl rounded-2xl w-80 max-w-full p-5 z-50 ring-1 ring-gray-200"
                    style={{ minWidth: '320px' }}
                >
                    <h3 className="text-xl font-semibold text-blue-700 border-b border-blue-100 pb-3 flex items-center gap-2">
                        <i className="fas fa-bell text-blue-600"></i> Notifications
                    </h3>
                    <div className="mt-3 space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
                        {loading ? (
                            <p className="text-gray-500 text-center text-sm italic">Loading notifications...</p>
                        ) : mails.length > 0 ? (
                            mails.map((mail) => (
                                <div
                                    key={mail.id}
                                    className="flex items-start gap-4 p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
                                >
                                    <img
                                        src={mail.teamPicture || "https://placehold.co/48x48/png?text=Team"}
                                        alt={`Team logo for ${mail.teamName}, a group invitation`}
                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-sm"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-900 font-semibold truncate">
                                            Group: <span className="text-blue-600">{mail.teamName}</span>
                                        </p>
                                        <p className="text-gray-500 text-sm truncate">From leader: {mail.leaderName}</p>
                                        <div className="mt-2 flex gap-3">
                                            <button
                                                onClick={() => handleRespond(mail.id, "ACCEPT")}
                                                className="flex-1 text-center text-white bg-green-600 hover:bg-green-700 rounded-md py-1.5 text-sm font-medium shadow-sm transition-colors"
                                                aria-label={`Accept invitation to join ${mail.teamName}`}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRespond(mail.id, "REJECT")}
                                                className="flex-1 text-center text-white bg-red-600 hover:bg-red-700 rounded-md py-1.5 text-sm font-medium shadow-sm transition-colors"
                                                aria-label={`Reject invitation to join ${mail.teamName}`}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center text-sm italic">No new notification</p>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MailDropdown;
