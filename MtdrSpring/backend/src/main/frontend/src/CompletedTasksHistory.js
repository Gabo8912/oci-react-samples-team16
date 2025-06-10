import React, { useState, useEffect } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import CloseIcon from "@mui/icons-material/Close";
import Moment from "react-moment";
import API_LIST from "./API";
import "./CompletedTasksHistory.css";

function CompletedTasksHistory({ onClose }) {
  const [isLoading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState();
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_LIST}/todolist`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener las tareas.");
        return res.json();
      })
      .then((result) => {
        const completed = result
          .filter((item) => item.done)
          .sort((a, b) => new Date(b.creationTs) - new Date(a.creationTs));
        setItems(completed);
        setVisible(true);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <div className={`popup-wrapper ${visible ? "show" : "hide"}`}>
      <div className="popup-card">
        <div className="popup-header">
          <h3>Latest Completed Tasks</h3>
          <IconButton onClick={handleClose} size="small" sx={{ color: "#fff" }}>
            <CloseIcon fontSize="medium" />
          </IconButton>
        </div>

        <div className="popup-content">
          {error && <p className="error-text">{error.message}</p>}
          {isLoading && <CircularProgress size={24} />}
          {!isLoading &&
            items.map((item, index) => (
              <div key={item.id} className="popup-item">
                <div className="popup-text">
                  <div>
                    <span className="item-index">{index + 1}.</span>
                    <span className="item-desc">{item.description}</span>
                  </div>
                  <Moment format="MMM Do" className="item-date">
                    {item.creationTs}
                  </Moment>
                </div>
                <div className="popup-actions">
                  <IconButton
                    onClick={(e) =>
                      toggleDone(e, item.id, item.description, !item.done)
                    }
                    size="small"
                    sx={{ color: "#1976d2", padding: "4px" }}
                  >
                    <UndoIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    onClick={() => deleteItem(item.id)}
                    size="small"
                    sx={{ color: "#999", padding: "4px" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  function deleteItem(id) {
    fetch(`${API_LIST}/todolist/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar.");
        setItems((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => setError(err));
  }

  function toggleDone(e, id, description, done) {
    e.preventDefault();
    fetch(`${API_LIST}/todolist/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, done }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo actualizar.");
        if (!done) {
          setItems((prev) => prev.filter((item) => item.id !== id));
        }
      })
      .catch((err) => setError(err));
  }
}

export default CompletedTasksHistory;
