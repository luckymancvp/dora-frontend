import ClearIcon from "@mui/icons-material/Clear";
import { Box, Button, Divider, Drawer, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomFiled from "../../../components/CustomFiled/CustomFiled";

const ExpandMoreFilters = ({ openMoreFilter, onClose }) => {
  const [setOrderType] = useState("");
  const [setLocation] = useState("");
  const [setCreationType] = useState("");

  const [open, setOpen] = useState(openMoreFilter);
  useEffect(() => {
    setOpen(openMoreFilter);
  }, [openMoreFilter]);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      orderType: "",
      location: "",
      creationType: "",
    },
  });

  const filterColumns = [
    { label: "Order type", key: "orderType", id: "filter-order-type", type: "Select", inputType: "select" },
    {
      label: "Location",
      key: "location",
      id: "filter-location",
      type: "Select",
      inputType: "text",
      placeholder: "Search by name or code",
    },
    { label: "Creation type", key: "creationType", id: "filter-creation-type", type: "Select", inputType: "select" },
  ];

  const orderOptions = [
    { value: "order1", label: "Order 1" },
    { value: "order2", label: "Order 2" },
  ];

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
          <Box sx={{ width: 400, padding: "10px 20px" }}>
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
                  setOrderType("");
                  setLocation("");
                  setCreationType("");
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
              {filterColumns.map((column) => (
                <CustomFiled
                  key={column.id}
                  name={column.key}
                  label={column.label}
                  inputType={column.type === "TextField" ? column.inputType : undefined}
                  rules={{ required: `${column.label} is required` }}
                  control={control}
                  placeholder={column?.placeholder ?? ""}
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

export default ExpandMoreFilters;
