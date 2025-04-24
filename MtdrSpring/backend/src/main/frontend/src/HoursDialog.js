import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const HoursDialog = ({ open, onClose, onConfirm }) => {
  const [input, setInput] = useState("");

  const handleConfirm = () => {
    const parsed = parseFloat(input);
    if (isNaN(parsed) || parsed < 0) {
      alert("Debe ingresar un número válido.");
      return;
    }
    onConfirm(parsed);
    setInput("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registrar horas reales</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Horas trabajadas"
          type="number"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HoursDialog;
