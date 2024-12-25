import { PickersDay } from "@mui/x-date-pickers";
import { useEffect, useMemo, useRef } from "react";

const CustomPickerDay = ({ range, day, selected, ...rest }) => {
  const pickerRef = useRef(null);

  const pickerClassName = useMemo(() => {
    if (range.start && range.end && day >= range.start && day < range.end) {
      return "Mui-highlighted";
    }
    return undefined;
  }, [day, range.end, range.start]);

  const pickerSelected = useMemo(() => (range.end ? !day.diff(range.end) : selected), [day, range.end, selected]);

  useEffect(() => {
    if (range.end) {
      pickerRef.current?.blur();
    }
  }, [range]);

  return <PickersDay {...rest} ref={pickerRef} day={day} className={pickerClassName} selected={pickerSelected} />;
};

export default CustomPickerDay;
