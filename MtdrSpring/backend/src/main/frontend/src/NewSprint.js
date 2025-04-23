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
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';

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
  const [tasks, setTasks] = useState([]);
  const [subtasks, setSubtasks] = useState({});
  const [expandedSprints, setExpandedSprints] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const [showSubTaskForm, setShowSubTaskForm] = useState({});
  const [selectedTaskAssignments, setSelectedTaskAssignments] = useState(null);
  const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);

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
  // Add these helper functions at the top of the component
  const calculateSprintHours = (sprintId) => {
    const sprintTasks = tasks[sprintId] || [];
    return sprintTasks.reduce(
      (totals, task) => ({
        estimated: totals.estimated + (task.estimatedHours || 0),
        real: totals.real + (task.realHours || 0)
      }),
      { estimated: 0, real: 0 }
    );
  };

  const calculateDeveloperHours = (sprintId) => {
    const sprintTasks = tasks[sprintId] || [];
    const developerHours = {};

    sprintTasks.forEach(task => {
      if (task.userId && task.realHours) {
        if (!developerHours[task.userId]) {
          developerHours[task.userId] = 0;
        }
        developerHours[task.userId] += task.realHours;
      }
    });

    return developerHours;
  };

  const toggleSprintExpansion = (sprintId) => {
    setExpandedSprints(prev => ({
      ...prev,
      [sprintId]: !prev[sprintId]
    }));
  };

  const viewTaskAssignments = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/task-assignments/task/${taskId}`);
      if (!response.ok) throw new Error('Failed to fetch task assignments');
      const assignments = await response.json();
      setSelectedTaskAssignments(assignments);
      setShowAssignmentsModal(true);
    } catch (err) {
      console.error('Error fetching task assignments:', err);
      alert('Error loading task assignments: ' + err.message);
    }
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
    
    // Load subtasks if not already loaded
    if (!subtasks[taskId]) {
      fetch(`http://localhost:8081/todolist/subtask/${taskId}`)
        .then(response => {
          if (response.ok) return response.json();
          throw new Error('Failed to fetch subtasks');
        })
        .then(data => {
          setSubtasks(prev => ({
            ...prev,
            [taskId]: data
          }));
        })
        .catch(err => console.error('Error loading subtasks:', err));
    }
  };

  const completeSprint = async (sprintId) => {
    try {
      // Get all tasks for this sprint
      const sprintTasks = tasks[sprintId] || [];
      
      // Verify all tasks are completed
      const allTasksDone = sprintTasks.every(task => task.done);
      if (!allTasksDone) {
        alert("Cannot complete sprint - not all tasks are done!");
        return;
      }
  
      // Update sprint status to COMPLETED
      const response = await fetch(`http://localhost:8081/api/sprints/${sprintId}/complete`, {
        method: 'POST'
      });
  
      if (response.ok) {
        // Update local state
        setSprints(prev => 
          prev.map(sprint => 
            sprint.sprintId === sprintId 
              ? { ...sprint, status: "COMPLETED" } 
              : sprint
          )
        );
      } else {
        throw new Error('Failed to complete sprint');
      }
    } catch (err) {
      console.error('Error completing sprint:', err);
      alert('Error completing sprint: ' + err.message);
    }
  };

  const uncompleteSprint = async (sprintId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/sprints/${sprintId}/uncomplete`, {
        method: 'POST'
      });
  
      if (response.ok) {
        setSprints(prev => 
          prev.map(sprint => 
            sprint.sprintId === sprintId 
              ? { ...sprint, status: "IN_PROGRESS" } 
              : sprint
          )
        );
      } else {
        throw new Error('Failed to uncomplete sprint');
      }
    } catch (err) {
      console.error('Error uncompleting sprint:', err);
      alert('Error uncompleting sprint: ' + err.message);
    }
  };
  
  const isSprintComplete = (sprintId) => {
    const sprintTasks = tasks[sprintId] || [];
    return sprintTasks.length > 0 && sprintTasks.every(task => task.done);
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

  const toggleSubTaskDone = async (event, subTaskId, taskId) => {
    const checked = event.target.checked;
    
    try {
      const response = await fetch(`http://localhost:8081/todolist/subtask/${subTaskId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ done: checked })
      });
      
      if (response.ok) {
        const updatedSubtask = await response.json();
        
        // Update local state
        setSubtasks(prevSubtasks => {
          const updated = {
            ...prevSubtasks,
            [taskId]: prevSubtasks[taskId].map(subTask => 
              subTask.id === subTaskId ? updatedSubtask : subTask
            )
          };
          return updated;
        });
        
        // Recalculate progress for the parent task
        const parentTaskResponse = await fetch(`http://localhost:8081/todolist/${taskId}`);
        if (parentTaskResponse.ok) {
          const parentTask = await parentTaskResponse.json();
          
          // Update parent task in state
          setTasks(prevTasks => {
            const updated = {...prevTasks};
            for (const sprintId in updated) {
              updated[sprintId] = updated[sprintId].map(task => 
                task.id === taskId ? parentTask : task
              );
            }
            return updated;
          });
        }
      }
    } catch (err) {
      console.error('Error toggling subtask status:', err);
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
        setSubtasks(prev => ({
          ...prev,
          [taskId]: [...(prev[taskId] || []), newSubTask]
        }));
        
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

  const deleteSubTask = async (taskId, subTaskId) => {
    try {
      const response = await fetch(`http://localhost:8081/todolist/subtask/${subTaskId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setSubtasks(prev => ({
          ...prev,
          [taskId]: prev[taskId].filter(subTask => subTask.id !== subTaskId)
        }));
      }
    } catch (err) {
      console.error('Error deleting subtask:', err);
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
        Current Sprints :D
      </Typography>
      
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
                        label={sprint.status} 
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
                                  return (
                                    <TableRow key={userId}>
                                      <TableCell>{`User ${userId}`}</TableCell>
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