import { ButtonBase, FormLabel, Grid } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useMemo, useState } from "react";
import { formatDateString } from "../../utils/DateTimeFormat";
import CustomPickerDay from "./CustomPickerDate";
import "./DateRangePicker.scss";

const AppDateRangePicker = ({ id, label, required, startDate, endDate, isRow = false, placeholder, onChange }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({
    start: startDate ? moment(startDate) : null,
    end: endDate ? moment(endDate) : null,
  });
  const [tempValue, setTempValue] = useState(value);

  const valueText = useMemo(() => {
    let text = "";
    if (value.start) {
      text += formatDateString(value.start);
      if (value.end) {
        text += " ~ " + formatDateString(value.end);
      }
    }
    return text;
  }, [value]);

  const handleSelect = (date) => {
    if (!value.start || date < value.start || (value.start && value.end)) {
      value.start = date;
      value.end = null;
    } else {
      value.end = date;
      setTempValue({ ...value });
      setOpen(false);
      onChange?.(formatDateString(value.start), formatDateString(value.end));
    }
    setValue({ ...value });
  };

  const handleClose = () => {
    if (!value.end) {
      setValue({ ...tempValue });
    }
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} locale="ja">
      <Grid container className="DateRangePicker" direction={isRow ? "row" : "column"} spacing={isRow ? 3 : 2}>
        {label && (
          <Grid item xs={4} alignItems="center" justifyContent={isRow ? "flex-end" : "flex-start"}>
            <FormLabel htmlFor={id} required={required}>
              {label}
            </FormLabel>
          </Grid>
        )}
        <Grid item xs={8}>
          <ButtonBase
            className="DateRangePickerCalendar"
            disableTouchRipple
            disabled={open}
            onClick={() => setOpen(true)}
          >
            <DatePicker
              closeOnSelect={false}
              open={open}
              slotProps={{
                textField: {
                  className: valueText ? "MuiFormControl-filled" : "",
                  placeholder: valueText || placeholder,
                  value: null,
                },
                toolbar: { hidden: true },
                actionBar: { actions: [] },
              }}
              slots={{
                day: (pickerProps) => (
                  <CustomPickerDay {...pickerProps} range={value} onClick={() => handleSelect(pickerProps.day)} />
                ),
              }}
              onClose={handleClose}
            />
          </ButtonBase>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default AppDateRangePicker;
