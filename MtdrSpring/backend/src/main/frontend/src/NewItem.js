import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const LONG_TASK_THRESHOLD = 4;
const DEFAULT_SPRINT_ID = 2;
const baseUrl = process.env.REACT_APP_BACKEND_URL;



function NewItem(props) {
  const [item, setItem] = useState("");
  const [duration, setDuration] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState("");
  const [sprintId, setSprintId] = useState(DEFAULT_SPRINT_ID);
  const [availableSprints, setAvailableSprints] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const hours = parseFloat(duration);

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

  useEffect(() => {
    fetch(`${baseUrl}/api/sprints`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.length > 0) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUserId) {
      alert("Debes asignar la tarea a un usuario.");
      return;
    }

    if (!item.trim()) {
      alert("La tarea no puede estar vacía.");
      return;
    }

    if (isNaN(hours) || hours <= 0) {
      alert("Por favor, ingresa una duración válida.");
      return;
    }

    if (hours > LONG_TASK_THRESHOLD && subTasks.length === 0) {
      alert(`Tareas mayores a ${LONG_TASK_THRESHOLD} horas deben tener al menos una subtarea.`);
      return;
    }

    props.addItem(item.trim(), hours, hours, subTasks, sprintId, selectedUserId);

    setItem("");
    setDuration("");
    setSubTasks([]);
    setNewSubTask("");
    setSprintId(availableSprints[0]?.sprintId || DEFAULT_SPRINT_ID);
    setSelectedUserId(availableUsers[0]?.id || "");
  };

  const addSubTaskToList = () => {
    if (!newSubTask.trim()) {
      alert("La subtarea no puede estar vacía.");
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
            id="newiteminput"
            placeholder="Nueva tarea"
            type="text"
            autoComplete="off"
            value={item}
            onChange={(e) => setItem(e.target.value)}
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
            value={duration}
            min="0"
            step="0.5"
            onChange={(e) => setDuration(e.target.value)}
            style={{
              ...commonInputStyle,
              width: "120px",
              WebkitAppearance: "none",
              MozAppearance: "textfield",
            }}
          />
        </div>

        {/* Subtasks (only if long task) */}
        {!isNaN(hours) && hours > LONG_TASK_THRESHOLD && (
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
          disabled={props.isInserting}
          type="submit"
          size="small"
          style={buttonStyle}
        >
          {props.isInserting ? "Agregando…" : "Agregar"}
        </Button>
      </form>
    </div>
  );
}

export default NewItem;
