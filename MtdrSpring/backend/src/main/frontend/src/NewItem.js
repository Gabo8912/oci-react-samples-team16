import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const LONG_TASK_THRESHOLD = 4;
const DEFAULT_SPRINT_ID = 2;
const baseUrl = process.env.REACT_APP_BACKEND_URL;

const ERROR_EMPTY_TASK = "La tarea no puede estar vacía.";
const ERROR_INVALID_DURATION = "Por favor, ingresa una duración válida.";
const ERROR_LONG_TASK_REQUIRES_SUBTASK = `Tareas mayores a ${LONG_TASK_THRESHOLD} horas deben tener al menos una subtarea.`;
const ERROR_NO_USER = "Debes asignar la tarea a un usuario.";
const ERROR_EMPTY_SUBTASK = "La subtarea no puede estar vacía.";

function NewItem({ addItem, isInserting }) {
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState("");
  const [sprintId, setSprintId] = useState(DEFAULT_SPRINT_ID);
  const [availableSprints, setAvailableSprints] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const durationInHours = parseFloat(taskDuration);

  const commonInputStyle = {
    height: "40px",
    fontSize: "16px",
    padding: "0 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  };

  const buttonStyle = {
    height: "40px",
    fontSize: "16px",
    padding: "0 20px",
    textTransform: "none",
  };

  const isBlank = (str) => !str || !str.trim();

  useEffect(() => {
    fetch(`${baseUrl}/api/sprints`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.length) {
          setAvailableSprints(data);
          setSprintId(data[0].sprintId);
        }
      })
      .catch(() => {
        const fallback = { sprintId: DEFAULT_SPRINT_ID, sprintName: `Sprint ${DEFAULT_SPRINT_ID}` };
        setAvailableSprints([fallback]);
        setSprintId(DEFAULT_SPRINT_ID);
      });
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/auth/users`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAvailableUsers(data);
          setSelectedUserId(data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const validateTaskInput = () => {
    if (!selectedUserId) return ERROR_NO_USER;
    if (isBlank(taskDescription)) return ERROR_EMPTY_TASK;
    if (isNaN(durationInHours) || durationInHours <= 0) return ERROR_INVALID_DURATION;
    if (durationInHours > LONG_TASK_THRESHOLD && subTasks.length === 0) return ERROR_LONG_TASK_REQUIRES_SUBTASK;
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateTaskInput();
    if (validationError) {
      alert(validationError);
      return;
    }

    addItem(taskDescription.trim(), durationInHours, durationInHours, subTasks, sprintId, selectedUserId);

    // Reset form state
    setTaskDescription("");
    setTaskDuration("");
    setSubTasks([]);
    setNewSubTask("");
    setSprintId(availableSprints[0]?.sprintId || DEFAULT_SPRINT_ID);
    setSelectedUserId(availableUsers[0]?.id || "");
  };

  const addSubTaskToList = () => {
    if (isBlank(newSubTask)) {
      alert(ERROR_EMPTY_SUBTASK);
      return;
    }
    setSubTasks([...subTasks, newSubTask.trim()]);
    setNewSubTask("");
  };

  const removeSubTask = (index) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  return (
    <div id="newinputform">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            placeholder="Nueva tarea"
            type="text"
            autoComplete="off"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            style={{ ...commonInputStyle, flex: 1 }}
          />

          <select
            value={sprintId}
            onChange={(e) => setSprintId(Number(e.target.value))}
            style={{ ...commonInputStyle, width: "120px" }}
          >
            {availableSprints.map((s) => (
              <option key={s.sprintId} value={s.sprintId}>
                {s.sprintName || `Sprint ${s.sprintId}`}
              </option>
            ))}
          </select>

          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
            style={{ ...commonInputStyle, width: "140px" }}
          >
            <option value="">— Asignar usuario —</option>
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username || u.email}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Duración (hrs)"
            value={taskDuration}
            min="0"
            step="0.5"
            onChange={(e) => setTaskDuration(e.target.value)}
            style={{
              ...commonInputStyle,
              width: "120px",
              WebkitAppearance: "none",
              MozAppearance: "textfield",
            }}
          />
        </div>

        {!isNaN(durationInHours) && durationInHours > LONG_TASK_THRESHOLD && (
          <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "4px" }}>
            <h4 style={{ margin: "0 0 8px 0" }}>Agregar Subtareas</h4>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input
                type="text"
                placeholder="Nueva subtarea"
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                style={{ ...commonInputStyle, flex: 1 }}
              />
              <Button variant="outlined" onClick={addSubTaskToList} style={buttonStyle}>
                Agregar
              </Button>
            </div>
            {subTasks.length > 0 && (
              <ul style={{ paddingLeft: "20px", margin: 0 }}>
                {subTasks.map((sub, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "16px",
                      marginBottom: "4px",
                    }}
                  >
                    <span>{sub}</span>
                    <IconButton onClick={() => removeSubTask(index)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <Button
          className="AddButton"
          variant="contained"
          disabled={isInserting}
          type="submit"
          size="small"
          style={buttonStyle}
        >
          {isInserting ? "Agregando…" : "Agregar"}
        </Button>
      </form>
    </div>
  );
}

export default NewItem;
