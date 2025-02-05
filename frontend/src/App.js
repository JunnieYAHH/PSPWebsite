import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./component/Header"
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null); // Track selected role

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/users/get-all-users"
      );
      setAllUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Filter users based on selected role
  const filteredUsers = selectedRole
    ? allUsers.filter(user => user.role === selectedRole)
    : [];

  const renderStatCard = (title, value, icon, gradient, role) => (
    <div
      className="stat-card"
      style={{ background: gradient, cursor: "pointer" }}
      onClick={() => setSelectedRole(role)} // Set role on click
    >
      <div className="stat-header">
        <h3>{title}</h3>
        <span className="icon">{icon}</span>
      </div>
      <hr />
      <h2 className="stat-value">{value}</h2>
    </div>
  );

  return (
    <div className="dashboard">
      <Header /> {/* ✅ Added Header component */}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="stats-container">
            {renderStatCard(
              "Users",
              allUsers.filter(user => user.role === "user").length,
              "🛠️",
              "linear-gradient(to right, #9C27B0, #BA68C8)",
              "user"
            )}
            {renderStatCard(
              "Clients",
              allUsers.filter(user => user.role === "client").length,
              "🧑‍🤝‍🧑",
              "linear-gradient(to right, #4CAF50, #66BB6A)",
              "client"
            )}
            {renderStatCard(
              "Coaches",
              allUsers.filter(user => user.role === "coach").length,
              "🏋️",
              "linear-gradient(to right, #FF9800, #FFB74D)",
              "coach"
            )}
          </div>

          {/* Display Table when a role is selected */}
          {selectedRole && (
            <div className="user-table">
              <h2>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} List</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => setSelectedRole(null)}>Close</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;