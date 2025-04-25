/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2022 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
import React, { useState, useEffect } from "react";
import NewItem from "./NewItem";
import API_URL from "./API";                       // <-- tu URL desde .env
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, TableBody, CircularProgress, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import Moment from "react-moment";                // formateo de fechas
import NewSprint from "./NewSprint";              // formulario de sprints
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CompletedTasksHistory from "./CompletedTasksHistory";
import HoursDialog from "./HoursDialog";

const COMPLETED_TASKS_TO_SHOW = 5;
const LONG_TASK_DURATION = 4;                     // umbral para subtareas automáticas
const COMPLETED_TASKS_PANEL_WIDTH = '350px';
const COMPLETED_TASKS_PANEL_POSITION = { top: '100px', right: '20px' };

const CompletedTasksContainer = styled(Paper)(() => ({
  background: '#f8f8f8',
  padding: '1.5rem',
  marginTop: 0,
  width: COMPLETED_TASKS_PANEL_WIDTH,
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  borderRadius: '0.5rem',
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

  // calcula % completado para cada tarea
  function calculateProgress(list) {
    if (!list?.length) return 0;
    const doneCount = list.filter(st => st.done).length;
    return (doneCount / list.length) * 100;
  }

  // Carga inicial de tareas
  function loadTasks() {
    setLoading(true);
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load tasks");
        return res.json();
      })
      .then(data => {
        setItems(data);
        data.forEach(item => loadSubTasks(item.id));
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }

  // Carga de subtareas por tarea
  function loadSubTasks(taskId) {
    fetch(`${API_URL}/subtask/${taskId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load subtasks");
        return res.json();
      })
      .then(data => {
        setSubTasks(prev => ({ ...prev, [taskId]: data }));
      })
      .catch(err => setError(err));
  }

  // Crear ítem
  function addItem(text, estimatedHours, realHours, subArray, sprintId, userId) {
    setInserting(true);
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: text, estimatedHours, realHours, sprintId, userId })
    })
      .then(res => {
        if (!res.ok) throw new Error("Add item failed");
        return res;
      })
      .then(res => {
        const id = res.headers.get("location");
        const newItem = { id, description: text, estimatedHours, realHours, done: false, userId };
        setItems(prev => [newItem, ...prev]);
        // subtareas automáticas si es larga
        if (estimatedHours > LONG_TASK_DURATION && subArray?.length) {
          return Promise.all(subArray.map(desc =>
            fetch(`${API_URL}/subtask/${id}/add`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ description: desc, done: false })
            }).then(r => r.json())
          ));
        }
        return [];
      })
      .then(subs => {
        if (subs.length) {
          setSubTasks(prev => ({ ...prev, [subs[0].parentTask.id]: subs }));
        }
      })
      .catch(err => setError(err))
      .finally(() => setInserting(false));
  }

  // Borrar ítem
  function deleteItem(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        setItems(prev => prev.filter(it => it.id !== id));
      })
      .catch(err => setError(err));
  }

  // Modificar ítem
  function modifyItem(id, description, done, realHours = null) {
    const data = realHours != null ? { description, done, realHours } : { description, done };
    return fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) throw new Error("Modify failed");
        return res.json();
      });
  }

  // Recargar un ítem puntual
  function reloadOneItem(id) {
    fetch(`${API_URL}/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Reload failed");
        return res.json();
      })
      .then(updated => {
        setItems(prev => prev.map(it => it.id === id ? { ...it, ...updated } : it));
      })
      .catch(err => setError(err));
  }

  // Marcar tarea como hecha/rehacer
  function toggleDone(e, item) {
    e.preventDefault();
    const nextDone = !item.done;
    if (nextDone && subTasks[item.id]?.some(st => !st.done)) {
      return alert("Error: all subtasks must be completed before marking this task done.");
    }
    if (nextDone) {
      setCurrentTaskToClose(item);
      setShowHoursDialog(true);
    } else {
      modifyItem(item.id, item.description, false)
        .then(() => reloadOneItem(item.id))
        .catch(err => setError(err));
    }
  }

  // Marcar subtarea
  function toggleSubTaskDone(e, subId) {
    const done = e.target.checked;
    fetch(`${API_URL}/subtask/${subId}/toggle`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done })
    })
      .then(res => {
        if (!res.ok) throw new Error("Toggle subtask failed");
        return res.json();
      })
      .then(result => {
        const pid = result.parentTask.id;
        setSubTasks(prev => ({
          ...prev,
          [pid]: prev[pid].map(st => st.id === subId ? result : st)
        }));
      })
      .catch(err => setError(err));
  }

  // Agregar subtarea inline
  function addSubTask(taskId, text) {
    if (!text.trim()) return alert("Subtask cannot be empty");
    fetch(`${API_URL}/subtask/${taskId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: text, done: false })
    })
      .then(res => {
        if (!res.ok) throw new Error("Add subtask failed");
        return res.json();
      })
      .then(sub => {
        setSubTasks(prev => ({ ...prev, [taskId]: [...(prev[taskId]||[]), sub] }));
        setNewSubTaskText("");
        setShowSubTaskForm(prev => ({ ...prev, [taskId]: false }));
      })
      .catch(err => setError(err));
  }

  // Form sprint
  function addSprint(sprintData) {
    setIsCreatingSprint(true);
    fetch(`${API_URL}/sprints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sprintData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Sprint creation failed");
        return res.json();
      })
      .then(() => setIsCreatingSprint(false))
      .catch(err => {
        setError(err);
        setIsCreatingSprint(false);
      });
  }

  // Mostrar/ocultar historial
  function toggleHistory() {
    setShowHistory(h => !h);
  }

  // Inicial
  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      {showHistory ? (
        <CompletedTasksHistory onBack={toggleHistory} items={items.filter(i => i.done)} limit={COMPLETED_TASKS_TO_SHOW}/>
      ) : (
        <>
          <h1>MY TODO LIST</h1>
          <NewItem addItem={addItem} isInserting={isInserting} />

          <Button
            variant="outlined"
            startIcon={<ExpandMoreIcon />}
            onClick={toggleHistory}
            style={{ margin: '1rem 0' }}
          >
            View Full History
          </Button>

          {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
          {isLoading && <CircularProgress />}

          {!isLoading && (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <table className="itemlist">
                <TableBody>
                  {items.filter(item => !item.done).map(item => (
                    <React.Fragment key={item.id}>
                      <tr>
                        <td className="description">
                          {item.description}
                          <Button onClick={() => {
                            setExpandedTasks(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                          }}>
                            {expandedTasks[item.id] ? '▼' : '►'}
                          </Button>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              style={{ width: `${calculateProgress(subTasks[item.id])}%` }}
                            />
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
                            size="small"
                            onClick={e => toggleDone(e, item)}
                          >
                            Done
                          </Button>
                        </td>
                      </tr>

                      {expandedTasks[item.id] && subTasks[item.id]?.map(sub => (
                        <tr key={sub.id}>
                          <td className="subtask-description">
                            <input
                              type="checkbox"
                              checked={sub.done}
                              onChange={e => toggleSubTaskDone(e, sub.id)}
                            />
                            {sub.description}
                          </td>
                          <td className="date">
                            <Moment format="MMM Do hh:mm:ss">
                              {sub.creation_ts}
                            </Moment>
                          </td>
                          <td>
                            <Button
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={() => deleteItem(sub.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {expandedTasks[item.id] && (
                        <tr>
                          <td colSpan={3}>
                            <Button onClick={() => {
                              setShowSubTaskForm(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                            }}>
                              {showSubTaskForm[item.id] ? 'Hide Subtask Form' : 'Add Subtask'}
                            </Button>
                            {showSubTaskForm[item.id] && (
                              <div>
                                <input
                                  type="text"
                                  value={newSubTaskText}
                                  onChange={e => setNewSubTaskText(e.target.value)}
                                  placeholder="Description"
                                />
                                <Button onClick={() => addSubTask(item.id, newSubTaskText)}>
                                  Add subtask
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </table>

              <NewSprint addSprint={addSprint} isCreating={isCreatingSprint} />
            </div>
          )}

          <CompletedTasksContainer>
            <CompletedTasksHeader>
              Latest Completed Tasks
              <Button
                variant="contained"
                size="small"
                onClick={toggleHistory}
                style={{ marginLeft: '1rem' }}
              >
                View Full History
              </Button>
            </CompletedTasksHeader>
          </CompletedTasksContainer>

          <HoursDialog
            open={showHoursDialog}
            onClose={() => setShowHoursDialog(false)}
            onConfirm={realHours => {
              modifyItem(currentTaskToClose.id, currentTaskToClose.description, true, realHours)
                .then(() => {
                  reloadOneItem(currentTaskToClose.id);
                  setShowHoursDialog(false);
                })
                .catch(err => setError(err));
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;
