import ClearIcon from "@mui/icons-material/Clear";
import { Box, Button, Divider, Drawer, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomFiled from "../../../components/CustomFiled/CustomFiled";

const CreateOrders = ({ openMoreFilter, onClose }) => {
  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      orderId: "",
      productType: "",
      status: "",
      supplier: "",
      order: "",
      tracking: "",
      quantity: "",
      price: "",
      note: "",
      image: "",
      receivedTime: "",
      approvedTime: "",
    },
  });

  const orderOptions = [
    { value: "order1", label: "Order 1" },
    { value: "order2", label: "Order 2" },
  ];

  const columns = [
    { label: "Order ID", key: "orderId", id: "column-order-id", type: "TextField", inputType: "text" },
    { label: "Product type", key: "productType", id: "column-product-type", type: "Select" },
    { label: "Status", key: "status", id: "column-status", type: "Select" },
    { label: "Supplier", key: "supplier", id: "column-supplier", type: "Select" },
    { label: "Order", key: "order", id: "column-order", type: "TextField", inputType: "text" },
    { label: "Tracking", key: "tracking", id: "column-tracking", type: "TextField", inputType: "text" },
    { label: "Quantity", key: "quantity", id: "column-quantity", type: "TextField", inputType: "number" },
    { label: "Price", key: "price", id: "column-price", type: "TextField", inputType: "number" },
    { label: "Note", key: "note", id: "column-note", type: "TextField", inputType: "text" },
    { label: "Image", key: "image", id: "column-image", type: "TextField", inputType: "text" },
    { label: "Received time", key: "receivedTime", id: "column-received-time", type: "TextField", inputType: "text" },
    { label: "Approved time", key: "approvedTime", id: "column-approved-time", type: "TextField", inputType: "text" },
  ];

  const [open, setOpen] = useState(openMoreFilter);
  useEffect(() => {
    setOpen(openMoreFilter);
  }, [openMoreFilter]);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        className="expand-more-filters"
        sx={{
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Divider
            sx={{
              position: "absolute",
              top: 60,
              left: 0,
              width: "100%",
              mb: 3,
              borderColor: "black",
            }}
          />
          <Box sx={{ width: 400, padding: "10px 20px", marginBottom: "80px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6">
                <IconButton onClick={onClose}>
                  <ClearIcon />
                </IconButton>
                More filters
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  reset();
                }}
                sx={{
                  backgroundColor: "#854fff",
                  color: "#ffffff",
                  textTransform: "none",
                  width: "110px",
                }}
              >
                Clear
              </Button>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              {columns.map((column) => (
                <CustomFiled
                  key={column.id}
                  name={column.key}
                  label={column.label}
                  inputType={column.type === "TextField" ? column.inputType : undefined}
                  rules={{ required: `${column.label} is required` }}
                  control={control}
                  variant={column.type}
                  options={column.type === "Select" ? orderOptions : undefined}
                />
              ))}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#854fff",
                    color: "#ffffff",
                    width: "40%",
                    marginTop: "20px",
                  }}
                >
                  Submit
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default CreateOrders;
