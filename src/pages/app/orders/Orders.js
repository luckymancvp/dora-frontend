import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import { Button, Chip, Select } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import { OutlinedInput, RSelect } from "../../../components/Component";
import ContentAlt from "../../../layout/content/ContentAlt";
import { groupedData } from "../../components/forms/SelectData";
import TableOrders from "./TableOrders";
import CustomView from "./CustomView";
import ExpandMoreFilters from "./ExpandMoreFilters";
import AddStatus from "./AddStatus";
import AppDateRangePicker from "../../../components/DateRangePicker/DateRangePicker";

const Orders = () => {
  const [openCustom, setOpenCustom] = useState(false);
  const [openMoreFilter, setOpenMoreFilter] = useState(false);
  const [openAddStatus, setOpenAddStatus] = useState(false);

  const handleChangeTime = (start, end) => {
    // start_time = start;
    // stop_time = end;
  };
  return (
    <ContentAlt>
      <div className="orders">
        <div className="orders-header">
          <div className="orders-header-title">Orders</div>
          <div className="orders-header-action">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ffffff",
                color: "#576484",
                textTransform: "none",
              }}
              onClick={() => {
                setOpenAddStatus(true);
              }}
            >
              Add Status
            </Button>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#854fff",
              }}
            >
              Change Status
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ffffff",
                color: "#576484",
                textTransform: "none",
              }}
            >
              Export
            </Button>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={20}
              sx={{
                height: "40px",
                backgroundColor: "#ffffff",
                color: "#576484",
              }}
            >
              <MenuItem value={10}>Export</MenuItem>
              <MenuItem value={20}>Export Order</MenuItem>
              <MenuItem value={30}>Export Label</MenuItem>
            </Select>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ffffff",
                color: "#576484",
                textTransform: "none",
              }}
            >
              Import Tracking
            </Button>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#854fff",
              }}
            >
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
            <div className="orders-search-list-item" style={{ width: "28%" }}>
              <label style={{ marginLeft: "-15px" }}>Date</label>
              <AppDateRangePicker
                id="time"
                placeholder=""
                startDate={new Date()}
                endDate={new Date()}
                onChange={handleChangeTime}
              />
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
            <IconButton
              aria-label="more-filter"
              onClick={() => {
                setOpenMoreFilter(true);
              }}
            >
              <FormatIndentIncreaseIcon />
            </IconButton>
          </div>
        </div>
        <div className="orders-sort">
          <div className="orders-sort-order">
            <Chip label="Total orders(7)" className="orders-sort-order-active" />
            <Chip label="In production(6)" className="orders-sort-chip" />
          </div>
          <div className="orders-sort-custom-view">
            <Chip
              label="Custom-view"
              className="orders-sort-chip"
              onClick={() => {
                setOpenCustom(true);
              }}
            />
          </div>
        </div>
        <div className="orders-table">
          <TableOrders />
        </div>
      </div>
      <CustomView openCustom={openCustom} onClose={() => setOpenCustom(false)} />
      <ExpandMoreFilters openMoreFilter={openMoreFilter} onClose={() => setOpenMoreFilter(false)} />
      <AddStatus openAddStatus={openAddStatus} onClose={() => setOpenAddStatus(false)} />
    </ContentAlt>
  );
};

export default Orders;
