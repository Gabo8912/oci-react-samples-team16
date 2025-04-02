import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

function NewSprint(props) {
  const [sprintName, setSprintName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);

  // Fetch available tasks when component mounts
  useEffect(() => {
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setAvailableTasks(data.filter(task => !task.sprintId)))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // Common input style
  const inputStyle = {
    height: "40px",
    fontSize: "16px",
    padding: "0 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
    margin: "5px 0",
    width: "100%"
  };

  // Button style
  const buttonStyle = {
    height: "40px",
    fontSize: "16px",
    padding: "0 20px",
    textTransform: "none",
    marginTop: "10px"
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!sprintName.trim()) {
      alert("Please enter a sprint name");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("End date must be after start date");
      return;
    }

    const sprintData = {
      name: sprintName,
      startDate: startDate,
      endDate: endDate,
      taskIds: selectedTasks
    };

    props.addSprint(sprintData);

    // Reset form
    setSprintName("");
    setStartDate("");
    setEndDate("");
    setSelectedTasks([]);
  };

  const handleTaskSelect = (e) => {
    setSelectedTasks(e.target.value);
  };

  return (
    <div id="newsprintform" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Create New Sprint</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        {/* Sprint Name */}
        <input
          type="text"
          placeholder="Sprint Name"
          value={sprintName}
          onChange={(e) => setSprintName(e.target.value)}
          style={inputStyle}
          required
        />

        {/* Date Selection */}
        <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Task Selection */}
        <FormControl fullWidth style={{ margin: "10px 0" }}>
          <InputLabel id="task-select-label">Select Tasks</InputLabel>
          <Select
            labelId="task-select-label"
            id="task-select"
            multiple
            value={selectedTasks}
            onChange={handleTaskSelect}
            style={inputStyle}
            renderValue={(selected) => selected.length + " tasks selected"}
          >
            {availableTasks.map((task) => (
              <MenuItem key={task.id} value={task.id}>
                {task.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={props.isCreating}
          style={buttonStyle}
        >
          {props.isCreating ? "Creating..." : "Create Sprint"}
        </Button>
      </form>
    </div>
  );
}

export default NewSprint;