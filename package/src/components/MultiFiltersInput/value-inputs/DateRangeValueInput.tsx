import React, { useEffect, useRef, useState } from "react";
import { DatePickerInput } from "@mantine/dates";
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
  const inputRef = useRef<HTMLButtonElement>(null);
  const [localValue, setLocalValue] = useState<[Date | null, Date | null]>(value);

  useEffect(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = (val: [Date | string | null, Date | string | null]) => {
    const start = toDate(val[0]);
    const end = toDate(val[1]);
    setLocalValue([start, end]);
    onChange([start, end]);
    // Complete when both dates are selected from calendar
    if (start && end) {
      const formatted = formatDateRange(start, end);
      onComplete(formatted, [start, end]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel?.();
    }
  };

  return (
    <div className={classes.container}>
      <DatePickerInput
        ref={inputRef}
        type="range"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Select range..."
        valueFormat="MMM D, YYYY"
        popoverProps={{ withinPortal: true, shadow: "md" }}
        classNames={{ input: classes.input }}
        variant="unstyled"
        size="xs"
        allowSingleDateInRange
      />
    </div>
  );
};

export default DateRangeValueInput;

