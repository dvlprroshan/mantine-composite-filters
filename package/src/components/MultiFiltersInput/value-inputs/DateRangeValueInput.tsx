import React, { useEffect, useState } from "react";
import { Popover } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { formatDateRange, toDate } from "../../../utils";
import classes from "./DateRangeValueInput.module.css";

export interface DateRangeValueInputProps {
  value: [Date | null, Date | null];
  onChange: (range: [Date | null, Date | null]) => void;
  onComplete: (formatted: string, rangeValue: [Date | null, Date | null]) => void;
  onCancel?: () => void;
}

export const DateRangeValueInput: React.FC<DateRangeValueInputProps> = ({
  value,
  onChange,
  onComplete,
  onCancel,
}) => {
  const [opened, setOpened] = useState(true);

  useEffect(() => {
    setOpened(true);
  }, []);

  const handleChange = (val: [Date | null, Date | null]) => {
    const start = toDate(val[0]);
    const end = toDate(val[1]);
    onChange([start, end]);
    if (start && end) {
      const formatted = formatDateRange(start, end);
      onComplete(formatted, [start, end]);
      setOpened(false);
    }
  };

  const handleClose = () => {
    setOpened(false);
    if (!value[0] || !value[1]) {
      onCancel?.();
    }
  };

  return (
    <div className={classes.container}>
      <Popover
        opened={opened}
        onClose={handleClose}
        position="bottom-start"
        withinPortal
        shadow="md"
      >
        <Popover.Target>
          <span className={classes.placeholder}>Select range...</span>
        </Popover.Target>
        <Popover.Dropdown>
          <DatePicker
            type="range"
            value={value}
            onChange={handleChange}
          />
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};

export default DateRangeValueInput;

