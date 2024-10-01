import React, { useEffect, useState } from "react";
import { Divider, Drawer, Box, Button, Typography, FormControl, Select, MenuItem, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const ExpandMoreFilters = ({ openMoreFilter, onClose }) => {
  const [orderType, setOrderType] = useState("");
  const [location, setLocation] = useState("");
  const [creationType, setCreationType] = useState("");

  const handleOrderTypeChange = (event) => {
    setOrderType(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleCreationTypeChange = (event) => {
    setCreationType(event.target.value);
  };
  const [open, setOpen] = useState(openMoreFilter);
  useEffect(() => {
    setOpen(openMoreFilter);
  }, [openMoreFilter]);

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
            <FormControl fullWidth sx={{ mb: 3 }}>
              <label>Order type</label>
              <Select value={orderType} onChange={handleOrderTypeChange} sx={{ height: "40px" }}>
                <MenuItem value="">
                  <em>Select order type</em>
                </MenuItem>
                <MenuItem value="type1">Type 1</MenuItem>
                <MenuItem value="type2">Type 2</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <label>Location</label>
              <Select value={location} onChange={handleLocationChange} sx={{ height: "40px" }}>
                <MenuItem value="">
                  <em>Search by name or code</em>
                </MenuItem>
                <MenuItem value="location1">Location 1</MenuItem>
                <MenuItem value="location2">Location 2</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <label>Creation type</label>
              <Select value={creationType} onChange={handleCreationTypeChange} sx={{ height: "40px" }}>
                <MenuItem value="">
                  <em>Creation type</em>
                </MenuItem>
                <MenuItem value="creation1">Creation 1</MenuItem>
                <MenuItem value="creation2">Creation 2</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default ExpandMoreFilters;
