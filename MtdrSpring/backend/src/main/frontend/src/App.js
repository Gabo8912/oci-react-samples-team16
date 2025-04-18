/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2022 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
import React, { useState, useEffect } from "react";
import NewItem from "./NewItem";
import API_LIST from "./API";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, TableBody, CircularProgress, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import Moment from "react-moment";
import NewSprint from "./NewSprint";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CompletedTasksHistory from "./CompletedTasksHistory";
import { useAuth } from "./context/AuthContext"; //Dumb comment

// Configuration constants
const COMPLETED_TASKS_TO_SHOW = 5;
const LONG_TASK_DURATION = 4; // hours
const COMPLETED_TASKS_PANEL_WIDTH = '350px';
const COMPLETED_TASKS_PANEL_POSITION = { top: '100px', right: '20px' };

// Styled components
const CompletedTasksContainer = styled(Paper)(({ theme }) => ({
  background: '#f8f8f8',
  padding: '1.5rem',
  marginTop: '0',
  width: COMPLETED_TASKS_PANEL_WIDTH,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '0.5rem',
  height: 'fit-content',
  position: 'fixed',
  top: COMPLETED_TASKS_PANEL_POSITION.top,
  right: COMPLETED_TASKS_PANEL_POSITION.right,
  zIndex: 10,
  borderLeft: '3px solid #5f7d4f',
}));

const CompletedTasksHeader = styled('h2')({
  fontSize: '1.2rem',
  color: '#5f7d4f',
  marginBottom: '1.5rem',
  textAlign: 'center',
  fontWeight: 'bold',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid #ddd',
});

const CompletedTaskRow = styled('tr')({
  '& td': {
    padding: '0.3rem 0.5rem',
    fontSize: '0.9rem',
  },
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

function App() {
  const { currentUser } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [isInserting, setInserting] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState();
  const [subTasks, setSubTasks] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const [showSubTaskForm, setShowSubTaskForm] = useState({});
  const [isCreatingSprint, setIsCreatingSprint] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const addSprint = (sprintData) => {
    setIsCreatingSprint(true);
    fetch(`${API_LIST}/sprints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sprintData)
    })
    .then(response => response.json())
    .then(data => {
      setIsCreatingSprint(false);
    })
    .catch(error => {
      console.error('Error creating sprint:', error);
      setIsCreatingSprint(false);
    });
  };

  function deleteItem(deleteId) {
    fetch(`${API_LIST}/${deleteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return response;
        }
        throw new Error("Something went wrong ...");
      })
      .then(
        () => {
          const remainingItems = items.filter((item) => item.id !== deleteId);
          setItems(remainingItems);
        },
        (error) => {
          setError(error);
        }
      );
  }

  function toggleDone(event, id, description, done) {
    event.preventDefault();
    
    if (
      !done ||
      !subTasks[id] ||
      subTasks[id].length === 0 ||
      subTasks[id].every((subTask) => subTask.done)
    ) {
      modifyItem(id, description, done).then(
        () => {
          reloadOneIteam(id);
        },
        (error) => {
          setError(error);
        }
      );
    } else {
      window.alert(
        "Error: All subtasks must be completed before marking the main task as done."
      );
    }
  }

  function reloadOneIteam(id) {
    fetch(`${API_LIST}/${id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong ...");
      })
      .then(
        (result) => {
          const items2 = items.map((x) =>
            x.id === id
              ? { ...x, description: result.description, done: result.done }
              : x
          );
          setItems(items2);
        },
        (error) => {
          setError(error);
        }
      );
  }

  function modifyItem(id, description, done) {
    const data = { description: description, done: done };
    return fetch(`${API_LIST}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        return response;
      }
      throw new Error("Something went wrong ...");
    });
  }

  function loadSubTasks(taskId) {
    fetch(`${API_LIST}/subtask/${taskId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong (loadSubTasks)...");
      })
      .then(
        (result) => {
          setSubTasks((prevSubtasks) => ({
            ...prevSubtasks,
            [taskId]: result,
          }));
        },
        (error) => {
          setError(error);
        }
      );
  }

  function toggleSubtasksVisibility(taskId) {
    setExpandedTasks((prevExpandedTasks) => ({
      ...prevExpandedTasks,
      [taskId]: !prevExpandedTasks[taskId],
    }));
  }

  function toggleSubTaskFormVisibility(taskId) {
    setShowSubTaskForm((prevShowSubTaskForm) => ({
      ...prevShowSubTaskForm,
      [taskId]: !prevShowSubTaskForm[taskId],
    }));
  }

  function addSubTask(taskId, text) {
    if (!text.trim()) {
      window.alert("Error: Subtasks cannot be empty");
      return;
    }
    fetch(`${API_LIST}/subtask/${taskId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: text, done: false }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong ...");
      })
      .then(
        (result) => {
          setSubTasks((prevSubTasks) => ({
            ...prevSubTasks,
            [taskId]: [...(prevSubTasks[taskId] || []), result],
          }));
          setNewSubTaskText("");
          setShowSubTaskForm((prevShowSubTaskForm) => ({
            ...prevShowSubTaskForm,
            [taskId]: false,
          }));
        },
        (error) => {
          setError(error);
        }
      );
  }

  function deleteSubTask(taskId, subTaskId) {
    fetch(`${API_LIST}/subtask/${subTaskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return response;
        }
        throw new Error("Something went wrong ...");
      })
      .then(
        () => {
          setSubTasks((prevSubTasks) => ({
            ...prevSubTasks,
            [taskId]: prevSubTasks[taskId].filter(
              (subTask) => subTask.id !== subTaskId
            ),
          }));
        },
        (error) => {
          setError(error);
        }
      );
  }

  function calculateProgress(subTasks) {
    if (!subTasks || subTasks.length === 0) return 0;
    const completed = subTasks.filter((subTask) => subTask.done).length;
    return (completed / subTasks.length) * 100;
  }

  function toggleSubTaskDone(event, subTaskId) {
    const checked = event.target.checked;
    fetch(`${API_LIST}/subtask/${subTaskId}/toggle`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ done: checked }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong ...");
      })
      .then(
        (result) => {
          const taskId = result.parentTask.id;
          setSubTasks((prevSubTasks) => ({
            ...prevSubTasks,
            [taskId]: prevSubTasks[taskId].map((subTask) =>
              subTask.id === subTaskId ? result : subTask
            ),
          }));
        },
        (error) => {
          setError(error);
        }
      );
  }

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  useEffect(() => {
    setLoading(true);
    fetch(API_LIST)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong ... (USE EFFECT 1)");
      })
      .then(
        (result) => {
          setLoading(false);
          setItems(result);
          result.forEach((item) => {
            loadSubTasks(item.id);
          });
        },
        (error) => {
          setLoading(false);
          setError(error);
        }
      );
  }, []);

  function addItem(text, hours, subTasksArray, sprintId) { //Dumb commit
    setInserting(true);
    console.log("---");
    const data = {
      description: text,
      duration: hours,
      sprintId: sprintId,
      userId: currentUser?.id
    };
    
    fetch(API_LIST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response;
        }
        throw new Error("Something went wrong ...");
      })
      .then((result) => {
        const id = result.headers.get("location");
        const newItem = {
          id: id,
          description: text,
          duration: hours,
          done: false,
        };
        setItems([newItem, ...items]);
        
        if (hours > LONG_TASK_DURATION && subTasksArray?.length > 0) {
          subTasksArray.forEach((subTaskText) => {
            fetch(`${API_LIST}/subtask/${id}/add`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ description: subTaskText, done: false }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Error adding subtask");
                }
                return response.json();
              })
              .then((resultSub) => {
                setSubTasks((prevSubTasks) => ({
                  ...prevSubTasks,
                  [id]: [...(prevSubTasks[id] || []), resultSub],
                }));
              })
              .catch((error) => setError(error));
          });
        }
        setInserting(false);
      })
      .catch((error) => {
        setInserting(false);
        setError(error);
      });
  }

  return (
    <div className="App">
      {showHistory ? (
        <CompletedTasksHistory onBack={toggleHistory} />
      ) : (
        <>
          <h1>MY TODO LIST</h1>
          <NewItem addItem={addItem} isInserting={isInserting} />
          {error && <p>Error: {error.message}</p>}
          {isLoading && <CircularProgress />}
          {!isLoading && (
            <>
              <div id="maincontent" style={{ 
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
              }}>
                <table id="itemlistNotDone" className="itemlist">
                  <TableBody>
                    {items.map(
                      (item) =>
                        !item.done && (
                          <React.Fragment key={item.id}>
                            <tr>
                              <td className="description">
                                {item.description}
                                <Button
                                  onClick={() => toggleSubtasksVisibility(item.id)}
                                >
                                  {expandedTasks[item.id] ? "▼" : "►"}
                                </Button>
                                <div className="progress">
                                  <div
                                    className="progress-bar"
                                    style={{
                                      width: `${calculateProgress(
                                        subTasks[item.id]
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                              </td>
                              <td className="date">
                                <Moment format="MMM Do hh:mm:ss">
                                  {item.createdAt}
                                </Moment>
                              </td>
                              <td>
                                <Button
                                  variant="contained"
                                  className="DoneButton"
                                  onClick={(event) =>
                                    toggleDone(
                                      event,
                                      item.id,
                                      item.description,
                                      !item.done
                                    )
                                  }
                                  size="small"
                                >
                                  Done
                                </Button>
                              </td>
                            </tr>
                            
                            {expandedTasks[item.id] &&
                              subTasks[item.id] &&
                              subTasks[item.id].map((subTask) => (
                                <tr key={subTask.id}>
                                  <td className="subtask-description">
                                    <input
                                      type="checkbox"
                                      checked={subTask.done}
                                      onChange={(event) =>
                                        toggleSubTaskDone(event, subTask.id)
                                      }
                                    />
                                    {subTask.description}
                                  </td>
                                  <td>
                                    <Button
                                      startIcon={<DeleteIcon />}
                                      variant="contained"
                                      className="DeleteButton"
                                      onClick={() =>
                                        deleteSubTask(item.id, subTask.id)
                                      }
                                      size="small"
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                  <td className="date">
                                    <Moment format="MMM Do hh:mm:ss">
                                      {subTask.creation_ts}
                                    </Moment>
                                  </td>
                                </tr>
                              ))}
                            
                            {expandedTasks[item.id] && (
                              <tr>
                                <td colSpan="3">
                                  <Button
                                    onClick={() =>
                                      toggleSubTaskFormVisibility(item.id)
                                    }
                                  >
                                    {showSubTaskForm[item.id]
                                      ? "Hide Subtask Form"
                                      : "Add Subtask"}
                                  </Button>
                                  {showSubTaskForm[item.id] && (
                                    <div>
                                      <input
                                        type="text"
                                        value={newSubTaskText}
                                        onChange={(e) =>
                                          setNewSubTaskText(e.target.value)
                                        }
                                        placeholder="Description"
                                      />
                                      <Button
                                        onClick={() =>
                                          addSubTask(item.id, newSubTaskText)
                                        }
                                      >
                                        Add subtask
                                      </Button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                    )}
                  </TableBody>
                </table>
                <NewSprint addSprint={addSprint} isCreating={isCreatingSprint} />
              </div>
              
              <CompletedTasksContainer>
                <CompletedTasksHeader>
                  Latest Completed Tasks
                  <Button
                    variant="contained"
                    startIcon={<ExpandMoreIcon />}
                    onClick={toggleHistory}
                    size="small"
                    style={{ 
                      backgroundColor: '#5f7d4f', 
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.8rem'
                    }}
                  >
                    View Full History
                  </Button>
                </CompletedTasksHeader>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                  Showing {Math.min(COMPLETED_TASKS_TO_SHOW, items.filter(item => item.done).length)} of {items.filter(item => item.done).length} completed tasks
                </div>
                <table className="itemlist" style={{ width: '100%', marginTop: '0' }}>
                  <TableBody>
                    {items
                      .filter(item => item.done)
                      .slice(0, COMPLETED_TASKS_TO_SHOW)
                      .map((item) => (
                        <CompletedTaskRow key={item.id}>
                          <td className="description" style={{ width: '60%' }}>{item.description}</td>
                          <td className="date" style={{ width: '25%' }}>
                            <Moment format="MMM Do hh:mm:ss">{item.createdAt}</Moment>
                          </td>
                          <td style={{ width: '15%', textAlign: 'right' }}>
                            <Button
                              variant="contained"
                              className="DoneButton"
                              onClick={(event) =>
                                toggleDone(event, item.id, item.description, !item.done)
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
                              onClick={() => deleteItem(item.id)}
                              size="small"
                            >
                              Delete
                            </Button>
                          </td>
                        </CompletedTaskRow>
                      ))}
                  </TableBody>
                </table>
              </CompletedTasksContainer>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;