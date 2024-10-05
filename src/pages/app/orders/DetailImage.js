import ClearIcon from "@mui/icons-material/Clear";
import { Box, Card, CardMedia, Divider, Drawer, IconButton, Typography } from "@mui/material";
import React from "react";

const DetailImage = ({ open, onClose, product }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
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
        <Box sx={{ width: 500, height: "100%", padding: "15px 20px 20px" }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3, position: "relative" }}>
            <IconButton onClick={onClose} sx={{ position: "absolute", left: 0 }}>
              <ClearIcon />
            </IconButton>
            <Typography variant="h6">Image</Typography>
          </Box>
          <Typography variant="body1" sx={{ marginBottom: "5px" }}>
            <span style={{ fontWeight: "bold" }}>Order:</span> {product.order}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "5px" }}>
            <span style={{ fontWeight: "bold" }}>Product type:</span> {product.type}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "20px" }}>
            <span style={{ fontWeight: "bold" }}>SKU:</span> {product.sku}
          </Typography>
          <Card sx={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "100%" }}>
            <CardMedia
              component="img"
              height="300"
              image={product.image}
              alt="Product Image"
              sx={{ objectFit: "contain" }}
            />
          </Card>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DetailImage;
