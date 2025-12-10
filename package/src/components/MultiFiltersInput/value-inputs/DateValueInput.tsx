import React, { useEffect, useState } from "react";
import { Popover } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { formatDate, toDate } from "../../../utils";
import classes from "./DateValueInput.module.css";

export interface DateValueInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  onComplete: (formatted: string, isoValue: string) => void;
  onCancel?: () => void;
}

export const DateValueInput: React.FC<DateValueInputProps> = ({
  value,
  onChange,
  onComplete,
  onCancel,
}) => {
  const [opened, setOpened] = useState(true);

  useEffect(() => {
    setOpened(true);
  }, []);

  const handleChange = (val: Date | string | null) => {
    const dateVal = toDate(val);
    onChange(dateVal);
    if (dateVal) {
      const formatted = formatDate(dateVal);
      onComplete(formatted, dateVal.toISOString());
      setOpened(false);
    }
  };

  const handleClose = () => {
    setOpened(false);
    if (!value) {
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
          <span className={classes.placeholder}>Select date...</span>
        </Popover.Target>
        <Popover.Dropdown>
          <DatePicker
            value={value}
            onChange={handleChange}
          />
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};

export default DateValueInput;

