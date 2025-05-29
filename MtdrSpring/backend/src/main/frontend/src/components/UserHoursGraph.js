import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserHoursGraph = ({ userTasks, allUsers, teamTasks }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    // Determine which data format we're using and filter out managers
    if (teamTasks) {
      // New format - extract users from teamTasks
      const userMap = {};
      teamTasks.forEach(task => {
        if (!userMap[task.userId]) {
          userMap[task.userId] = {
            id: task.userId,
            username: allUsers?.find(u => u.id === task.userId)?.username || `User ${task.userId}`
          };
        }
      });
      setAvailableUsers(Object.values(userMap));
    } else if (allUsers) {
      // Old format - filter out managers
      setAvailableUsers(allUsers.filter(user => {
        const userData = allUsers.find(u => u.id === user.id);
        return !userData || userData.role !== "Manager";
      }));
    }
  }, [allUsers, teamTasks]);

  useEffect(() => {
    if (availableUsers.length > 0 && selectedUserId === null) {
      const defaultUserId = availableUsers[0].id;
      setSelectedUserId(defaultUserId);
      updateSelectedTasks(defaultUserId);
    }
  }, [availableUsers]);

  const updateSelectedTasks = (userId) => {
    if (teamTasks) {
      // New format - filter teamTasks for selected user
      setSelectedUserTasks(
        teamTasks
          .filter(task => task.userId === userId)
          .map(task => ({
            task: {
              id: task.id, // <-- Add this line
              description: task.description,
              estimatedHours: task.estimatedHours,
              realHours: task.realHours
            }
          }))
      );
    } else if (userTasks) {
      // Old format - use userTasks directly
      setSelectedUserTasks(userTasks[userId] || []);
    }
  };

  const handleChange = (e) => {
    const newUserId = parseInt(e.target.value, 10);
    setSelectedUserId(newUserId);
    updateSelectedTasks(newUserId);
  };

  if (!availableUsers || availableUsers.length === 0) {
    return <div className="graph-container">No users available</div>;
  }

  const taskData = selectedUserTasks
    .filter(assignment => assignment.task)
    .map(assignment => ({
      id: assignment.task.id ?? 'N/A',
      username: allUsers?.find(u => u.id === selectedUserId)?.username || `User ${selectedUserId}`,
      description: assignment.task.description || 'Unknown Task',
      estimatedHours: assignment.task.estimatedHours || 0,
      realHours: assignment.task.realHours || 0
    }));

  if (taskData.length === 0) {
    return (
      <div className="graph-container">
        <label>Select User: </label>
        <select value={selectedUserId || ''} onChange={handleChange}>
          {availableUsers.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
        <p>No tasks available for this user</p>
      </div>
    );
  }

  const data = {
    labels: taskData.map(task => `${task.id}`), // Only show task ID
    datasets: [
      {
        label: 'Estimated Hours',
        data: taskData.map(task => task.estimatedHours),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      },
      {
        label: 'Real Hours',
        data: taskData.map(task => task.realHours),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: `Task Hours Comparison for ${availableUsers.find(u => u.id === selectedUserId)?.username || 'User'}`,
        font: {
          size: 16,
          family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
          font: {
            size: 14,
            weight: 'bold',
            style: 'italic'
          }
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Tasks',
          font: {
            size: 14,
            weight: 'bold',
            style: 'italic'
          }
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="graph-container" style={{ height: '400px', width: '100%' }}>
      <label style={{ marginBottom: '1rem', display: 'block' }}>Select User:</label>
      <select value={selectedUserId || ''} onChange={handleChange} style={{ marginBottom: '1rem' }}>
        {availableUsers.map(user => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </select>
      <Line data={data} options={options} />
    </div>
  );
};

export default UserHoursGraph;