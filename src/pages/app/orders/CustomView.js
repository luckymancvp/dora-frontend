import React, { useEffect, useState } from "react";
import {
  Button,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListItem,
  List,
  Drawer,
  Checkbox,
  Box,
} from "@mui/material";

const CustomView = ({ openCustom, onClose }) => {
  const [open, setOpen] = useState(openCustom);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose();
    }
  };

  useEffect(() => {
    setOpen(openCustom);
  }, [openCustom]);

  const [checked, setChecked] = useState([0]);

  const listCustomView = [
    { text: "Product type", value: "product-type" },
    { text: "Shipping name", value: "shipping_name" },
    { text: "Seller Name", value: "seller_name" },
    { text: "Order type", value: "order_type" },
    { text: "Tracking", value: "tracking" },
    { text: "Label", value: "label" },
    { text: "Location", value: "location" },
    { text: "Quantity", value: "quantity" },
    { text: "Price", value: "price" },
    { text: "Surcharge", value: "surcharge" },
    { text: "Store", value: "store" },
    { text: "Artwork", value: "artwork" },
    { text: "Received time", value: "received_time" },
    { text: "Approved time", value: "approved_time" },
  ];

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value.value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value.value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const DrawerList = (
    <Box sx={{ width: 290 }} role="presentation">
      <Box sx={{ color: "#888e95", paddingLeft: "15px", paddingTop: "15px" }}>Custom view</Box>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {listCustomView.map((value) => {
          const labelId = `checkbox-list-label-${value.value}`;
          return (
            <ListItem key={value.value} disablePadding>
              <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                <ListItemIcon sx={{ minWidth: "10px" }}>
                  <Checkbox
                    edge="start"
                    checked={checked.includes(value.value)}
                    tabIndex={-1}
                    disableRipple
                    sx={{
                      "&.Mui-checked": {
                        color: "#673ab7",
                      },
                    }}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          gap: "20px",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#ffffff",
            color: "#576484",
            textTransform: "none",
            padding: "5px 10px",
            flexGrow: 1,
          }}
          onClick={toggleDrawer(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#673ab7",
            color: "#ffffff",
            textTransform: "none",
            padding: "5px 10px",
            flexGrow: 1,
          }}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );

  return (
    <div>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor={"right"} className="custom-view">
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default CustomView;
