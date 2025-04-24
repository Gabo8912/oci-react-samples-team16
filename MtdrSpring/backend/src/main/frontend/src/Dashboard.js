import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setError("No user is logged in");
          setLoadingUser(false);
          return;
        }

        const response = await fetch(`http://localhost:8081/auth/user/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
        setLoadingUser(false);
      } catch (err) {
        setError(err.message);
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch all users and their aggregated task stats
  useEffect(() => {
    const fetchUsersAndStats = async () => {
      try {
        setLoadingStats(true);
        const usersResponse = await fetch("http://localhost:8081/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users");
        }
        const users = await usersResponse.json();

        const statsPromises = users.map(async (user) => {
          const tasksResponse = await fetch(`http://localhost:8081/api/task-assignments/user/${user.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (!tasksResponse.ok) {
            throw new Error(`Failed to fetch tasks for user ${user.id}`);
          }
          const tasks = await tasksResponse.json();

          // Total tasks = number of task assignments
          const totalTasks = tasks.length;

          // Sum of realHours from nested task object (handle null/undefined)
          const totalHours = tasks.reduce((sum, assignment) => {
            const hours = assignment.task?.realHours;
            return sum + (typeof hours === "number" ? hours : 0);
          }, 0);

          return {
            username: user.username,
            totalTasks,
            totalHours,
            cost: totalHours * 25,
          };
        });

        const usersStats = await Promise.all(statsPromises);
        setUserStats(usersStats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUsersAndStats();
  }, []);

  if (loadingUser) return <div className="dashboard-loading">Loading user…</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome to Your Dashboard</h2>
      </div>

      {user && (
        <div className="user-info-container">
          <div className="user-info-card">
            <h3>User Profile</h3>
            <div className="user-info-item">
              <span className="label">Username:</span>
              <span className="value">{user.username}</span>
            </div>
            <div className="user-info-item">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="user-info-item">
              <span className="label">Role:</span>
              <span className="value">{user.role}</span>
            </div>
          </div>
        </div>
      )}

      <div className="kpi-container">
        <h3>📊 Tareas Completadas, Horas y Costo por Usuario</h3>
        {loadingStats ? (
          <p>Cargando datos…</p>
        ) : userStats.length === 0 ? (
          <p>No hay datos para mostrar.</p>
        ) : (
          <table className="kpi-table">
            <thead>
              <tr>
                <th>Usuario2</th>
                <th>Tareas Completadas</th>
                <th>Horas Trabajadas</th>
                <th>Costo ($)</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map((stat, index) => (
                <tr key={index}>
                  <td>{stat.username}</td>
                  <td>{stat.totalTasks}</td>
                  <td>{stat.totalHours.toFixed(2)} h</td>
                  <td>${stat.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
