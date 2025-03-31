import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users") // Đổi thành URL đầy đủ
      .then((response) => {
        console.log(response.data); // Kết quả: []
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.username}</strong> - {user.fullName} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
