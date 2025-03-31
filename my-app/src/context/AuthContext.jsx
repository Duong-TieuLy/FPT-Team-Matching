import { createContext, useState, useEffect } from "react";

// Tạo context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // Thêm role

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setRole(null);
  };

  // Giả sử bạn có một hàm để lấy thông tin người dùng từ API
  const fetchUserData = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users/1"
      );
      const userData = await response.json();
      setUser(userData);
      setRole(userData.username);
      console.log(userData.username);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    }
  };

  // Lấy thông tin người dùng khi đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
