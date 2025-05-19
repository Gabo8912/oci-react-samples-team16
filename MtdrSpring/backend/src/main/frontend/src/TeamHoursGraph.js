import React, { useRef } from 'react';
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

// Constants
const CHART_COLORS = {
  estimated: {
    border: 'rgb(75, 192, 192)',
    background: 'rgba(75, 192, 192, 0.5)'
  },
  actual: {
    border: 'rgb(255, 99, 132)',
    background: 'rgba(255, 99, 132, 0.5)'
  }
};

const CHART_OPTIONS = {
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

// Register ChartJS components
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

  const getChartData = () => {
    const taskDescriptions = teamTasks.map(task => task.description);
    const estimatedHours = teamTasks.map(task => task.estimatedHours);
    const actualHours = teamTasks.map(task => task.realHours);

    return {
      labels: taskDescriptions,
      datasets: [
        {
          label: 'Horas Estimadas',
          data: estimatedHours,
          borderColor: CHART_COLORS.estimated.border,
          backgroundColor: CHART_COLORS.estimated.background,
          tension: 0.1
        },
        {
          label: 'Horas Reales',
          data: actualHours,
          borderColor: CHART_COLORS.actual.border,
          backgroundColor: CHART_COLORS.actual.background,
          tension: 0.1
        }
      ]
    };
  };

  return (
    <div className="chart-container">
      <Line 
        ref={chartRef} 
        data={getChartData()} 
        options={CHART_OPTIONS} 
      />
    </div>
  );
};

export default TeamHoursGraph;