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
  Checkbox
} from "@mui/material";
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';

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
  ...(status === "Completado" && {
    backgroundColor: '#5f7d4f',
    color: '#fef9f2'
  }),
  ...(status === "Pendiente" && {
    backgroundColor: '#d63b25',
    color: '#fef9f2'
  }),
  ...(status === "En progreso" && {
    backgroundColor: '#5b5652',
    color: '#fef9f2'
  })
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

function CurrentSprints() {
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [subtasks, setSubtasks] = useState({});
  const [expandedSprints, setExpandedSprints] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const [showSubTaskForm, setShowSubTaskForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch sprints
        const sprintsResponse = await fetch('http://localhost:8081/api/sprints');
        if (!sprintsResponse.ok) throw new Error('Failed to fetch sprints');
        const sprintsData = await sprintsResponse.json();
        
        // Fetch all tasks
        const tasksResponse = await fetch('http://localhost:8081/todolist');
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
          const subtaskResponse = await fetch(`http://localhost:8081/todolist/subtask/${task.id}`);
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

  const toggleSprintExpansion = (sprintId) => {
    setExpandedSprints(prev => ({
      ...prev,
      [sprintId]: !prev[sprintId]
    }));
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const toggleSubTaskForm = (taskId) => {
    setShowSubTaskForm(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const calculateProgress = (taskId) => {
    if (!subtasks[taskId] || subtasks[taskId].length === 0) return 0;
    const completed = subtasks[taskId].filter(subTask => subTask.done).length;
    return (completed / subtasks[taskId].length) * 100;
  };

  const toggleTaskDone = async (taskId, description, currentStatus) => {
    try {
      // Check if all subtasks are completed before marking task as done
      if (!currentStatus && subtasks[taskId] && subtasks[taskId].length > 0 && 
          !subtasks[taskId].every(subTask => subTask.done)) {
        alert("Error: All subtasks must be completed before marking the main task as done.");
        return;
      }

      const response = await fetch(`http://localhost:8081/todolist/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          description: description, 
          done: !currentStatus 
        })
      });

      if (response.ok) {
        const updatedTask = await response.json();
        // Update tasks state
        const updatedTasks = { ...tasks };
        for (const sprintId in updatedTasks) {
          updatedTasks[sprintId] = updatedTasks[sprintId].map(task => 
            task.id === taskId ? updatedTask : task
          );
        }
        setTasks(updatedTasks);
      }
    } catch (err) {
      console.error('Error toggling task status:', err);
    }
  };

  const toggleSubTaskDone = async (subTaskId, currentStatus, taskId) => {
    console.log('--- Toggling Subtask ---');
    console.log('Subtask ID being sent:', subTaskId);
    console.log('Parent Task ID:', taskId);
    console.log('Current Status:', currentStatus);
    console.log('Request URL:', `http://localhost:8081/todolist/subtask/${subTaskId}/toggle`);
  
    try {
      const response = await fetch(`http://localhost:8081/todolist/subtask/${subTaskId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ done: !currentStatus })
      });
      
      console.log('Response Status:', response.status);
      
      if (response.ok) {
        const updatedSubtask = await response.json();
        console.log('Updated Subtask:', updatedSubtask);
        
        // Update local state
        setSubtasks(prevSubtasks => {
          const updated = {
            ...prevSubtasks,
            [taskId]: prevSubtasks[taskId].map(subTask => 
              subTask.ID === subTaskId ? updatedSubtask : subTask
            )
          };
          console.log('Updated Subtasks State:', updated);
          return updated;
        });
      } else {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
      }
    } catch (err) {
      console.error('Error toggling subtask status:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        subtaskId: subTaskId,
        taskId: taskId
      });
    }
  };

  const addSubTask = async (taskId) => {
    if (!newSubTaskText.trim()) {
      alert("Error: Subtasks cannot be empty");
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8081/todolist/subtask/${taskId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          description: newSubTaskText, 
          done: false 
        })
      });
      
      if (response.ok) {
        const newSubTask = await response.json();
        // Update local state
        const updatedSubtasks = { ...subtasks };
        if (!updatedSubtasks[taskId]) {
          updatedSubtasks[taskId] = [];
        }
        updatedSubtasks[taskId].push(newSubTask);
        setSubtasks(updatedSubtasks);
        setNewSubTaskText("");
        setShowSubTaskForm(prev => ({
          ...prev,
          [taskId]: false
        }));
      }
    } catch (err) {
      console.error('Error adding subtask:', err);
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
        Current Sprints
      </Typography>
      
      <TableContainer>
        <OracleTable>
          <TableHead>
            <TableRow>
              <TableCell width="10%">Sprint</TableCell>
              <TableCell width="20%">Name</TableCell>
              <TableCell width="15%">Start Date</TableCell>
              <TableCell width="15%">End Date</TableCell>
              <TableCell width="10%">Status</TableCell>
              <TableCell width="10%">Tasks</TableCell>
              <TableCell width="10%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sprints.map((sprint) => (
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
                    {new Date(sprint.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(sprint.finishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <StatusChip 
                      label={sprint.status} 
                      status={sprint.status}
                    />
                  </TableCell>
                  <TableCell>
                    {tasks[sprint.sprintId] ? tasks[sprint.sprintId].length : 0}
                  </TableCell>
                  <TableCell>
                    {/* Add sprint actions here if needed */}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={expandedSprints[sprint.sprintId]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Tasks
                        </Typography>
                        {tasks[sprint.sprintId] && tasks[sprint.sprintId].length > 0 ? (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell width="5%">Task</TableCell>
                                <TableCell width="40%">Description</TableCell>
                                <TableCell width="15%">Progress</TableCell>
                                <TableCell width="15%">Created</TableCell>
                                <TableCell width="10%">Status</TableCell>
                                <TableCell width="15%">Actions</TableCell>
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
                                      <ProgressBar>
                                        <div style={{ width: `${calculateProgress(task.id)}%` }} />
                                      </ProgressBar>
                                      {Math.round(calculateProgress(task.id))}%
                                    </TableCell>
                                    <TableCell>
                                      {new Date(task.creationTs).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      })}
                                    </TableCell>
                                    <TableCell>
                                      <Checkbox
                                        checked={task.done}
                                        onChange={() => toggleTaskDone(task.id, task.description, task.done)}
                                        color="primary"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={() => toggleSubTaskForm(task.id)}
                                      >
                                        Add Subtask
                                      </Button>
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
                                                  <TableCell width="5%">Status</TableCell>
                                                  <TableCell width="70%">Description</TableCell>
                                                  <TableCell width="25%">Created</TableCell>
                                                </TableRow>
                                              </TableHead>
                                              <TableBody>
                                                {subtasks[task.id].map((subTask) => (
                                                  <TableRow key={subTask.ID}>
                                                    <TableCell>
                                                      <Checkbox
                                                        checked={subTask.done}
                                                        onChange={() => toggleSubTaskDone(subTask.ID, subTask.done, task.id)}
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
            ))}
          </TableBody>
        </OracleTable>
      </TableContainer>
    </OraclePaper>
  );
}

export default CurrentSprints;