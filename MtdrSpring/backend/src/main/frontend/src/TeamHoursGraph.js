import React, { useEffect, useRef } from 'react';
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
  const chartRef = useRef(null);

  const data = {
    labels: teamTasks.map(task => task.description),
    datasets: [
      {
        label: 'Horas Estimadas',
        data: teamTasks.map(task => task.estimatedHours),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      },
      {
        label: 'Horas Reales',
        data: teamTasks.map(task => task.realHours),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Comparación de Horas Estimadas vs Reales por Tarea'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Horas'
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '20px auto' }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default TeamHoursGraph; 