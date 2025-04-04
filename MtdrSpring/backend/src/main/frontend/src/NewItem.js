import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function NewItem(props) {
  const [item, setItem] = useState("");
  const [duration, setDuration] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState("");
  const [sprintId, setSprintId] = useState(2); // Default: Sprint 1

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

    if (hours > 4 && subTasks.length === 0) {
      alert("Tareas mayores a 4 horas deben tener al menos una subtarea.");
      return;
    }

    props.addItem(item.trim(), hours, subTasks, sprintId);

    // Limpiar formulario
    setItem("");
    setDuration("");
    setSubTasks([]);
    setNewSubTask("");
    setSprintId(2);
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
        {/* Línea 1: Inputs principales */}
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
            <option value={2}>Sprint 2</option>
            <option value={2}>Sprint 3</option>
            <option value={2}>Sprint 4</option>
          </select>

          <input
            type="number"
            placeholder="Duración (hrs)"
            value={duration}
            min="0"
            onChange={(e) => setDuration(e.target.value)}
            style={{
              ...commonInputStyle,
              width: "120px",
              WebkitAppearance: "none",
              MozAppearance: "textfield",
            }}
          />
        </div>

        {/* Línea 2: Subtareas */}
        {!isNaN(hours) && hours > 4 && (
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

        {/* Botón para agregar */}
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
