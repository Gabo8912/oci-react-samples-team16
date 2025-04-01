import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function NewItem(props) {
  const [item, setItem] = useState("");
  const [duration, setDuration] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState("");

  const hours = parseFloat(duration);

  // Estilo común para los inputs
  const commonInputStyle = {
    height: "40px",
    fontSize: "16px",
    padding: "0 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  };

  // Estilo para el botón
  const buttonStyle = {
    height: "40px",
    fontSize: "16px",
    padding: "0 20px",
    textTransform: "none",
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (!item.trim()) return;

    if (isNaN(hours) || hours < 0) {
      alert("Por favor, ingresa una duración válida (número positivo).");
      return;
    }

    // Si la duración es mayor a 4 horas, se requiere al menos una subtarea
    if (hours > 4 && subTasks.length === 0) {
      alert(
        "Para tareas de más de 4 horas es obligatorio agregar al menos una subtarea."
      );
      return;
    }

    // Llamamos a la función del padre para crear la tarea
    props.addItem(item, hours, subTasks);

    // Limpiamos campos
    setItem("");
    setDuration("");
    setSubTasks([]);
    setNewSubTask("");
  }

  function addSubTaskToList() {
    if (!newSubTask.trim()) {
      alert("La subtarea no puede estar vacía.");
      return;
    }
    setSubTasks([...subTasks, newSubTask]);
    setNewSubTask("");
  }

  function removeSubTask(index) {
    // Remueve la subtarea con el índice indicado
    setSubTasks(subTasks.filter((_, i) => i !== index));
  }

  return (
    <div id="newinputform">
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        {/* Línea 1: Input de tarea y de duración en línea */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <input
            id="newiteminput"
            placeholder="Nueva tarea"
            type="text"
            autoComplete="off"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            style={{ ...commonInputStyle, flex: 1, marginRight: "10px" }}
          />
          <input
            type="number"
            placeholder="Duración (hrs)"
            value={duration}
            min="0"
            onChange={(e) => setDuration(e.target.value)}
            style={{
              ...commonInputStyle,
              width: "100px",
              WebkitAppearance: "none",
              MozAppearance: "textfield",
            }}
          />
        </div>

        {/* Línea 2: Formulario de subtareas si la duración es mayor a 4 horas */}
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
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "16px",
                      marginBottom: "4px",
                    }}
                  >
                    <span>{sub}</span>
                    <IconButton
                      onClick={() => removeSubTask(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Última línea: Botón para agregar */}
        <Button
          className="AddButton"
          variant="contained"
          disabled={props.isInserting}
          type="submit"
          size="small"
          style={buttonStyle}
        >
          {props.isInserting ? "Adding…" : "Add"}
        </Button>
      </form>
    </div>
  );
}

export default NewItem;
