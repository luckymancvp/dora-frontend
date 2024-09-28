import Paper from "@mui/material/Paper";
import { Button, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, {useState} from "react";
import ContentAlt from "../../../layout/content/ContentAlt";
import { OutlinedInput } from "../../../components/Component";
import IconButton from "@mui/material/IconButton";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import DatePicker from "react-datepicker";
import { groupedData } from "../../components/forms/SelectData";
import { RSelect } from "../../../components/Component";
import MenuItem from '@mui/material/MenuItem';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';

const Orders = () => {

  const setColorStatus = {
    new: '#3dce3a',
    tracking: '#a484ff',
    shipping: '#ff0000'
  }

  const setColorOrder= {
    basic: ['#aed4db', '#f0fbfb', '#90c2c8'],
    sample: ['#d0a185','#fbf3ea', '#c88e89'],
  }

  const columns = [
    { field: 'id', headerName: 'ID', hide: true,
      renderCell: (params) => (
        <IconButton
          onClick={() => params.row.toggleExpand(params.row.id)}
        >
          { params.row.isParent && (
            params.row.isExpanded ? <IndeterminateCheckBoxOutlinedIcon /> : <AddBoxOutlinedIcon />
          )}
        </IconButton>
      ),
     },
    { field: "orderNameOrId", headerName: "Order ID/Name", width: 130,
      cellClassName: (params) => ((params.row.isParent || params.row.isParent === undefined) ? '' : 'rightAlign')},
    { field: "productType", headerName: "Product type", width: 130 },
    {
      field: "status",
      headerName: "Status",
      type: "number",
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
              width: '100%',
              height: '35px',
              textAlign: 'center',
              borderRadius: '15px',
              backgroundColor: setColorStatus[status],
              color: 'white',
            }}
          >
            <MenuItem value='new'>New</MenuItem>
            <MenuItem value='tracking'>Tracking</MenuItem>
            <MenuItem value='shipping'>Shipping</MenuItem>
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
        <Button variant="outlined" 
          sx={{
            width: 'max-content',
            textAlign: 'center',
            height: '30px',
            textTransform: 'none',
            borderRadius: '22px',
            fontSize: '14px',
            color: '#77bfaa',
            backgroundColor: '#e6faf5',
          }}>
          New
        </Button>
      ),
    },
    { field: "order", headerName: "Order", width: 130, 
      renderCell: (params) => (
      <Button variant="outlined"
        sx={{
          width: 'max-content',
          height: '30px',
          textAlign: 'center',
          borderRadius: '22px',
          textTransform: 'none',
          backgroundColor: setColorOrder[params.row.order][1],
          color: setColorOrder[params.row.order][2],
          borderColor: setColorOrder[params.row.order][0],
        }}>
        {params.row.order}
      </Button>
    ), },
    { field: "tracking", headerName: "Tracking", width: 130 },
    { field: "quantity", headerName: "Quantity", width: 130 },
    { field: "price", headerName: "Price", width: 130 },
    { field: "note", headerName: "Note", width: 130 },
    { field: "image", headerName: "Image", width: 130,
      renderCell: (params) => (
        <VisibilityIcon  sx={{ color: '#ce806e' }}/>
      ),
     },
    { field: "receivedTime", headerName: "Received time", width: 150 },
    { field: "approvedTime", headerName: "Approved time", width: 150 },
  ];

  const initialRows = [
    { id: 1, orderNameOrId: "Snow", productType: "Jon", status: 'new', supplier: "supplier", order: "sample", tracking: "tracking" , quantity: "quantity", 
      price: "price", note: "note", image: "image", receivedTime: new Date(), approvedTime: new Date(), isParent: true, children: [
        { id: 11, orderNameOrId: "Snow", productType: "Jon", status: 'new', supplier: "supplier", order: "basic", tracking: "tracking" , quantity: "quantity", 
          price: "price", note: "note", image: "image", receivedTime: new Date(), approvedTime: new Date(), isParent: false
        },
        { id: 12, orderNameOrId: "Snow", productType: "Jon", status: 'new', supplier: "supplier", order: "basic", tracking: "tracking" , quantity: "quantity", 
          price: "price", note: "note", image: "image", receivedTime: new Date(), approvedTime: new Date(), isParent: false
        },
      ]
    },
    { id: 2, orderNameOrId: "Snow", productType: "Jon", status: 'new', supplier: "supplier", order: "basic", tracking: "tracking" , quantity: "quantity", 
      price: "price", note: "note", image: "image", receivedTime: new Date(), approvedTime: new Date()
    },
    { id: 3, orderNameOrId: "Snow", productType: "Jon", status: 'tracking', supplier: "supplier", order: "sample", tracking: "tracking" , quantity: "quantity", 
      price: "price", note: "note", image: "image", receivedTime: new Date(), approvedTime: new Date()
    },
    { id: 4, orderNameOrId: "Snow", productType: "Jon", status: 'shipping', supplier: "supplier", order: "basic", tracking: "tracking" , quantity: "quantity", 
      price: "price", note: "note", image: "image", receivedTime: new Date(), approvedTime: new Date()
    },
    { id: 5, orderNameOrId: "Snow", productType: "Jon", status: 'tracking', supplier: "supplier", order: "basic", tracking: "tracking" , quantity: "quantity", 
      price: "price", note: "note", image: "image", receivedTime: new Date(), approvedTime: new Date()
    },
    { id: 6, orderNameOrId: "Snow", productType: "Jon", status: 'new', supplier: "supplier", order: "sample", tracking: "tracking" , quantity: "quantity", 
      price: "price", note: "note", image: "image", receivedTime: new Date(), approvedTime: new Date()
    },
    { id: 7, orderNameOrId: "Snow", productType: "Jon", status: 'shipping', supplier: "supplier", order: "sample", tracking: "tracking" , quantity: "quantity", 
      price: "price", note: "note", image: "image", receivedTime: new Date(), approvedTime: new Date()
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

  return (
    <ContentAlt>
      <div className="orders">
        <div className="orders-header">
          <div className="orders-header-title">Orders</div>
          <div className="orders-header-action">
            <Button variant="contained" color="inherit">
              Add Status
            </Button>
            <Button variant="contained" color="warning">
              Change Status
            </Button>
            <Button variant="contained" color="inherit">
              Export
            </Button>
            <Button variant="contained" color="inherit">
              Import Tracking
            </Button>
            <Button variant="contained" color="warning">
              Create Order
            </Button>
          </div>
        </div>
        <div className="orders-search">
          <div className="orders-search-orderId">
            <label>Search</label>
            <OutlinedInput id="outlined-icon" size="sm" icon="search" />
          </div>
          <div className="orders-search-list">
            <div className="orders-search-list-item">
              <label>Date</label>
              <DatePicker selected={new Date()} className="form-control date-picker" />
            </div>
            <div className="orders-search-list-item">
              <label>Supplier</label>
              <OutlinedInput id="outlined-icon" size="sm" icon="search" />
            </div>
            <div className="orders-search-list-item">
              <label>Price</label>
              <OutlinedInput id="outlined-icon" size="sm" icon="search" />
            </div>
            <div className="orders-search-list-item">
              <label>Shop</label>
              <RSelect options={groupedData} />
            </div>
          </div>
          <div className="orders-search-more-filter">
            <IconButton aria-label="delete">
              <FormatIndentIncreaseIcon />
            </IconButton>
          </div>
        </div>
        <div>
          <Paper sx={{ width: "100%" }}>
            <DataGrid
              rows={getRows()}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{
                border: 0,
                '& .rightAlign': {
                  paddingLeft: '30px',
                },
              }}
            />
          </Paper>
        </div>
      </div>
    </ContentAlt>
  );
};

export default Orders;
