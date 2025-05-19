import React, { useState, useEffect } from "react";
import { Button, TableBody, CircularProgress, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Moment from "react-moment";
import API_LIST from "./API";

// Styled components for the history page
const HistoryContainer = styled(Paper)(({ theme }) => ({
  background: '#f8f8f8',
  padding: '2rem',
  margin: '2rem auto',
  maxWidth: '1000px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '0.5rem',
  borderLeft: '3px solid #5f7d4f',
}));

const HistoryHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #ddd',
});

const HistoryTitle = styled('h1')({
  color: '#5f7d4f',
  margin: 0,
});

const BackButton = styled(Button)({
  marginRight: '1rem',
});

const HistoryTable = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
});

const HistoryRow = styled('tr')({
  '& td': {
    padding: '0.8rem',
    borderBottom: '1px solid #ddd',
  },
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

function CompletedTasksHistory({ onBack }) {
  const [isLoading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  function fetchCompletedTasks() {
    setLoading(true);
    fetch(API_LIST)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch task list");
        return res.json();
      })
      .then((result) => {
        const completedItems = result.filter(item => item.done);
        setItems(completedItems);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  function deleteTask(taskId) {
    fetch(`${API_LIST}/${taskId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete task");
        return res;
      })
      .then(() => {
        setItems(prev => prev.filter(item => item.id !== taskId));
      })
      .catch((err) => setError(err));
  }

  function revertCompletionStatus(event, id, description, newDoneState) {
    event.preventDefault();
    fetch(`${API_LIST}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, done: newDoneState }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update task status");
        return res;
      })
      .then(() => {
        if (!newDoneState) {
          setItems(prev => prev.filter(item => item.id !== id));
        }
      })
      .catch((err) => setError(err));
  }

  return (
    <HistoryContainer>
      <HistoryHeader>
        <BackButton
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
        >
          Back to Todo List
        </BackButton>
        <HistoryTitle>Completed Tasks History</HistoryTitle>
        <div style={{ width: '100px' }} aria-hidden="true" />
      </HistoryHeader>

      {error && <p>Error: {error.message}</p>}
      {isLoading && <CircularProgress />}

      {!isLoading && items.length === 0 && (
        <p>No completed tasks found.</p>
      )}

      {!isLoading && items.length > 0 && (
        <HistoryTable>
          <TableBody>
            {items.map((item) => (
              <HistoryRow key={item.id}>
                <td style={{ width: '60%' }}>
                  <span style={{ textDecoration: 'line-through', color: '#666' }}>
                    {item.description}
                  </span>
                </td>
                <td style={{ width: '25%' }}>
                  <Moment format="MMM Do hh:mm:ss">{item.createdAt}</Moment>
                </td>
                <td style={{ width: '15%', textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    className="DoneButton"
                    onClick={(e) =>
                      revertCompletionStatus(e, item.id, item.description, false)
                    }
                    size="small"
                    style={{ marginRight: '0.5rem' }}
                  >
                    Undo
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    variant="contained"
                    className="DeleteButton"
                    onClick={() => deleteTask(item.id)}
                    size="small"
                  >
                    Delete
                  </Button>
                </td>
              </HistoryRow>
            ))}
          </TableBody>
        </HistoryTable>
      )}
    </HistoryContainer>
  );
}


export default CompletedTasksHistory; 