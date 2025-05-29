import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Chip, Paper, Collapse, IconButton, Box, TextField,
  Button, Checkbox, FormControl, InputLabel, Select, MenuItem
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
    fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, sans-serif'
  },
  '& .MuiTableCell-head': {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5'
  }
});

const StatusChip = styled(Chip)(({ status }) => ({
  fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, sans-serif',
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

const CurrentSprints = ({ sprints, tasks, subtasks, users, loading, error }) => {
  const [expandedSprints, setExpandedSprints] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [showSubTaskForm, setShowSubTaskForm] = useState({});
  const [selectedGraphType, setSelectedGraphType] = useState("totalHours");
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const [selectedTaskAssignments, setSelectedTaskAssignments] = useState(null);
  const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);

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
        const user = users.find(u => u.id === task.userId);
        if (user && user.role === "Manager") return;
        if (!developerHours[task.userId]) {
          developerHours[task.userId] = 0;
        }
        developerHours[task.userId] += task.realHours;
      }
    });

    return developerHours;
  };

  const getGraphData = () => {
    const nonManagerUsers = users.filter(user => user.role !== "Manager");
    const colors = ["#36a2eb", "#4bc0c0", "#9966ff", "#ff9f40", "#ff6384", "#008080"];

    switch (selectedGraphType) {
      case 'totalHours':
        return {
          labels: sprints.map(s => s.sprintName),
          datasets: [{
            label: 'Total Hours',
            data: sprints.map(s => calculateSprintHours(s.sprintId).real),
            backgroundColor: colors[0]
          }]
        };
      case 'developerHours':
        return {
          labels: sprints.map(s => s.sprintName),
          datasets: nonManagerUsers.map((user, i) => ({
            label: user.username,
            data: sprints.map(s => {
              const t = tasks[s.sprintId] || [];
              return t.filter(tk => tk.userId === user.id).reduce((a, b) => a + (b.realHours || 0), 0);
            }),
            backgroundColor: colors[i % colors.length]
          }))
        };
      case 'developerTasks':
        return {
          labels: sprints.map(s => s.sprintName),
          datasets: nonManagerUsers.map((user, i) => ({
            label: `${user.username} - Completed`,
            data: sprints.map(s => {
              const t = tasks[s.sprintId] || [];
              return t.filter(tk => tk.userId === user.id && tk.done).length;
            }),
            backgroundColor: colors[i % colors.length]
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
      legend: { position: 'top' },
      title: {
        display: true,
        text: selectedGraphType,
        font: { size: 16, weight: 'bold' }
      }
    },
    scales: { y: { beginAtZero: true } }
  };

  if (loading) return <div>Loading sprint data...</div>;
  if (error) return <div>Error loading sprint data: {error}</div>;
  if (!sprints.length) return <div>No sprints found</div>;

  return (
    <OraclePaper>
      <Typography variant="h4" style={{ marginBottom: '1rem' }}>Sprint KPIs</Typography>
      <FormControl fullWidth style={{ marginBottom: '1rem' }}>
        <InputLabel>Graph Type</InputLabel>
        <Select value={selectedGraphType} onChange={(e) => setSelectedGraphType(e.target.value)}>
          <MenuItem value="totalHours">Total Hours per Sprint</MenuItem>
          <MenuItem value="developerHours">Hours per Developer per Sprint</MenuItem>
          <MenuItem value="developerTasks">Completed Tasks per Developer per Sprint</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ height: '400px', marginBottom: 4 }}>
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
};

export default CurrentSprints;
