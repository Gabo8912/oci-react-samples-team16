import React from 'react';
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

const UserHoursGraph = ({ userTasks }) => {
  // Ensure userTasks is an array and has data
  if (!userTasks || !Array.isArray(userTasks) || userTasks.length === 0) {
    return <div className="graph-container">No tasks available to display</div>;
  }

  // Filter and prepare data for the logged-in user's tasks
  const taskData = userTasks
    .filter(assignment => assignment.task) // Ensure task exists
    .map(assignment => ({
      description: assignment.task.description || 'Unknown Task',
      estimatedHours: assignment.task.estimatedHours || 0,
      realHours: assignment.task.realHours || 0
    }));

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
    maintainAspectRatio: false, // This prevents the shrinking issue
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
        text: 'Your Task Hours Comparison',
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
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            weight: 'bold',
            style: 'italic'
          }
        },
        ticks: {
          font: {
            size: 12,
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif"
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Tasks',
          font: {
            size: 14,
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            weight: 'bold',
            style: 'italic'
          }
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12,
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif"
          }
        }
      }
    }
  };

  return (
    <div className="graph-container" style={{ height: '400px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default UserHoursGraph; 