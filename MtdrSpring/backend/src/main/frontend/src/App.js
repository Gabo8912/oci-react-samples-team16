/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2022 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
import React, { useState, useEffect, useCallback } from "react";
import NewItem from "./NewItem";
import API_URL from "./API";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  TableBody,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Moment from "react-moment";
import NewSprint from "./NewSprint";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CompletedTasksHistory from "./CompletedTasksHistory";
import HoursDialog from "./HoursDialog";

const COMPLETED_TASKS_TO_SHOW = 5;
const LONG_TASK_DURATION = 4;
const COMPLETED_TASKS_PANEL_WIDTH = "350px";
const COMPLETED_TASKS_PANEL_POSITION = { top: "100px", right: "20px" };

const CompletedTasksContainer = styled(Paper)(() => ({
  background: "#f8f8f8",
  padding: "1.5rem",
  marginTop: 0,
  width: COMPLETED_TASKS_PANEL_WIDTH,
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  borderRadius: "0.5rem",
  position: "fixed",
  top: COMPLETED_TASKS_PANEL_POSITION.top,
  right: COMPLETED_TASKS_PANEL_POSITION.right,
  zIndex: 10,
  borderLeft: "3px solid #5f7d4f",
}));

const CompletedTasksHeader = styled("h2")({
  fontSize: "1.2rem",
  color: "#5f7d4f",
  marginBottom: "1.5rem",
  textAlign: "center",
  fontWeight: "bold",
  paddingBottom: "0.5rem",
  borderBottom: "1px solid #ddd",
});

function App() {
  const [isLoading, setLoading] = useState(false);
  const [isInserting, setInserting] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [subTasks, setSubTasks] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const [showSubTaskForm, setShowSubTaskForm] = useState({});
  const [isCreatingSprint, setIsCreatingSprint] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHoursDialog, setShowHoursDialog] = useState(false);
  const [currentTaskToClose, setCurrentTaskToClose] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || 2);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || null
  );
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUserId(null);
    setUsername(null);
    setRole(null);
    setItems([]);
  }, [setUserId, setUsername, setRole, setItems]);

  const loadUserTasks = useCallback(
    (userId) => {
      const token = localStorage.getItem("token");

      setLoading(true);
      fetch(`${API_URL}/api/task-assignments/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            handleLogout();
            throw new Error("Session expired");
          }
          if (!res.ok) throw new Error("Failed to load tasks");
          return res.json();
        })
        .then((data) => {
          const tasks = data.map((assignment) => assignment.task);
          console.log("🚀 TAREAS CARGADAS:", tasks);
          setItems(tasks.filter((task) => task));
          tasks.forEach((task) => task && loadSubTasks(task.id));
        })
        .catch((err) => {
          setError(err);
          if (err.message === "Session expired") {
            setError(
              "Tu sesión ha expirado. Por favor inicia sesión nuevamente."
            );
          }
        })
        .finally(() => setLoading(false));
    },
    [handleLogout]
  );

  const loadSubTasks = (taskId) => {
    fetch(`${API_URL}/todolist/subtask/${taskId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load subtasks");
        return res.json();
      })
      .then((data) => {
        setSubTasks((prev) => ({ ...prev, [taskId]: data }));
      })
      .catch((err) => setError(err));
  };

  function calculateProgress(list) {
    if (!list?.length) return 0;
    const doneCount = list.filter((st) => st.done).length;
    return (doneCount / list.length) * 100;
  }

  function deleteSubTask(subId) {
    fetch(`${API_URL}/todolist/subtask/${subId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete subtask failed");
        const taskId = Object.keys(subTasks).find((key) =>
          subTasks[key].some((st) => st.id === subId)
        );
        if (taskId) {
          setSubTasks((prev) => ({
            ...prev,
            [taskId]: prev[taskId].filter((st) => st.id !== subId),
          }));
        }
      })
      .catch((err) => setError(err));
  }

  function addItem(
    text,
    estimatedHours,
    realHours,
    subArray,
    sprintId,
    assignedUserId
  ) {
    setInserting(true);

    fetch(`${API_URL}/todolist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: text,
        estimatedHours,
        realHours,
        sprintId,
        userId: Number(assignedUserId),
        done: false,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Add item failed");
        return res.headers.get("location");
      })
      .then((location) => {
        const newId = location?.split("/").pop();
        if (!newId) throw new Error("No se pudo obtener el ID de la tarea");

        return fetch(
          `${API_URL}/api/task-assignments?taskId=${newId}&userId=${assignedUserId}`,
          {
            method: "POST",
          }
        ).then(() => newId);
      })
      .then((newId) => {
        const newTask = {
          id: Number(newId),
          description: text,
          estimatedHours,
          realHours,
          sprintId,
          userId: Number(assignedUserId),
          done: false,
          creationTs: new Date().toISOString(),
        };
        setItems((prev) => [newTask, ...prev]);
      })
      .catch((err) => setError(err))
      .finally(() => setInserting(false));
  }

  function modifyItem(id, description, done, realHours = null) {
    const data =
      realHours != null
        ? { description, done, realHours }
        : { description, done };
    return fetch(`${API_URL}/todolist/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error("Modify failed");
      return res.json();
    });
  }

  function reloadOneItem(id) {
    fetch(`${API_URL}/todolist/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Reload failed");
        return res.json();
      })
      .then((updated) => {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, ...updated } : it))
        );
        loadUserTasks(userId);
      })
      .catch((err) => setError(err));
  }

  function toggleDone(e, item) {
    e.preventDefault();
    const nextDone = !item.done;
    if (nextDone && subTasks[item.id]?.some((st) => !st.done)) {
      return alert(
        "Error: all subtasks must be completed before marking this task done."
      );
    }
    if (nextDone) {
      setCurrentTaskToClose(item);
      setShowHoursDialog(true);
    } else {
      modifyItem(item.id, item.description, false)
        .then(() => reloadOneItem(item.id))
        .catch((err) => setError(err));
    }
  }

  function toggleSubTaskDone(e, subId) {
    fetch(`${API_URL}/todolist/subtask/${subId}/toggle`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Toggle subtask failed");
        return res.json();
      })
      .then((result) => {
        const pid = result.parentTask.id;
        setSubTasks((prev) => ({
          ...prev,
          [pid]: prev[pid].map((st) => (st.id === subId ? result : st)),
        }));
      })
      .catch((err) => setError(err));
  }

  function addSubTask(taskId, text) {
    if (!text.trim()) return alert("Subtask cannot be empty");

    const subTaskData = {
      description: text,
      done: false,
    };

    fetch(`${API_URL}/todolist/subtask/${taskId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subTaskData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Add subtask failed");
        return res.json();
      })
      .then((sub) => {
        setSubTasks((prev) => ({
          ...prev,
          [taskId]: [...(prev[taskId] || []), sub],
        }));
        setNewSubTaskText("");
        setShowSubTaskForm((prev) => ({ ...prev, [taskId]: false }));
      })
      .catch((err) => setError(err));
  }

  function addSprint(sprintData) {
    setIsCreatingSprint(true);
    fetch(`${API_URL}/api/sprints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sprintData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Sprint creation failed");
        return res.json();
      })
      .then(() => setIsCreatingSprint(false))
      .catch((err) => {
        setError(err);
        setIsCreatingSprint(false);
      });
  }

  function toggleHistory() {
    setShowHistory((h) => !h);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (token && storedUserId) {
      setUserId(storedUserId);
      setUsername(localStorage.getItem("username"));
      setRole(localStorage.getItem("role"));
      loadUserTasks(storedUserId);
    }
  }, [loadUserTasks, setRole, setUsername]);

  const incompleteTasks = items.filter((item) => !item.done);
  const completedTasks = items.filter((item) => item.done);

  return (
    <div
      className="App"
      style={{
        background: "transparent",
        boxShadow: "none",
        borderRadius: "0px",
        padding: "0",
        marginTop: "60px",
      }}
    >
      <style>
        {`
          @keyframes progressAnim {
            0% { background-position: 0 0; }
            100% { background-position: 40px 0; }
          }
        `}
      </style>

      {showHistory ? (
        <CompletedTasksHistory
          onBack={toggleHistory}
          items={completedTasks}
          limit={COMPLETED_TASKS_TO_SHOW}
        />
      ) : (
        <>
          <div
            style={{
              maxWidth: "800px",
              margin: "40px auto 24px",
              paddingLeft: "12px",
              paddingRight: "12px",
              textAlign: "left",
            }}
          >
            <div style={{ paddingLeft: "17px" }}>
              <h1 style={{ fontSize: "2rem", marginBottom: "4px" }}>
                Add Task
              </h1>
              <p style={{ fontSize: "0.95rem", color: "#666", margin: 0 }}>
                Organize your tasks and track progress efficiently.
              </p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <NewItem addItem={addItem} isInserting={isInserting} />
            </div>
            <div
              style={{
                maxWidth: "800px",
                margin: "46px auto 12px",
                paddingLeft: "16px",
                paddingRight: "16px",
                textAlign: "left",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  marginBottom: "22px",
                  color: "#333",
                }}
              >
                Pending Tasks
              </h2>
              {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
              {isLoading && <CircularProgress />}

              {!isLoading && (
                <div
                  style={{
                    boxSizing: "border-box",
                  }}
                >
                  {incompleteTasks.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        background: "#fff",
                        borderRadius: "22px",
                        padding: "20px",
                        boxShadow:
                          "0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        position: "relative",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flex: 1,
                          }}
                        >
                          <strong style={{ fontSize: "1.1rem" }}>
                            {item.description}
                          </strong>

                          <Button
                            onClick={() =>
                              setExpandedTasks((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                              }))
                            }
                            style={{
                              minWidth: "28px",
                              height: "28px",
                              backgroundColor: "transparent",
                              borderRadius: "6px",
                              transition: "background 0.2s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "0",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(0, 0, 0, 0.06)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                          >
                            <ExpandMoreIcon
                              style={{
                                transform: expandedTasks[item.id]
                                  ? "rotate(0deg)"
                                  : "rotate(-90deg)",
                                transition: "transform 0.2s ease",
                                color: "#1976d2",
                              }}
                            />
                          </Button>
                        </div>

                        <Moment
                          format="MMM Do hh:mm:ss"
                          style={{
                            fontSize: "0.8rem",
                            color: "#888",
                            fontWeight: "normal",
                            marginRight: "10px",
                          }}
                        >
                          {item.creationTs}
                        </Moment>

                        <Button
                          onClick={(e) => toggleDone(e, item)}
                          style={{
                            minWidth: "36px",
                            height: "36px",
                            background:
                              "linear-gradient(to right, #b00000, #e53935)",
                            color: "#fff",
                            borderRadius: "50%",
                            padding: "0",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            transition:
                              "transform 0.2s ease, box-shadow 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.1)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 10px rgba(0,0,0,0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow =
                              "0 2px 6px rgba(0,0,0,0.2)";
                          }}
                        >
                          <CheckIcon fontSize="small" />
                        </Button>
                      </div>

                      {expandedTasks[item.id] &&
                        subTasks[item.id]?.map((sub) => (
                          <div
                            key={sub.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontSize: "0.9rem",
                              padding: "0px 16px",
                              borderRadius: "8px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={sub.done}
                                onChange={(e) => toggleSubTaskDone(e, sub.id)}
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  accentColor: "#b00000",
                                  cursor: "pointer",
                                }}
                              />
                              <span>{sub.description}</span>
                            </div>

                            <IconButton
                              onClick={() => deleteSubTask(sub.id)}
                              size="small"
                              style={{ color: "#888" }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </div>
                        ))}

                      {expandedTasks[item.id] && (
                        <div>
                          <Button
                            onClick={() =>
                              setShowSubTaskForm((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                              }))
                            }
                          >
                            {showSubTaskForm[item.id]
                              ? "Hide Subtask Form"
                              : "Add Subtask"}
                          </Button>

                          {showSubTaskForm[item.id] && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginTop: "8px",
                                marginBottom: "15px",
                              }}
                            >
                              <input
                                type="text"
                                value={newSubTaskText}
                                onChange={(e) =>
                                  setNewSubTaskText(e.target.value)
                                }
                                placeholder="New Subtask"
                                style={{
                                  flex: 1,
                                  height: "35px",
                                  fontSize: "13px",
                                  padding: "0px 11px",
                                  border: "1px solid #ccc",
                                  borderRadius: "9px",
                                  outline: "none",
                                  fontFamily: "'Poppins', sans-serif",
                                }}
                              />

                              <Button
                                onClick={() =>
                                  addSubTask(item.id, newSubTaskText)
                                }
                                style={{
                                  width: "35px",
                                  height: "35px",
                                  minWidth: "35px",
                                  minHeight: "35px",
                                  padding: "0",
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(to right, #b31217, #e52d27)",
                                  color: "white",
                                  fontFamily: "'Poppins', sans-serif",
                                  boxShadow: "none",
                                  transition: "box-shadow 0.3s ease",
                                  border: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <AddIcon />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        style={{
                          position: "absolute",
                          bottom: "-9px",
                          left: "0",
                          height: "50px",
                          width: "100%",
                          background: "#e0e0e0",
                          borderBottomLeftRadius: "22px",
                          borderBottomRightRadius: "22px",
                          borderTopRightRadius: "0px",
                          borderTopLeftRadius: "0px",
                          zIndex: -2,
                        }}
                      >
                        <div
                          style={{
                            width: `${calculateProgress(subTasks[item.id])}%`,
                            height: "100%",
                            background:
                              "linear-gradient(135deg, rgba(255, 80, 80, 0.3) 25%, transparent 25%, transparent 50%, rgba(255, 80, 80, 0.3) 50%, rgba(255, 80, 80, 0.3) 75%, transparent 75%, transparent)",
                            backgroundSize: "40px 40px",
                            animation: "progressAnim 1.5s linear infinite",
                            backgroundColor: "#d32f2f",
                            position: "relative",
                            zIndex: -1,
                            overflow: "hidden",
                            borderRadius: "22px",
                            borderBottomLeftRadius: "22px",
                            borderTopRightRadius: "0px",
                            borderTopLeftRadius: "0px",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <CompletedTasksContainer>
            <CompletedTasksHeader>
              Latest Completed Tasks
              <Button
                variant="contained"
                size="small"
                onClick={toggleHistory}
                style={{ marginLeft: "1rem" }}
              >
                View Full History
              </Button>
            </CompletedTasksHeader>
          </CompletedTasksContainer>

          <HoursDialog
            open={showHoursDialog}
            onClose={() => setShowHoursDialog(false)}
            onConfirm={(realHours) => {
              modifyItem(
                currentTaskToClose.id,
                currentTaskToClose.description,
                true,
                realHours
              )
                .then(() => {
                  reloadOneItem(currentTaskToClose.id);
                  setShowHoursDialog(false);
                })
                .catch((err) => setError(err));
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;