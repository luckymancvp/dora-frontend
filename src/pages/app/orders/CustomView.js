import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React, { useEffect, useState } from "react";

const CustomView = ({ openCustom }) => {
  const [open, setOpen] = useState(openCustom);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    setOpen(openCustom);
  }, [openCustom]);

  const [checked, setChecked] = useState([0]);

  const listCustomView = [
    {
      text: "Product type",
      value: "product-type",
    },
    {
      text: "Shipping name",
      value: "shipping_name",
    },
    {
      text: "Seller Name",
      value: "seller_name",
    },
    {
      text: "Order type",
      value: "order_type",
    },
    {
      text: "Tracking",
      value: "tracking",
    },
    {
      text: "",
      value: "",
    },
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
    <Box sx={{ width: 250 }} role="presentation">
      <Box
        sx={{
          color: "#888e95",
          paddingLeft: "15px",
          paddingTop: "15px",
        }}
      >
        Custom view
      </Box>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {listCustomView.map((value) => {
          const labelId = `checkbox-list-label-${value.value}`;

          return (
            <ListItem key={value} disablePadding>
              <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                <ListItemIcon sx={{ minWidth: "10px" }}>
                  <Checkbox
                    edge="start"
                    checked={checked.includes(value.value)}
                    tabIndex={-1}
                    disableRipple
                    sx={{
                      "&.Mui-checked": {
                        color: "#673ab7", // Màu khi đã được chọn
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
    </Box>
  );

  return (
    <div>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor={"right"}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default CustomView;
