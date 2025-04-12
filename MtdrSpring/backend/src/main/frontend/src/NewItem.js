import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

// Configuration constants
const LONG_TASK_THRESHOLD = 4; // hours
const DEFAULT_SPRINT_ID = 2;

function NewItem(props) {
  const [item, setItem] = useState("");
  const [duration, setDuration] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState("");
  const [sprintId, setSprintId] = useState(DEFAULT_SPRINT_ID);
  const [availableSprints, setAvailableSprints] = useState([]);

  const hours = parseFloat(duration);

  // Style configurations
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

  // Fetch available sprints when component mounts
  useEffect(() => {
    fetch('/api/sprints')
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setAvailableSprints(data);
          setSprintId(data[0].id); // Set to first sprint by default
        }
      })
      .catch(error => console.error('Error fetching sprints:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!item.trim()) {
      alert("La tarea no puede estar vacía.");
      return;
    }

    if (isNaN(hours) || hours <= 0) {
      alert("Por favor, ingresa una duración válida (mayor a 0).");
      return;
    }

    if (hours > LONG_TASK_THRESHOLD && subTasks.length === 0) {
      alert(`Tareas mayores a ${LONG_TASK_THRESHOLD} horas deben tener al menos una subtarea.`);
      return;
    }

    props.addItem(item.trim(), hours, subTasks, sprintId);

    // Reset form
    setItem("");
    setDuration("");
    setSubTasks([]);
    setNewSubTask("");
    setSprintId(availableSprints[0]?.id || DEFAULT_SPRINT_ID);
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
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        {/* Main inputs row */}
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
            {availableSprints.length > 0 ? (
              availableSprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name || `Sprint ${sprint.id}`}
                </option>
              ))
            ) : (
              <option value={DEFAULT_SPRINT_ID}>Sprint {DEFAULT_SPRINT_ID}</option>
            )}
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

        {/* Subtasks section */}
        {!isNaN(hours) && hours > LONG_TASK_THRESHOLD && (
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0" }}>Agregar Subtareas</h4>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input
                type="text"
                placeholder="Nueva subtarea"
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                style={{ ...commonInputStyle, flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={addSubTaskToList}
                style={buttonStyle}
              >
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

        {/* Submit button */}
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