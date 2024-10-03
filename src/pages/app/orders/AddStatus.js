import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

export default function AddStatus({ openAddStatus, onClose }) {
  const [open, setOpen] = useState(openAddStatus);

  useEffect(() => {
    setOpen(openAddStatus);
  }, [openAddStatus]);

  const [formData, setFormData] = useState({
    name: "",
    color: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Status</DialogTitle>
        <DialogContent>
          <label>Name Status</label>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <label>Color</label>
          <TextField
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <label>Description</label>
          <TextField
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions
          sx={{
            margin: "15px",
          }}
        >
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
