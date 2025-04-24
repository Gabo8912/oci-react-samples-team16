import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setError("No user is logged in");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8081/auth/user/${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Cargar KPIs individuales
  useEffect(() => {
    fetch("http://localhost:8081/kpi/users")
      .then((res) => res.json())
      .then((data) => {
        setKpis(Array.isArray(data) ? data : []);
        setKpiLoading(false);
      })
      .catch((err) => {
        console.error("Error loading KPI:", err);
        setKpiLoading(false);
      });
  }, []);

  if (loading) return <div className="dashboard-loading">Loading user…</div>;
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
        <h3>📊 KPI por Usuario y Sprint</h3>
        {kpiLoading ? (
          <p>Cargando KPI…</p>
        ) : kpis.length === 0 ? (
          <p>No hay datos para mostrar.</p>
        ) : (
          <table className="kpi-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Sprint</th>
                <th>Tareas Completadas</th>
                <th>Horas Trabajadas</th>
                <th>Costo ($)</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map((kpi, index) => (
                <tr key={index}>
                  <td>{kpi.username}</td>
                  <td>{kpi.sprintId}</td>
                  <td>{kpi.completedTasks}</td>
                  <td>{kpi.totalHours} h</td>
                  <td>${kpi.costo.toFixed(2)}</td>
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
