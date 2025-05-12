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
import { Button, TableBody, CircularProgress } from "@mui/material";
import Moment from "react-moment";
import NewSprint from "./NewSprint";
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
    if (
      !done ||
      (subTasks[id] && subTasks[id].every((subTask) => subTask.done))
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
          result.forEach((item) => {
            if (!item.done) {
              loadSubTasks(item.id);
            }
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
      sprintId: 2,
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

  return (
    <div className="App">
      <h1>MY TODO LIST</h1>
      <NewItem addItem={addItem} isInserting={isInserting} />
      {error && <p>Error: {error.message}</p>}
      {isLoading && <CircularProgress />}
      {!isLoading && (
        <div id="maincontent">
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
                          {(!subTasks[item.id] ||
                            subTasks[item.id].length === 0 ||
                            subTasks[item.id].every(
                              (subTask) => subTask.done
                            )) && (
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
                          )}
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
          <h2 id="donelist">Done items</h2>
          <table id="itemlistDone" className="itemlist">
            <TableBody>
              {items.map(
                (item) =>
                  item.done && (
                    <tr key={item.id}>
                      <td className="description">{item.description}</td>
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
                          Undo
                        </Button>
                      </td>
                      <td>
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
                    </tr>
                  )
              )}
            </TableBody>
          </table>
          <NewSprint addSprint={addSprint} isCreating={isCreatingSprint} />

        </div>
        
      )}
    </div>
  );
}

export default App;
