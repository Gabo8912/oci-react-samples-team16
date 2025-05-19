import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  CircularProgress,
  Chip,
  Paper,
  Collapse,
  IconButton,
  Box,
  TextField,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const baseUrl = process.env.REACT_APP_BACKEND_URL;

// Custom styled components
const OraclePaper = styled(Paper)(({ theme }) => ({
  background: '#fef9f2',
  color: '#161513',
  boxShadow: '0 10px 18px 0 rgba(0, 0, 0, 0.2), 0 4.5rem 8rem 0 rgba(0, 0, 0, 0.1)',
  borderRadius: '0.5rem',
  padding: '1rem',
  margin: '2rem 0 4rem 0',
  width: '95%',
  maxWidth: '50rem'
}));

const OracleTable = styled(Table)({
  '& .MuiTableCell-root': {
    borderBottom: 'solid 1px #5b5652',
    padding: '0.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
  },
  '& .MuiTableCell-head': {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5'
  }
});

const StatusChip = styled(Chip)(({ status }) => ({
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  ...(status === "COMPLETED" && {
    backgroundColor: '#5f7d4f',
    color: '#fef9f2'
  }),
  ...(status === "IN_PROGRESS" && {
    backgroundColor: '#5b5652', 
    color: '#fef9f2'
  }),
  ...(status === "PENDING" && {
    backgroundColor: '#d63b25', 
    color: '#fef9f2'
  }),
}));

const ProgressBar = styled('div')({
  height: '8px',
  backgroundColor: '#e0e0e0',
  borderRadius: '4px',
  margin: '4px 0',
  '& > div': {
    height: '100%',
    borderRadius: '4px',
    backgroundColor: '#5f7d4f',
    transition: 'width 0.3s ease'
  }
});

const AssignmentsModal = ({ assignments, onClose }) => {
  if (!assignments || assignments.length === 0) {
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fef9f2',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 18px 0 rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        width: '80%',
        maxWidth: '600px'
      }}>
        <Typography variant="h6" style={{ marginBottom: '1rem' }}>
          No users assigned to this task
        </Typography>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fef9f2',
      padding: '2rem',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 18px 0 rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      width: '80%',
      maxWidth: '600px'
    }}>
      <Typography variant="h6" style={{ marginBottom: '1rem' }}>
        Users Assigned to Task
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map(assignment => (
              <TableRow key={assignment.id}>
                <TableCell>{assignment.user?.id}</TableCell>
                <TableCell>{assignment.user?.username || 'N/A'}</TableCell>
                <TableCell>{assignment.user?.email || 'N/A'}</TableCell>
                <TableCell>{assignment.user?.role || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

function CurrentSprints() {
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState({});
  const [subtasks, setSubtasks] = useState({});
  const [expandedSprints, setExpandedSprints] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const [showSubTaskForm, setShowSubTaskForm] = useState({});
  const [selectedTaskAssignments, setSelectedTaskAssignments] = useState(null);
  const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedGraphType, setSelectedGraphType] = useState('totalHours'); // 'totalHours', 'developerHours', 'developerTasks'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const usersData = await response.json();
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
  
    fetchUsers();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch sprints
        const sprintsResponse = await fetch(`${baseUrl}/api/sprints`);
        if (!sprintsResponse.ok) throw new Error('Failed to fetch sprints');
        const sprintsData = await sprintsResponse.json();
        
        // Fetch all tasks
        const tasksResponse = await fetch(`${baseUrl}/todolist`);
        if (!tasksResponse.ok) throw new Error('Failed to fetch tasks');
        const tasksData = await tasksResponse.json();
        
        // Organize tasks by sprint
        const tasksBySprint = {};
        tasksData.forEach(task => {
          if (task.sprintId) {
            if (!tasksBySprint[task.sprintId]) {
              tasksBySprint[task.sprintId] = [];
            }
            tasksBySprint[task.sprintId].push(task);
          }
        });
        
        // Fetch subtasks for each task
        const subtasksMap = {};
        for (const task of tasksData) {
          const subtaskResponse = await fetch(`${baseUrl}/todolist/subtask/${task.id}`);
          if (subtaskResponse.ok) {
            const subtaskData = await subtaskResponse.json();
            subtasksMap[task.id] = subtaskData;
          }
        }
        
        setSprints(sprintsData);
        setTasks(tasksBySprint);
        setSubtasks(subtasksMap);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // Add these helper functions at the top of the component
// Constants
const SPRINT_STATUS = {
  COMPLETED: "COMPLETED",
  IN_PROGRESS: "IN_PROGRESS"
};

const GRAPH_TYPES = {
  TOTAL_HOURS: 'totalHours',
  DEVELOPER_HOURS: 'developerHours',
  DEVELOPER_TASKS: 'developerTasks'
};

const CHART_COLORS = {
  blue: { background: 'rgba(54, 162, 235, 0.6)', border: 'rgb(54, 162, 235)' },
  green: { background: 'rgba(75, 192, 192, 0.6)', border: 'rgb(75, 192, 192)' },
  purple: { background: 'rgba(153, 102, 255, 0.6)', border: 'rgb(153, 102, 255)' },
  orange: { background: 'rgba(255, 159, 64, 0.6)', border: 'rgb(255, 159, 64)' },
  red: { background: 'rgba(255, 99, 132, 0.6)', border: 'rgb(255, 99, 132)' },
  teal: { background: 'rgba(0, 128, 128, 0.6)', border: 'rgb(0, 128, 128)' }
};

const DEVELOPER_COLORS = [
  CHART_COLORS.blue,
  CHART_COLORS.green,
  CHART_COLORS.purple,
  CHART_COLORS.orange,
  CHART_COLORS.red,
  CHART_COLORS.teal
];

// Helper Functions
const calculateHours = (tasks, field) => {
  return tasks.reduce((total, task) => total + (task[field] || 0), 0);
};

const groupByDeveloper = (tasks, field, initialValue) => {
  const result = {};
  tasks.forEach(task => {
    if (task.userId) {
      if (!result[task.userId]) {
        result[task.userId] = initialValue;
      }
      if (typeof initialValue === 'object') {
        result[task.userId].total++;
        if (task.done) result[task.userId].completed++;
      } else {
        result[task.userId] += task[field] || 0;
      }
    }
  });
  return result;
};

// Main Functions
const getSprintHours = (sprintId, tasks) => {
  const sprintTasks = tasks[sprintId] || [];
  return {
    estimated: calculateHours(sprintTasks, 'estimatedHours'),
    real: calculateHours(sprintTasks, 'realHours')
  };
};

const getDeveloperHours = (sprintId, tasks) => {
  return groupByDeveloper(tasks[sprintId] || [], 'realHours', 0);
};

const getDeveloperTasks = (sprintId, tasks) => {
  return groupByDeveloper(tasks[sprintId] || [], null, { total: 0, completed: 0 });
};

const isSprintComplete = (sprintId, tasks) => {
  const sprintTasks = tasks[sprintId] || [];
  return sprintTasks.length > 0 && sprintTasks.every(task => task.done);
};

const toggleExpansion = (prevState, id) => ({
  ...prevState,
  [id]: !prevState[id]
});

const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

const updateSprintStatus = async (sprintId, status, baseUrl) => {
  const endpoint = status === SPRINT_STATUS.COMPLETED ? 'complete' : 'uncomplete';
  await fetchWithErrorHandling(`${baseUrl}/api/sprints/${sprintId}/${endpoint}`, {
    method: 'POST'
  });
  return status;
};

const updateTaskStatus = async (taskId, description, done, baseUrl) => {
  return fetchWithErrorHandling(`${baseUrl}/todolist/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, done })
  });
};

const updateSubTaskStatus = async (subTaskId, done, baseUrl) => {
  return fetchWithErrorHandling(`${baseUrl}/todolist/subtask/${subTaskId}/toggle`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done })
  });
};

const manageSubTask = async (taskId, subTaskId, method, description, baseUrl) => {
  const url = method === 'POST' 
    ? `${baseUrl}/todolist/subtask/${taskId}/add`
    : `${baseUrl}/todolist/subtask/${subTaskId}`;
    
  return fetchWithErrorHandling(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: method === 'POST' ? JSON.stringify({ description, done: false }) : undefined
  });
};

const getGraphData = (selectedGraphType, sprints, tasks, users) => {
  const getDatasetConfig = (user, index) => ({
    label: user.username,
    backgroundColor: DEVELOPER_COLORS[index % DEVELOPER_COLORS.length].background,
    borderColor: DEVELOPER_COLORS[index % DEVELOPER_COLORS.length].border,
    borderWidth: 1
  });

  switch (selectedGraphType) {
    case GRAPH_TYPES.TOTAL_HOURS:
      return {
        labels: sprints.map(sprint => sprint.sprintName),
        datasets: [{
          ...getDatasetConfig({ username: 'Total Hours' }, 0),
          data: sprints.map(sprint => getSprintHours(sprint.sprintId, tasks).real)
        }]
      };
    
    case GRAPH_TYPES.DEVELOPER_HOURS:
      return {
        labels: sprints.map(sprint => sprint.sprintName),
        datasets: users.map((user, index) => ({
          ...getDatasetConfig(user, index),
          data: sprints.map(sprint => getDeveloperHours(sprint.sprintId, tasks)[user.id] || 0)
        }))
      };
    
    case GRAPH_TYPES.DEVELOPER_TASKS:
      return {
        labels: sprints.map(sprint => sprint.sprintName),
        datasets: users.map((user, index) => ({
          ...getDatasetConfig(user, index),
          label: `${user.username} - Completed Tasks`,
          data: sprints.map(sprint => getDeveloperTasks(sprint.sprintId, tasks)[user.id]?.completed || 0)
        }))
      };
    
    default:
      return null;
  }
};

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: selectedGraphType === 'totalHours' ? 'Total Hours per Sprint' :
              selectedGraphType === 'developerHours' ? 'Hours per Developer per Sprint' :
              'Completed Tasks per Developer per Sprint',
        font: {
          size: 16,
          family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return (
      <OraclePaper>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <CircularProgress style={{ color: '#5f7d4f' }} />
        </div>
      </OraclePaper>
    );
  }

  if (error) {
    return (
      <OraclePaper>
        <Typography variant="h6" style={{ color: '#d63b25', marginBottom: '1rem' }}>
          Error loading data
        </Typography>
        <Typography variant="body1" style={{ color: '#161513', marginBottom: '1rem' }}>
          {error}
        </Typography>
      </OraclePaper>
    );
  }

  if (sprints.length === 0) {
    return (
      <OraclePaper>
        <Typography variant="h6" style={{ color: '#161513' }}>
          No sprints found
        </Typography>
      </OraclePaper>
    );
  }

  return (
    <OraclePaper>
      <Typography 
        variant="h4" 
        style={{ 
          color: '#161513',
          margin: '0.5rem 0 1rem 0',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
        }}
      >
        Current sprints hours Breakdown
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select Graph Type</InputLabel>
          <Select
            value={selectedGraphType}
            onChange={(e) => setSelectedGraphType(e.target.value)}
            label="Select Graph Type"
          >
            <MenuItem value="totalHours">Total Hours per Sprint</MenuItem>
            <MenuItem value="developerHours">Hours per Developer per Sprint</MenuItem>
            <MenuItem value="developerTasks">Completed Tasks per Developer per Sprint</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ height: '400px', mb: 3 }}>
        <Bar data={getGraphData()} options={chartOptions} />
      </Box>
      
      <TableContainer>
        <OracleTable>
          <TableHead>
            <TableRow>
              <TableCell width="10%">Sprint</TableCell>
              <TableCell width="20%">Name</TableCell>
              <TableCell width="10%">Est. Hours</TableCell>
              <TableCell width="10%">Real Hours</TableCell>
              <TableCell width="10%">Status</TableCell>
              <TableCell width="10%">Tasks</TableCell>
              <TableCell width="10%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sprints.map((sprint) => {
              const sprintHours = calculateSprintHours(sprint.sprintId);
              const developerHours = calculateDeveloperHours(sprint.sprintId);
              
              return (
                <React.Fragment key={sprint.sprintId}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => toggleSprintExpansion(sprint.sprintId)}
                      >
                        {expandedSprints[sprint.sprintId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                      {sprint.sprintId}
                    </TableCell>
                    <TableCell>{sprint.sprintName}</TableCell>
                    <TableCell>
                      {sprintHours.estimated.toFixed(1)}
                    </TableCell>
                    <TableCell>
                      {sprintHours.real.toFixed(1)}
                    </TableCell>
                    <TableCell>
                      <StatusChip 
                        label={sprint.status === "IN_PROGRESS" ? "IN PROGRESS" : sprint.status}
                        status={sprint.status}
                      />

                    </TableCell>
                    <TableCell>
                      {tasks[sprint.sprintId] ? tasks[sprint.sprintId].length : 0}
                    </TableCell>
                    <TableCell>
                      {sprint.status === "IN_PROGRESS" && isSprintComplete(sprint.sprintId) && (
                        <Button 
                          variant="contained" 
                          color="success"
                          onClick={() => completeSprint(sprint.sprintId)}
                          style={{ marginRight: '8px' }}
                        >
                          Complete Sprint
                        </Button>
                      )}
                      {sprint.status === "COMPLETED" && (
                        <Button 
                          variant="contained" 
                          color="secondary"
                          onClick={() => uncompleteSprint(sprint.sprintId)}
                        >
                          Uncomplete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={expandedSprints[sprint.sprintId]} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                        {/* Developer Hours Breakdown Section */}
                        <Box mb={2}>
                          <Typography variant="h6" gutterBottom>
                            Developer Hours Breakdown
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Developer</TableCell>
                                <TableCell>Hours Worked</TableCell>
                                <TableCell>% of Total</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(developerHours).map(([userId, hours]) => {
                                const percentage = sprintHours.real > 0 ? (hours / sprintHours.real * 100) : 0;
                                const user = users.find(u => u.id === parseInt(userId));
                                const displayName = user ? user.username : `User ${userId}`;
                                
                                return (
                                  <TableRow key={userId}>
                                    <TableCell>{displayName}</TableCell>
                                    <TableCell>{hours.toFixed(1)}</TableCell>
                                    <TableCell>
                                      <ProgressBar>
                                        <div style={{ width: `${percentage}%` }} />
                                      </ProgressBar>
                                      {percentage.toFixed(1)}%
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Box>
  
                          {/* Tasks Section */}
                          <Typography variant="h6" gutterBottom component="div">
                            Tasks
                          </Typography>
                          {tasks[sprint.sprintId] && tasks[sprint.sprintId].length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell width="5%">Task</TableCell>
                                  <TableCell width="30%">Description</TableCell>
                                  <TableCell width="25%">Hours (Est/Real)</TableCell>
                                  <TableCell width="25%">Progress</TableCell>
                                  <TableCell width="10%">Status</TableCell>
                                  <TableCell width="5%">Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {tasks[sprint.sprintId].map((task) => (
                                  <React.Fragment key={task.id}>
                                    <TableRow>
                                      <TableCell>
                                        <IconButton
                                          aria-label="expand row"
                                          size="small"
                                          onClick={() => toggleTaskExpansion(task.id)}
                                        >
                                          {expandedTasks[task.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                      </TableCell>
                                      <TableCell>{task.description}</TableCell>
                                      <TableCell>
                                        {task.estimatedHours?.toFixed(1) || '0'} / {task.realHours?.toFixed(1) || '0'}
                                      </TableCell>
                                      <TableCell>
                                        <Box display="flex" alignItems="center" width="100%">
                                          <Box width="80%" mr={1}>
                                            <ProgressBar>
                                              <div style={{ width: `${calculateProgress(task.id)}%` }} />
                                            </ProgressBar>
                                          </Box>
                                          <Box width="20%">
                                            {Math.round(calculateProgress(task.id))}%
                                          </Box>
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Checkbox
                                          checked={task.done}
                                          onChange={() => toggleTaskDone(task.id, task.description, task.done)}
                                          color="primary"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Box display="flex" flexDirection="column" gap={1}>
                                          <IconButton
                                            size="small"
                                            onClick={() => toggleSubTaskForm(task.id)}
                                            title="Add Subtask"
                                          >
                                            <AddIcon fontSize="small" />
                                          </IconButton>
                                          <IconButton
                                            size="small"
                                            onClick={() => viewTaskAssignments(task.id)}
                                            title="View Assignees"
                                          >
                                            <PeopleIcon fontSize="small" />
                                          </IconButton>
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={expandedTasks[task.id]} timeout="auto" unmountOnExit>
                                          <Box margin={1}>
                                            {showSubTaskForm[task.id] && (
                                              <div style={{ display: 'flex', marginBottom: '1rem' }}>
                                                <TextField
                                                  size="small"
                                                  value={newSubTaskText}
                                                  onChange={(e) => setNewSubTaskText(e.target.value)}
                                                  placeholder="Subtask description"
                                                  style={{ flexGrow: 1, marginRight: '0.5rem' }}
                                                />
                                                <Button
                                                  variant="contained"
                                                  color="primary"
                                                  onClick={() => addSubTask(task.id)}
                                                >
                                                  Add
                                                </Button>
                                              </div>
                                            )}
                                            {subtasks[task.id] && subtasks[task.id].length > 0 ? (
                                              <Table size="small">
                                                <TableHead>
                                                  <TableRow>
                                                    <TableCell width="10%">Status</TableCell>
                                                    <TableCell width="60%">Description</TableCell>
                                                    <TableCell width="20%">Created</TableCell>
                                                    <TableCell width="10%">Actions</TableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  {subtasks[task.id].map((subTask) => (
                                                    <TableRow key={subTask.id}>
                                                      <TableCell>
                                                        <Checkbox
                                                          checked={subTask.done}
                                                          onChange={(e) => toggleSubTaskDone(e, subTask.id, task.id)}
                                                          color="primary"
                                                        />
                                                      </TableCell>
                                                      <TableCell>{subTask.description}</TableCell>
                                                      <TableCell>
                                                        {new Date(subTask.creation_ts).toLocaleDateString('en-US', {
                                                          year: 'numeric',
                                                          month: 'short',
                                                          day: 'numeric'
                                                        })}
                                                      </TableCell>
                                                      <TableCell>
                                                        <IconButton
                                                          size="small"
                                                          onClick={() => deleteSubTask(task.id, subTask.id)}
                                                        >
                                                          <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                      </TableCell>
                                                    </TableRow>
                                                  ))}
                                                </TableBody>
                                              </Table>
                                            ) : (
                                              <Typography variant="body2" style={{ color: '#5b5652', padding: '1rem' }}>
                                                No subtasks for this task
                                              </Typography>
                                            )}
                                          </Box>
                                        </Collapse>
                                      </TableCell>
                                    </TableRow>
                                  </React.Fragment>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography variant="body2" style={{ color: '#5b5652', padding: '1rem' }}>
                              No tasks in this sprint
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </OracleTable>
      </TableContainer>
      {showAssignmentsModal && (
        <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }} onClick={() => setShowAssignmentsModal(false)} />
          <AssignmentsModal 
            assignments={selectedTaskAssignments} 
            onClose={() => setShowAssignmentsModal(false)} 
          />
        </>
      )}
    </OraclePaper>
  );
  
}

export default CurrentSprints;