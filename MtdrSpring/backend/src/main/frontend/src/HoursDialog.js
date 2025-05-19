import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const ERROR_INVALID_HOURS = "Debe ingresar un número válido.";

const HoursDialog = ({ open, onClose, onConfirm }) => {
  const [hoursInput, setHoursInput] = useState("");

  const handleConfirm = () => {
    const parsed = parseFloat(hoursInput);
    if (isNaN(parsed) || parsed < 0) {
      alert(ERROR_INVALID_HOURS);
      return;
    }
    onConfirm(parsed);
    setHoursInput("");
  };

  const handleClose = () => {
    setHoursInput("");  // Reset on cancel
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Registrar horas reales</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Horas trabajadas"
          type="number"
          fullWidth
          aria-label="Horas trabajadas"
          value={hoursInput}
          onChange={(e) => setHoursInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleConfirm} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HoursDialog;
