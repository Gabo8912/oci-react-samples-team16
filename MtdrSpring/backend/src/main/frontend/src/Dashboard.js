import React, { useState, useEffect, useCallback } from "react";
import "./Dashboard.css";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton, Collapse, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import TeamHoursGraph from './components/TeamHoursGraph';
import UserHoursGraph from './components/UserHoursGraph';
import CurrentSprints from "./NewSprint"; // 👈 Added this import

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const OracleTable = (props) => (
  <TableContainer component={Paper} style={{ background: "#fef9f2" }}>
    <Table size="small">{props.children}</Table>
  </TableContainer>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [userTasks, setUserTasks] = useState({});
  const [loadingUserTasks] = useState({});
  const [teams, setTeams] = useState([]);
  const [expandedTeams, setExpandedTeams] = useState({});
  const [teamTasks, setTeamTasks] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setError("No user is logged in");
          setLoadingUser(false);
          return;
        }
        const response = await fetch(`${baseUrl}/auth/user/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user data");
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

  useEffect(() => {
    const fetchUsersAndStats = async () => {
      try {
        setLoadingStats(true);
        const usersResponse = await fetch(`${baseUrl}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const users = await usersResponse.json();
        const allTasks = {};
        const statsPromises = users.map(async (user) => {
          const tasksResponse = await fetch(`${baseUrl}/api/task-assignments/user/${user.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const tasks = tasksResponse.ok ? await tasksResponse.json() : [];
          allTasks[user.id] = tasks;
          const totalTasks = tasks.length;
          const totalHours = tasks.reduce((sum, assignment) => {
            const hours = assignment.task?.realHours;
            return sum + (typeof hours === "number" ? hours : 0);
          }, 0);
          return {
            id: user.id,
            username: user.username,
            totalTasks,
            totalHours,
            cost: totalHours * 25,
          };
        });
        const usersStats = await Promise.all(statsPromises);
        setUserStats(usersStats);
        setUserTasks(allTasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchUsersAndStats();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/task-assignments/teams`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch teams");
        const data = await response.json();
        setTeams(data);
      } catch (err) {}
    };
    fetchTeams();
  }, []);

  const handleToggleUserTasks = (userId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleToggleTeam = (teamId) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const collectTeamTasks = useCallback(() => {
    const allTeamTasks = [];
    teams.forEach(team => {
      team.userIds.forEach(userId => {
        const userTasksForUser = userTasks[userId] || [];
        const tasksArray = Array.isArray(userTasksForUser) ? userTasksForUser : Object.values(userTasksForUser);
        tasksArray.forEach(assignment => {
          if (assignment.task) {
            allTeamTasks.push({
              description: assignment.task.description,
              estimatedHours: assignment.task.estimatedHours || 0,
              realHours: assignment.task.realHours || 0,
              teamName: team.name
            });
          }
        });
      });
    });
    setTeamTasks(allTeamTasks);
  }, [teams, userTasks]);

  useEffect(() => {
    collectTeamTasks();
  }, [teams, userTasks, collectTeamTasks]);

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
            <div className="user-info-item"><span className="label">Username:</span><span className="value">{user.username}</span></div>
            <div className="user-info-item"><span className="label">Email:</span><span className="value">{user.email}</span></div>
            <div className="user-info-item"><span className="label">Role:</span><span className="value">{user.role}</span></div>
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
          <OracleTable>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Tareas Completadas</TableCell>
                <TableCell>Horas Trabajadas</TableCell>
                <TableCell>Costo ($)</TableCell>
                <TableCell>Ver Tareas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userStats.map((stat) => (
                <React.Fragment key={stat.id}>
                  <TableRow>
                    <TableCell>{stat.username}</TableCell>
                    <TableCell>{stat.totalTasks}</TableCell>
                    <TableCell>{stat.totalHours.toFixed(2)} h</TableCell>
                    <TableCell>${stat.cost.toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleToggleUserTasks(stat.id)}>
                        {expandedUsers[stat.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={expandedUsers[stat.id]} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Task</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Hours (Est/Real)</TableCell>
                                <TableCell>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {loadingUserTasks[stat.id] ? (
                                <TableRow>
                                  <TableCell colSpan={4}>Loading tasks...</TableCell>
                                </TableRow>
                              ) : (userTasks[stat.id]?.length === 0) ? (
                                <TableRow>
                                  <TableCell colSpan={4}>No tasks for this user</TableCell>
                                </TableRow>
                              ) : (
                                userTasks[stat.id]?.map((assignment) => (
                                  <TableRow key={assignment.id}>
                                    <TableCell>{assignment.task?.id}</TableCell>
                                    <TableCell>{assignment.task?.description}</TableCell>
                                    <TableCell>{(assignment.task?.estimatedHours ?? 0).toFixed(1)} / {(assignment.task?.realHours ?? 0).toFixed(1)}</TableCell>
                                    <TableCell>
                                      <Button variant="contained" size="small" style={{ backgroundColor: assignment.task?.done ? "#5f7d4f" : "#5b5652", color: "#fff" }} disabled>
                                        {assignment.task?.done ? "COMPLETED" : "IN PROGRESS"}
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </OracleTable>
        )}
      </div>

      {/* 👇 Injected CurrentSprints component */}
      <CurrentSprints />

      {user && userTasks[user.id] && (
        <div className="dashboard-section" style={{ minHeight: '400px' }}>
          <h2>Your Task Hours Analysis</h2>
          <UserHoursGraph userTasks={Array.isArray(userTasks[user.id]) ? userTasks[user.id] : []} />
        </div>
      )}

      <div className="kpi-container">
        <h3>👥 Tareas por Equipo</h3>
        {teams.length === 0 ? (
          <p>No hay equipos para mostrar.</p>
        ) : (
          <>
            <OracleTable>
              <TableHead>
                <TableRow>
                  <TableCell>Equipo</TableCell>
                  <TableCell>Ver Miembros</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team) => (
                  <React.Fragment key={team.id}>
                    <TableRow>
                      <TableCell>{team.name}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleToggleTeam(team.id)}
                        >
                          {expandedTeams[team.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
                        <Collapse in={expandedTeams[team.id]} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Usuario</TableCell>
                                  <TableCell>Tareas Completadas</TableCell>
                                  <TableCell>Horas Trabajadas</TableCell>
                                  <TableCell>Costo ($)</TableCell>
                                  <TableCell>Ver Tareas</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {team.userIds.map((userId) => {
                                  const stat = userStats.find((u) => u.id === userId);
                                  if (!stat) return null;
                                  return (
                                    <React.Fragment key={userId}>
                                      <TableRow>
                                        <TableCell>{stat.username}</TableCell>
                                        <TableCell>{stat.totalTasks}</TableCell>
                                        <TableCell>{stat.totalHours.toFixed(2)} h</TableCell>
                                        <TableCell>${stat.cost.toFixed(2)}</TableCell>
                                        <TableCell>
                                          <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() => handleToggleUserTasks(userId)}
                                          >
                                            {expandedUsers[userId] ? (
                                              <KeyboardArrowUpIcon />
                                            ) : (
                                              <KeyboardArrowDownIcon />
                                            )}
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                          <Collapse in={expandedUsers[userId]} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                              <Table size="small">
                                                <TableHead>
                                                  <TableRow>
                                                    <TableCell width="10%">Task</TableCell>
                                                    <TableCell width="60%">Description</TableCell>
                                                    <TableCell width="20%">Hours (Est/Real)</TableCell>
                                                    <TableCell width="10%">Status</TableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  {(userTasks[userId] || []).length === 0 ? (
                                                    <TableRow>
                                                      <TableCell colSpan={4} style={{ color: "#5b5652" }}>
                                                        No tasks for this user
                                                      </TableCell>
                                                    </TableRow>
                                                  ) : (
                                                    userTasks[userId]?.map((assignment) => (
                                                      <TableRow key={assignment.id}>
                                                        <TableCell>{assignment.task?.id}</TableCell>
                                                        <TableCell>{assignment.task?.description}</TableCell>
                                                        <TableCell>
                                                          {(assignment.task?.estimatedHours ?? 0).toFixed(1)} / {(assignment.task?.realHours ?? 0).toFixed(1)}
                                                        </TableCell>
                                                        <TableCell>
                                                          <Button
                                                            variant="contained"
                                                            size="small"
                                                            style={{
                                                              backgroundColor:
                                                                assignment.task?.done ? "#5f7d4f" : "#5b5652",
                                                              color: "#fff",
                                                              fontWeight: "bold",
                                                            }}
                                                            disabled
                                                          >
                                                            {assignment.task?.done ? "COMPLETED" : "IN PROGRESS"}
                                                          </Button>
                                                        </TableCell>
                                                      </TableRow>
                                                    ))
                                                  )}
                                                </TableBody>
                                              </Table>
                                            </Box>
                                          </Collapse>
                                        </TableCell>
                                      </TableRow>
                                    </React.Fragment>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </OracleTable>
          </>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Team Hours Analysis</h2>
        <TeamHoursGraph teamTasks={teamTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
