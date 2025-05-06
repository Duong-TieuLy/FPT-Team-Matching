import { createContext, useState, useEffect } from "react";
import axios from "axios";
const API_PROJECT = import.meta.env.VITE_HOST;
// Tạo context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [hasFetched, setHasFetched] = useState(false);

  // Hàm login
  const login = (token, userData) => {
    console.log("Token received:", token);
    setIsLoggedIn(true);
    setToken(token);
    setUser(userData);
    setRole(userData.role);
    localStorage.setItem("token", token);
    localStorage.setItem("username", userData.username);
  };

  // Hàm logout
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  // Lấy thông tin user từ API
  const getProtectedData = async () => {
    const storedToken = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_PROJECT}/api/protected-resource`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching protected data:", error);
      throw error;
    }
  };

  // Lấy user khi app khởi động
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && !user) {
        try {
          const data = await getProtectedData();
          setIsLoggedIn(true);
          setUser(data.user);
          setRole(data.role);
          setToken(storedToken);
        } catch {
          logout();
        }
      }
      setHasFetched(true);
    };

    fetchUser();
  }, []); // Chạy 1 lần duy nhất

  // Cập nhật localStorage khi token thay đổi
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, user, token, login, logout, hasFetched }}
    >
      {children}
    </AuthContext.Provider>
  );
};
