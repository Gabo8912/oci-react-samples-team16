import React, { useState, useEffect, useCallback } from "react";
import "./Dashboard.css";
import {
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, IconButton,
  Collapse, Typography
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TeamHoursGraph from './components/TeamHoursGraph';
import UserHoursGraph from './components/UserHoursGraph';
import CurrentSprints from "./NewSprint";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);
  const [userTasks, setUserTasks] = useState({});
  const [teams, setTeams] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [activeView, setActiveView] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [expandedTeams, setExpandedTeams] = useState({});
  
  const [sprints, setSprints] = useState([]);
  const [sprintTasks, setSprintTasks] = useState({});
  const [sprintSubtasks, setSprintSubtasks] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [loadingSprints, setLoadingSprints] = useState(true);
  const [sprintError, setSprintError] = useState(null);

  useEffect(() => {
    const fetchSprintData = async () => {
      try {
        setLoadingSprints(true);

        const [sprintRes, taskRes, userRes] = await Promise.all([
          fetch(`${baseUrl}/api/sprints`),
          fetch(`${baseUrl}/todolist`),
          fetch(`${baseUrl}/api/users`)
        ]);

        if (!sprintRes.ok || !taskRes.ok || !userRes.ok) throw new Error("Failed to fetch sprint data");

        const [sprintsData, tasksData, usersData] = await Promise.all([
          sprintRes.json(),
          taskRes.json(),
          userRes.json()
        ]);

        // Organize tasks by sprint
        const tasksBySprint = {};
        for (const task of tasksData) {
          if (task.sprintId) {
            if (!tasksBySprint[task.sprintId]) tasksBySprint[task.sprintId] = [];
            tasksBySprint[task.sprintId].push(task);
          }
        }

        // Fetch subtasks for each task
        const subtasksMap = {};
        await Promise.all(tasksData.map(async (task) => {
          const res = await fetch(`${baseUrl}/todolist/subtask/${task.id}`);
          if (res.ok) {
            const subtaskData = await res.json();
            subtasksMap[task.id] = subtaskData;
          }
        }));

        setSprints(sprintsData);
        setSprintTasks(tasksBySprint);
        setSprintSubtasks(subtasksMap);
        setAllUsers(usersData);
      } catch (err) {
        console.error("Sprint data error:", err);
        setSprintError(err.message);
      } finally {
        setLoadingSprints(false);
      }
    };

    fetchSprintData();
  }, []);


  // Fetch user data
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

  // Fetch users and stats
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
        
        // Filter out managers
        const nonManagerUsers = users.filter(user => user.role !== "Manager");
        
        const allTasks = {};
        const statsPromises = nonManagerUsers.map(async (user) => {
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

  // Fetch teams
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
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeams();
  }, []);

  // Collect team tasks
  const collectTeamTasks = useCallback(() => {
    const allTeamTasks = [];
    teams.forEach(team => {
      team.userIds.forEach(userId => {
        // Skip if user is a manager
        const user = userStats.find(u => u.id === userId);
        if (user && user.role === "Manager") return;
        
        const userTasksForUser = userTasks[userId] || [];
        const tasksArray = Array.isArray(userTasksForUser) ? userTasksForUser : Object.values(userTasksForUser);
        tasksArray.forEach(assignment => {
          if (assignment.task) {
            allTeamTasks.push({
              id: assignment.task.id,
              description: assignment.task.description,
              estimatedHours: assignment.task.estimatedHours || 0,
              realHours: assignment.task.realHours || 0,
              teamName: team.name,
              userId: userId,
              done: assignment.task.done
            });
          }
        });
      });
    });
    setTeamTasks(allTeamTasks);
  }, [teams, userTasks, userStats]);

  useEffect(() => {
    collectTeamTasks();
  }, [teams, userTasks, collectTeamTasks]);

  const toggleUserExpansion = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const toggleTeamExpansion = (teamId) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  if (loadingUser) return <div className="dashboard-loading">Loading user...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome to Your Dashboard</h2>
      </div>

      {/* Always visible user profile */}
      <div className="user-profile-card">
        <h3>User Profile</h3>
        <div className="user-profile-details">
          <div className="profile-item">
            <span className="label">Username:</span>
            <span className="value">{user.username}</span>
          </div>
          <div className="profile-item">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="profile-item">
            <span className="label">Role:</span>
            <span className="value">{user.role}</span>
          </div>
        </div>
      </div>

      {/* KPI Selection Buttons */}
      <div className="kpi-selector">
        <Button
          variant={activeView === 'individual' ? "contained" : "outlined"}
          onClick={() => setActiveView('individual')}
          className="kpi-button"
        >
          Individual KPIs
        </Button>
        <Button
          variant={activeView === 'team' ? "contained" : "outlined"}
          onClick={() => setActiveView('team')}
          className="kpi-button"
        >
          Team KPIs
        </Button>
        <Button
          variant={activeView === 'sprint' ? "contained" : "outlined"}
          onClick={() => setActiveView('sprint')}
          className="kpi-button"
        >
          Sprint KPIs
        </Button>
      </div>

      {/* Individual KPIs View */}
      {activeView === 'individual' && (
        <div className="kpi-view">
          <h3>Individual Performance Metrics</h3>
          {loadingStats ? (
            <p>Loading data...</p>
          ) : userStats.length === 0 ? (
            <p>No data to display.</p>
          ) : (
            <div className="individual-kpis">
              <div className="graph-container" style={{ marginBottom: '40px' }}>
                <UserHoursGraph 
                  teamTasks={teamTasks.filter(task => {
                    const user = userStats.find(u => u.id === task.userId);
                    return user && user.role !== "Manager";
                  })}
                  allUsers={userStats} // Still needed for username lookup
                />
              </div>
                            {/* Add this spacer div */}
              <div style={{ height: '40px' }}></div>
              <TableContainer component={Paper} className="kpi-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Details</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Completed Tasks</TableCell>
                      <TableCell>Hours Worked</TableCell>
                      <TableCell>Cost ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userStats.map((stat) => (
                      <React.Fragment key={stat.id}>
                        <TableRow>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => toggleUserExpansion(stat.id)}
                            >
                              {expandedUsers[stat.id] ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell>{stat.username}</TableCell>
                          <TableCell>{stat.totalTasks}</TableCell>
                          <TableCell>{stat.totalHours.toFixed(2)} h</TableCell>
                          <TableCell>${stat.cost.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                            <Collapse in={expandedUsers[stat.id]} timeout="auto" unmountOnExit>
                              <Box margin={1}>
                                <Typography variant="h6" gutterBottom>
                                  Task Details
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Task ID</TableCell>
                                      <TableCell>Description</TableCell>
                                      <TableCell>Estimated Hours</TableCell>
                                      <TableCell>Actual Hours</TableCell>
                                      <TableCell>Status</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {userTasks[stat.id]?.length > 0 ? (
                                      userTasks[stat.id].map((assignment) => (
                                        <TableRow key={assignment.id}>
                                          <TableCell>{assignment.task?.id}</TableCell>
                                          <TableCell>{assignment.task?.description}</TableCell>
                                          <TableCell>{(assignment.task?.estimatedHours ?? 0).toFixed(1)}</TableCell>
                                          <TableCell>{(assignment.task?.realHours ?? 0).toFixed(1)}</TableCell>
                                          <TableCell>
                                            <span className={`status-badge ${assignment.task?.done ? 'completed' : 'in-progress'}`}>
                                              {assignment.task?.done ? "COMPLETED" : "IN PROGRESS"}
                                            </span>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={5} align="center">
                                          No tasks found for this user
                                        </TableCell>
                                      </TableRow>
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
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
      )}

      {/* Team KPIs View */}
      {activeView === 'team' && (
        <div className="kpi-view">
          <h3>Team Performance Metrics</h3>
          {teams.length === 0 ? (
            <p>No teams to display.</p>
          ) : (
            <div className="team-kpis">
              <div className="graph-container">
                <TeamHoursGraph 
                  teamTasks={teamTasks.filter(task => {
                    const user = userStats.find(u => u.id === task.userId);
                    return user && user.role !== "Manager";
                  })}
                  allUsers={userStats}
                />
              </div>

              {/* Add this spacer div */}
              <div style={{ height: '40px' }}></div>
              <TableContainer component={Paper} className="kpi-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Details</TableCell>
                      <TableCell>Team</TableCell>
                      <TableCell>Members</TableCell>
                      <TableCell>Total Hours</TableCell>
                      <TableCell>Total Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teams.map((team) => {
                      const teamMembers = userStats.filter(u => team.userIds.includes(u.id));
                      const totalHours = teamMembers.reduce((sum, member) => sum + member.totalHours, 0);
                      const totalCost = teamMembers.reduce((sum, member) => sum + member.cost, 0);
                      
                      return (
                        <React.Fragment key={team.id}>
                          <TableRow>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => toggleTeamExpansion(team.id)}
                              >
                                {expandedTeams[team.id] ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell>{team.name}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                  {teamMembers
                                    .filter(member => {
                                      const user = userStats.find(u => u.id === member.id);
                                      return user && user.role !== "Manager";
                                    })
                                    .map(member => (
                                      <span key={member.id}>{member.username}</span>
                                    ))}
                                </Box>
                              </TableCell>
                            <TableCell>{totalHours.toFixed(2)} h</TableCell>
                            <TableCell>${totalCost.toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                              <Collapse in={expandedTeams[team.id]} timeout="auto" unmountOnExit>
                                <Box margin={1}>
                                  <Typography variant="h6" gutterBottom>
                                    Team Task Details
                                  </Typography>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Task ID</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Estimated Hours</TableCell>
                                        <TableCell>Actual Hours</TableCell>
                                        <TableCell>Status</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {teamTasks.filter(task => team.userIds.includes(task.userId)).length > 0 ? (
                                        teamTasks
                                          .filter(task => team.userIds.includes(task.userId))
                                          .map((task, index) => {
                                            const user = userStats.find(u => u.id === task.userId);
                                            return (
                                              <TableRow key={index}>
                                                <TableCell>{user?.username || 'Unknown'}</TableCell>
                                                <TableCell>{task.id}</TableCell>
                                                <TableCell>{task.description}</TableCell>
                                                <TableCell>{task.estimatedHours.toFixed(1)}</TableCell>
                                                <TableCell>{task.realHours.toFixed(1)}</TableCell>
                                                <TableCell>
                                                  <span className={`status-badge ${task.done ? 'completed' : 'in-progress'}`}>
                                                    {task.done ? "COMPLETED" : "IN PROGRESS"}
                                                  </span>
                                                </TableCell>
                                              </TableRow>
                                            );
                                          })
                                      ) : (
                                        <TableRow>
                                          <TableCell colSpan={6} align="center">
                                            No tasks found for this team
                                          </TableCell>
                                        </TableRow>
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
              </TableContainer>
            </div>
          )}
        </div>
      )}

      {/* Sprint KPIs View */}
<div className="kpi-view" style={{ display: activeView === 'sprint' ? 'block' : 'none' }}>
  <h3>Sprint Metrics</h3>
  <CurrentSprints
    sprints={sprints}
    tasks={sprintTasks}
    subtasks={sprintSubtasks}
    users={allUsers}
    loading={loadingSprints}
    error={sprintError}
  />
</div>

    </div>
  );
};

export default Dashboard;