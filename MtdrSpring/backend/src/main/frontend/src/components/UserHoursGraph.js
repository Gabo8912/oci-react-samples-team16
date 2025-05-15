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

const UserHoursGraph = ({ userTasks, allUsers }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);

  useEffect(() => {
    if (allUsers?.length > 0 && selectedUserId === null) {
      const defaultUserId = allUsers[0].id;
      setSelectedUserId(defaultUserId);
      setSelectedUserTasks(userTasks[defaultUserId] || []);
    }
  }, [allUsers, userTasks]);

  const handleChange = (e) => {
    const newUserId = parseInt(e.target.value, 10);
    setSelectedUserId(newUserId);
    setSelectedUserTasks(userTasks[newUserId] || []);
  };

  if (!allUsers || allUsers.length === 0) {
    return <div className="graph-container">No users available</div>;
  }

  const taskData = selectedUserTasks
    .filter(assignment => assignment.task)
    .map(assignment => ({
      description: assignment.task.description || 'Unknown Task',
      estimatedHours: assignment.task.estimatedHours || 0,
      realHours: assignment.task.realHours || 0
    }));

  if (taskData.length === 0) {
    return (
      <div className="graph-container">
        <label>Select User: </label>
        <select value={selectedUserId || ''} onChange={handleChange}>
          {allUsers.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
        <p>No tasks available for this user</p>
      </div>
    );
  }

  const data = {
    labels: taskData.map(task => task.description),
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
        text: `Task Hours Comparison for ${allUsers.find(u => u.id === selectedUserId)?.username || 'User'}`,
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
        {allUsers.map(user => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </select>
      <Line data={data} options={options} />
    </div>
  );
};

export default UserHoursGraph;
