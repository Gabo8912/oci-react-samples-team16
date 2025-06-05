import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import config from "./config";
import AddIcon from "@mui/icons-material/Add";

const LONG_TASK_THRESHOLD = 4;
const DEFAULT_SPRINT_ID = 2;
const baseUrl = config.backendUrl;

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
    padding: "0px 11px",
    border: "1px solid #ccc",
    borderRadius: "9px",
    outline: "none",
    fontFamily: "'Poppins', sans-serif",
  };

  const subtaskInputStyle = {
    height: "35px",
    fontSize: "13px",
    padding: "0px 11px",
    border: "1px solid #ccc",
    borderRadius: "9px",
    outline: "none",
    fontFamily: "'Poppins', sans-serif",
  };

  const selectStyle = {
    ...commonInputStyle,
    paddingLeft: "10px",
    paddingRight: "22px", // ✅ espacio real para la flecha
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundColor: "white",
    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='14' viewBox='0 0 24 24' width='14' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 7px center", // ✅ centrado vertical
    backgroundSize: "14px",
    cursor: "pointer",
  };

  const buttonStyle = {
    height: "40px",
    fontSize: "16px",
    padding: "22px 0px",
    textTransform: "none",
    borderRadius: "9px",
    marginTop: "15px",
    background: "linear-gradient(to right, #b31217, #e52d27)",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
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
        const fallback = {
          sprintId: DEFAULT_SPRINT_ID,
          sprintName: `Sprint ${DEFAULT_SPRINT_ID}`,
        };
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
      alert(
        `Tareas mayores a ${LONG_TASK_THRESHOLD} horas deben tener al menos una subtarea.`
      );
      return;
    }

    props.addItem(
      item.trim(),
      hours,
      hours,
      subTasks,
      sprintId,
      selectedUserId
    );

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

  const subtaskButtonStyle = {
    width: "35px",
    height: "35px",
    minWidth: "35px",
    minHeight: "35px",
    padding: "0",
    borderRadius: "50%",
    background: "linear-gradient(to right, #b31217, #e52d27)",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "none",
    transition: "box-shadow 0.3s ease",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      id="newinputform"
      style={{
        background: "transparent",
        boxShadow: "none",
        padding: "0", // opcional
        marginBottom: "1rem", // si quieres separación con lo que sigue
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "30px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            id="newiteminput"
            placeholder="New task"
            type="text"
            autoComplete="off"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            style={{ ...commonInputStyle, flex: 1 }}
          />

          <select
            value={sprintId}
            onChange={(e) => setSprintId(Number(e.target.value))}
            style={{ ...selectStyle, width: "110px" }}
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
            style={{ ...selectStyle, width: "140px" }}
          >
            <option value="">— User —</option>
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username || u.email}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Duration"
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
          <div
            style={{
              border: "1px solid #ccc",
              padding: "25px 26px",
              borderRadius: "10px",
              backgroundColor: "#fff",
              marginTop: "20px",
              marginBottom: "0px",
            }}
          >
            <h4 style={{ marginBottom: "17px" }}>Add Subtasks</h4>
            <div
              style={{
                display: "flex",
                gap: "9px",
                marginBottom: "8px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="New Subtask"
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                style={{ ...subtaskInputStyle, flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={addSubTaskToList}
                style={subtaskButtonStyle}
              >
                <AddIcon />
              </Button>
            </div>
            {subTasks.length > 0 && (
              <ul style={{ paddingLeft: "13px", marginTop: "20px" }}>
                {subTasks.map((sub, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "16px",
                      fontFamily: "'Poppins', sans-serif",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        textAlign: "right",
                        marginRight: "8px",
                      }}
                    >
                      {index + 1}.
                    </div>
                    <div style={{ flex: 1 }}>{sub}</div>
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

        <Button
          className="AddButton"
          variant="contained"
          disabled={props.isInserting}
          type="submit"
          size="small"
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 12px rgba(229, 45, 39, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {props.isInserting ? "Adding..." : "Add"}
        </Button>
      </form>
    </div>
  );
}

export default NewItem;
