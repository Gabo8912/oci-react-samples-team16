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

const TeamHoursGraph = ({ teamTasks }) => {
  const labels = teamTasks.map(task => task.description);
  const estimatedHours = teamTasks.map(task => task.estimatedHours);
  const realHours = teamTasks.map(task => task.realHours);

  const data = {
    labels,
    datasets: [
      {
        label: 'Estimated Hours',
        data: estimatedHours,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Real Hours',
        data: realHours,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
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
        text: 'Team Hours Comparison',
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

export default TeamHoursGraph; 