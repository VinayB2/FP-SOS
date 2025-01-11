import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/users.css";
import Loader from "../../components/Loader";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/get-user-list");
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (username) => {
    try {
      setLoading(true);
      await axios.get(`/api/delete-user/${username}`);
      setUsers(users.filter((user) => user.username !== username));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error deleting user:", error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/add-user", newUser);
      if (response.data.success) {
        setNewUser({ username: "", password: "", role: "" });
        setUsers([...users, newUser]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error adding user:", error);
    }
  };

  return (
    <div>
      {loading?<div className="main-container"><Loader /></div>:
      <div className="admin-container">
        <h1 className="admin-heading">Admin Panel</h1>

        <form className="add-user-form" onSubmit={handleAddUser}>
          <input
            className="input-field"
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
          <select
            className="select-field"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button className="submit-button" type="submit">
            Add User
          </button>
        </form>

        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(user.username)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
};

export default Users;
