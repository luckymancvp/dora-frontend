import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomFiled from "../../../components/CustomFiled/CustomFiled";

export default function AddStatus({ openAddStatus, onClose }) {
  const [open, setOpen] = useState(openAddStatus);

  useEffect(() => {
    setOpen(openAddStatus);
  }, [openAddStatus]);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      name: "",
      color: "",
      description: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Status</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomFiled
              name="name"
              label="Name Status"
              inputType="text"
              rules={{ required: "Name Status is required" }}
              control={control}
            />
            <CustomFiled
              name="color"
              label="Color"
              inputType="text"
              rules={{ required: "Color is required" }}
              control={control}
            />
            <CustomFiled
              name="description"
              label="Description"
              inputType="text"
              rows={4}
              multiline={true}
              rules={{ required: "Description is required" }}
              control={control}
            />
          </form>
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
