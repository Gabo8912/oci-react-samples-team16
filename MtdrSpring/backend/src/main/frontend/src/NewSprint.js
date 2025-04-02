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
  Paper
} from "@mui/material";
import { styled } from '@mui/material/styles';

// Custom styled components to match Oracle Redwood theme
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

function CurrentSprints() {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await fetch('http://localhost:8081/sprints');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSprints(data);
      } catch (err) {
        console.error('Error fetching sprints:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSprints();
  }, []);

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
          Error loading sprints
        </Typography>
        <Typography variant="body1" style={{ color: '#161513', marginBottom: '1rem' }}>
          {error}
        </Typography>
        <Typography variant="body2" style={{ color: '#5b5652' }}>
          Make sure:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Your backend is running at http://localhost:8081</li>
            <li>CORS is properly configured on your backend</li>
            <li>The endpoint /sprints is accessible</li>
          </ul>
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
              <TableCell>Sprint ID</TableCell>
              <TableCell>Project ID</TableCell>
              <TableCell>Sprint Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sprints.map((sprint) => (
              <TableRow 
                key={sprint.sprintId}
                hover
                style={{ 
                  backgroundColor: sprint.status === "Pendiente" ? '#fef9f2' : 'inherit',
                  opacity: sprint.status === "Completado" ? 0.8 : 1
                }}
              >
                <TableCell>{sprint.sprintId}</TableCell>
                <TableCell>{sprint.projectId}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </OracleTable>
      </TableContainer>
    </OraclePaper>
  );
}

export default CurrentSprints;