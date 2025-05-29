import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TeamHoursGraph = ({ teamTasks, allUsers }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [chartType, setChartType] = useState('line'); // 'line' or 'bar'

  // Group tasks by team (assuming team structure exists in your data)
  const teams = {
    'Team 1': [3, 6],  // Andres and Dilan
    'Team 2': [8, 7]   // Carlos and Michael
  };

  // Filter out managers and group by team
  const teamData = {};
  Object.entries(teams).forEach(([teamName, memberIds]) => {
    teamData[teamName] = teamTasks
      .filter(task => memberIds.includes(task.userId))
      .map(task => ({
        ...task,
        username: allUsers.find(u => u.id === task.userId)?.username || `User ${task.userId}`
      }));
  });

  // Get team options for dropdown
  const teamOptions = Object.keys(teamData).filter(team => teamData[team].length > 0);

  // Set default selected team
  React.useEffect(() => {
    if (!selectedTeam && teamOptions.length > 0) {
      setSelectedTeam(teamOptions[0]);
    }
  }, [selectedTeam, teamOptions]);

  // Prepare chart data for selected team
  const selectedTeamTasks = selectedTeam ? teamData[selectedTeam] : [];
  
  const lineData = {
    //    labels: selectedTeamTasks.map(task => `${task.id} (${task.username})`),
    labels: selectedTeamTasks.map(task => `${task.id}: ${task.username}`),
    datasets: [
      {
        label: 'Estimated Hours',
        data: selectedTeamTasks.map(task => task.estimatedHours),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Real Hours',
        data: selectedTeamTasks.map(task => task.realHours),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  // Additional KPI: Team Efficiency (Bar Chart)
  const efficiencyData = {
    labels: teamOptions,
    datasets: [
      {
        label: 'Efficiency Ratio (Real/Estimated)',
        data: teamOptions.map(team => {
          const tasks = teamData[team];
          const totalEstimated = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
          const totalReal = tasks.reduce((sum, task) => sum + task.realHours, 0);
          return totalEstimated > 0 ? (totalReal / totalEstimated) : 0;
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
        text: selectedTeam ? `${selectedTeam} Hours Comparison` : 'Team Hours Comparison',
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
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="team-graph-container">
      <div className="controls" style={{ marginBottom: '20px' }}>
        <select 
          value={selectedTeam || ''} 
          onChange={(e) => setSelectedTeam(e.target.value)}
          style={{ marginRight: '15px', padding: '8px' }}
        >
          {teamOptions.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
        
        <select 
          value={chartType} 
          onChange={(e) => setChartType(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="line">Hours Comparison</option>
          <option value="bar">Efficiency View</option>
        </select>
      </div>

      <div style={{ height: '400px', width: '100%' }}>
        {chartType === 'line' ? (
          <Line data={lineData} options={options} />
        ) : (
          <Bar 
            data={efficiencyData} 
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                title: {
                  ...options.plugins.title,
                  text: 'Team Efficiency Comparison'
                }
              },
              scales: {
                y: {
                  ...options.scales.y,
                  title: {
                    ...options.scales.y.title,
                    text: 'Efficiency Ratio'
                  }
                }
              }
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default TeamHoursGraph;