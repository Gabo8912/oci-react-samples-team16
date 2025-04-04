/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2022 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
/*
 * This is the application main React component. We're using "function"
 * components in this application. No "class" components should be used for
 * consistency.
 * @author  jean.de.lavarene@oracle.com
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

// Styled components for completed tasks section
const CompletedTasksContainer = styled(Paper)(({ theme }) => ({
  background: '#f8f8f8',
  padding: '1.5rem',
  marginTop: '0',
  width: '350px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '0.5rem',
  height: 'fit-content',
  position: 'fixed',
  top: '100px',
  right: '20px',
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
  // isLoading is true while waiting for the backend to return the list of items.
  const [isLoading, setLoading] = useState(false);
  // isInserting is true while waiting for the backend to insert a new item.
  const [isInserting, setInserting] = useState(false);
  // List of todo items (both done and not done).
  const [items, setItems] = useState([]);
  // In case of an error during the API call.
  const [error, setError] = useState();
  // Object to hold subtasks per task id.
  const [subTasks, setSubTasks] = useState({});
  // To control the visibility of subtasks for each task.
  const [expandedTasks, setExpandedTasks] = useState({});
  // For the subtask form in tasks already created.
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const [showSubTaskForm, setShowSubTaskForm] = useState({});

  //////////////////////////
  const [isCreatingSprint, setIsCreatingSprint] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const addSprint = (sprintData) => {
    setIsCreatingSprint(true);
    fetch('/sprints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sprintData)
    })
    .then(response => response.json())
    .then(data => {
      // Handle successful sprint creation
      setIsCreatingSprint(false);
    })
    .catch(error => {
      console.error('Error creating sprint:', error);
      setIsCreatingSprint(false);
    });
  };
  ////////////
  function deleteItem(deleteId) {
    fetch(API_LIST + "/" + deleteId, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return response;
        } else {
          throw new Error("Something went wrong ...");
        }
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
    
    // Debug log to check subtasks state
    console.log(`Toggling task ${id} to ${done ? 'done' : 'not done'}`);
    console.log(`Subtasks for this task:`, subTasks[id]);
    
    // Allow marking as done if:
    // 1. We're marking as not done (undoing)
    // 2. There are no subtasks for this task
    // 3. All subtasks are completed
    if (
      !done || // Undoing a task
      !subTasks[id] || // No subtasks object for this task
      subTasks[id].length === 0 || // Empty subtasks array
      subTasks[id].every((subTask) => subTask.done) // All subtasks are done
    ) {
      console.log(`Task ${id} can be marked as ${done ? 'done' : 'not done'}`);
      modifyItem(id, description, done).then(
        () => {
          reloadOneIteam(id);
        },
        (error) => {
          setError(error);
        }
      );
    } else {
      console.log(`Task ${id} cannot be marked as done because not all subtasks are completed`);
      window.alert(
        "Error: All subtasks must be completed before marking the main task as done."
      );
    }
  }

  function reloadOneIteam(id) {
    fetch(API_LIST + "/" + id)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
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
    var data = { description: description, done: done };
    return fetch(API_LIST + "/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        return response;
      } else {
        throw new Error("Something went wrong ...");
      }
    });
  }

  // Function to load subtasks for a specific task.
  function loadSubTasks(taskId) {
    fetch(`/subtask/${taskId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong (loadSubTasks)...");
        }
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

  // Toggle the visibility of subtasks.
  function toggleSubtasksVisibility(taskId) {
    setExpandedTasks((prevExpandedTasks) => ({
      ...prevExpandedTasks,
      [taskId]: !prevExpandedTasks[taskId],
    }));
  }

  // Toggle the visibility of the subtask form for a task.
  function toggleSubTaskFormVisibility(taskId) {
    setShowSubTaskForm((prevShowSubTaskForm) => ({
      ...prevShowSubTaskForm,
      [taskId]: !prevShowSubTaskForm[taskId],
    }));
  }

  // Function to add subtasks for a given task (used in the detailed task view).
  function addSubTask(taskId, text) {
    if (!text.trim()) {
      window.alert("Error: Subtasks cannot be empty");
      return;
    }
    fetch(`/subtask/${taskId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: text, done: false }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
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

  // Function to delete a subtask.
  function deleteSubTask(taskId, subTaskId) {
    fetch(`/subtask/${subTaskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return response;
        } else {
          throw new Error("Something went wrong ...");
        }
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

  useEffect(() => {
    setLoading(true);
    fetch(API_LIST)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ... (USE EFFECT 1)");
        }
      })
      .then(
        (result) => {
          setLoading(false);
          setItems(result);
          // Load subtasks for all tasks, not just the ones that are not done
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

  // MODIFIED addItem: now receives description, duration and subtasks array.
  function addItem(text, hours, subTasksArray, sprintId) {
    
    console.log(
      "addItem(" +
        text +
        ", " +
        hours +
        ", " +
        JSON.stringify(subTasksArray) +
        ")"
    );
    setInserting(true);
    const data = {
      description: text,
      duration: hours,
      sprintId: sprintId,
      userId: 3 // Optional - only if backend expects it
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
        } else {
          throw new Error("Something went wrong ...");
        }
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
        // If duration > 4 and subtasks were provided, add each subtask.
        if (hours > 4 && subTasksArray && subTasksArray.length > 0) {
          subTasksArray.forEach((subTaskText) => {
            fetch(`/subtask/${id}/add`, {
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

  function toggleSubTaskDone(event, subTaskId) {
    const checked = event.target.checked;
    fetch(`/subtask/${subTaskId}/toggle`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ done: checked }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
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

  // Function to handle showing/hiding the history page
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

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
                  Showing 5 of {items.filter(item => item.done).length} completed tasks
                </div>
                <table className="itemlist" style={{ width: '100%', marginTop: '0' }}>
                  <TableBody>
                    {items
                      .filter(item => item.done)
                      .slice(0, 5) // Show only the 5 most recent completed tasks
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
