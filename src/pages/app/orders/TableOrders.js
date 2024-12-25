import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Button, Select, Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { formatDateTimestamp } from "../../../utils/DateTimeFormat";
import { orange } from "@mui/material/colors";
import DetailImage from "./DetailImage";

const TableOrders = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [detailImageOpen, setDetailImageOpen] = useState(false);

  const toggleDetailImage = () => {
    setDetailImageOpen(!detailImageOpen);
  };

  const setColorStatus = {
    new: "#3dce3a",
    tracking: "#854fff",
    shipping: "#ff0000",
  };

  const setColorOrder = {
    basic: ["#f0fbfb", "#90c2c8"],
    sample: ["#fbf3ea", "#c88e89"],
  };

  const columns = [
    {
      field: "id",
      headerName: "",
      width: 1,
      disableColumnMenu: true,
      hideable: false,
      renderCell: (params) => (
        <IconButton onClick={() => params.row.toggleExpand(params.row.id)}>
          {params.row.isParent &&
            (params.row.isExpanded ? <IndeterminateCheckBoxOutlinedIcon /> : <AddBoxOutlinedIcon />)}
        </IconButton>
      ),
    },
    {
      field: "orderNameOrId",
      headerName: "Order ID/Name",
      width: 130,
      cellClassName: (params) => (params.row.isParent || params.row.isParent === undefined ? "" : "rightAlign"),
    },
    { field: "productType", headerName: "Product type", width: 130 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [status, setStatus] = useState(params.row.status);
        const handleChange = (event) => {
          const newValue = event.target.value;
          setStatus(newValue);
        };

        return (
          <Select
            labelId="demo-customized-select-label"
            value={status}
            onChange={handleChange}
            sx={{
              width: "100%",
              height: "30px",
              textAlign: "center",
              borderRadius: "15px",
              backgroundColor: setColorStatus[status],
              color: "white",
              fontSize: "14px",
            }}
          >
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="tracking">Tracking</MenuItem>
            <MenuItem value="shipping">Shipping</MenuItem>
          </Select>
        );
      },
    },
    {
      field: "supplier",
      headerName: "Supplier",
      description: "This column has a value getter and is not sortable.",
      width: 160,
      renderCell: (params) => (
        <Button
          variant="outlined"
          startIcon={
            <FiberManualRecordIcon
              sx={{
                width: "12px",
                height: "12px",
              }}
            />
          }
          sx={{
            width: "max-content",
            textAlign: "center",
            height: "30px",
            textTransform: "none",
            borderRadius: "22px",
            fontSize: "14px",
            color: "#77bfaa",
            backgroundColor: "#e6faf5",
            border: "unset",
          }}
        >
          New
        </Button>
      ),
    },
    {
      field: "order",
      headerName: "Order",
      width: 130,
      renderCell: (params) => (
        <Button
          variant="outlined"
          startIcon={
            <FiberManualRecordIcon
              sx={{
                width: "12px",
                height: "12px",
              }}
            />
          }
          sx={{
            width: "max-content",
            height: "30px",
            textAlign: "center",
            borderRadius: "22px",
            textTransform: "none",
            backgroundColor: setColorOrder[params.row.order][0],
            color: setColorOrder[params.row.order][1],
            border: "unset",
          }}
        >
          {params.row.order}
        </Button>
      ),
    },
    { field: "tracking", headerName: "Tracking", width: 130 },
    { field: "quantity", headerName: "Quantity", width: 130 },
    { field: "price", headerName: "Price", width: 130 },
    { field: "note", headerName: "Note", width: 130 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: () => <VisibilityOutlinedIcon sx={{ color: "#ce806e" }} onClick={toggleDetailImage} />,
    },
    { field: "receivedTime", headerName: "Received time", width: 170 },
    { field: "approvedTime", headerName: "Approved time", width: 170 },
  ];

  const initialRows = [
    {
      id: 1,
      orderNameOrId: "Snow",
      productType: "Jon",
      status: "new",
      supplier: "supplier",
      order: "sample",
      tracking: "tracking",
      quantity: "quantity",
      price: "price",
      note: "note",
      image: "image",
      receivedTime: formatDateTimestamp(new Date()),
      approvedTime: formatDateTimestamp(new Date()),
      isParent: true,
      children: [
        {
          id: 11,
          orderNameOrId: "Snow",
          productType: "Jon",
          status: "new",
          supplier: "supplier",
          order: "basic",
          tracking: "tracking",
          quantity: "quantity",
          price: "price",
          note: "note",
          image: "image",
          receivedTime: formatDateTimestamp(new Date()),
          approvedTime: formatDateTimestamp(new Date()),
          isParent: false,
        },
        {
          id: 12,
          orderNameOrId: "Snow",
          productType: "Jon",
          status: "new",
          supplier: "supplier",
          order: "basic",
          tracking: "tracking",
          quantity: "quantity",
          price: "price",
          note: "note",
          image: "image",
          receivedTime: formatDateTimestamp(new Date()),
          approvedTime: formatDateTimestamp(new Date()),
          isParent: false,
        },
      ],
    },
    {
      id: 2,
      orderNameOrId: "Snow",
      productType: "Jon",
      status: "new",
      supplier: "supplier",
      order: "basic",
      tracking: "tracking",
      quantity: "quantity",
      price: "price",
      note: "note",
      image: "image",
      receivedTime: formatDateTimestamp(new Date()),
      approvedTime: formatDateTimestamp(new Date()),
    },
    {
      id: 3,
      orderNameOrId: "Snow",
      productType: "Jon",
      status: "tracking",
      supplier: "supplier",
      order: "sample",
      tracking: "tracking",
      quantity: "quantity",
      price: "price",
      note: "note",
      image: "image",
      receivedTime: formatDateTimestamp(new Date()),
      approvedTime: formatDateTimestamp(new Date()),
    },
    {
      id: 4,
      orderNameOrId: "Snow",
      productType: "Jon",
      status: "shipping",
      supplier: "supplier",
      order: "basic",
      tracking: "tracking",
      quantity: "quantity",
      price: "price",
      note: "note",
      image: "image",
      receivedTime: formatDateTimestamp(new Date()),
      approvedTime: formatDateTimestamp(new Date()),
    },
    {
      id: 5,
      orderNameOrId: "Snow",
      productType: "Jon",
      status: "tracking",
      supplier: "supplier",
      order: "basic",
      tracking: "tracking",
      quantity: "quantity",
      price: "price",
      note: "note",
      image: "image",
      receivedTime: formatDateTimestamp(new Date()),
      approvedTime: formatDateTimestamp(new Date()),
    },
    {
      id: 6,
      orderNameOrId: "Snow",
      productType: "Jon",
      status: "new",
      supplier: "supplier",
      order: "sample",
      tracking: "tracking",
      quantity: "quantity",
      price: "price",
      note: "note",
      image: "image",
      receivedTime: formatDateTimestamp(new Date()),
      approvedTime: formatDateTimestamp(new Date()),
    },
    {
      id: 7,
      orderNameOrId: "Snow",
      productType: "Jon",
      status: "shipping",
      supplier: "supplier",
      order: "sample",
      tracking: "tracking",
      quantity: "quantity",
      price: "price",
      note: "note",
      image: "image",
      receivedTime: formatDateTimestamp(new Date()),
      approvedTime: formatDateTimestamp(new Date()),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };
  const [expandedRows, setExpandedRows] = useState({});

  const toggleExpand = (id) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [id]: !prevExpandedRows[id],
    }));
  };

  const getRows = () => {
    const rows = [];
    initialRows.forEach((row) => {
      rows.push({ ...row, toggleExpand, isExpanded: expandedRows[row.id] });

      if (expandedRows[row.id] && row.children) {
        row.children.forEach((childRow) => {
          rows.push(childRow); // Thêm hàng con khi mở rộng
        });
      }
    });
    return rows;
  };

  const product = {
    order: "#PWS6615789 (NYW-24917)",
    type: "Acrylic Window Decor",
    sku: "PW-WCD-12X12 INCHES-1923389",
    image: "https://images.pexels.com/photos/28302550/pexels-photo-28302550.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  };

  return (
    <>
      {selectedRows.length > 0 && (
        <Box
          display="flex"
          alignItems="center"
          sx={{
            margin: "0px 10px 10px",
          }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              border: "1px solid #c6c7cb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 1,
              borderRadius: "5px",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                backgroundColor: orange[500],
              }}
            />
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: "#576484" }}>
            {selectedRows.length} Items selected
          </Typography>
        </Box>
      )}
      <Paper elevation={0} sx={{ width: "100%" }}>
        <DataGrid
          rows={getRows()}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
          rowHeight={60}
          hideFooter={true}
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
          sx={{
            height: "500px",
            border: 0,
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "#ffffff !important",
            },
            "& .MuiDataGrid-checkboxInput": {
              color: "#dcdfea",
              "&.Mui-checked": {
                color: "#673ab7",
              },
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#8094ae",
              fontSize: "14px",
              fontWeight: "100",
            },
            "& .MuiDataGrid-virtualScrollerRenderZone": {
              backgroundColor: "#f5f6fa",
            },
            "& .rightAlign": {
              paddingLeft: "30px",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "#ffffff",
              color: "#8094ae",
              borderRadius: "5px",
              marginTop: "10px",
            },
            "& .MuiDataGrid-row:last-child": {
              marginBottom: "20px",
            },
            "& .MuiDataGrid-row:hover": {
              boxShadow: "0 2px 15px -4px rgba(133,79,255,.4)",
              backgroundColor: "#ffffff !important",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
          }}
        />
      </Paper>
      <div className="orders-table-pagination">
        <Pagination
          count={4}
          variant="outlined"
          shape="rounded"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              margin: "0px",
              width: "40px",
              height: "40px",
              borderRadius: "0",
              color: "#526484",
              border: "1px solid #e5e9f2",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "#854fff",
              color: "white",
            },
          }}
        />
      </div>
      <DetailImage open={detailImageOpen} onClose={toggleDetailImage} product={product} />
    </>
  );
};

export default TableOrders;
