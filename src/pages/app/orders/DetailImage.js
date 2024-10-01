import { Box, Card, CardContent, CardMedia, Divider, Drawer, Typography } from "@mui/material";
import React from "react";

const DetailImage = ({ open, onClose, product }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 500, padding: "20px", backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
          Order: {product.order}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "5px" }}>
          Product type: {product.type}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "20px" }}>
          SKU: {product.sku}
        </Typography>

        <Divider sx={{ marginBottom: "20px" }} />

        <Card sx={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "100%" }}>
          <CardMedia
            component="img"
            height="300"
            image={product.image}
            alt="Product Image"
            sx={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography variant="h5" component="div" sx={{ fontWeight: "bold", textAlign: "center" }}>
              C U S T O M I Z E D
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
              Y O U R N A M E
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Drawer>
  );
};

export default DetailImage;
