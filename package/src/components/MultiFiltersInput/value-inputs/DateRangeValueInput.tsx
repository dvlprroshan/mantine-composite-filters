import React from "react";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import { formatDateRange, toDate } from "../../../utils";
import classes from "./DateRangeValueInput.module.css";

export interface DateRangeValueInputProps {
  value: [Date | null, Date | null];
  onChange: (range: [Date | null, Date | null]) => void;
  onComplete: (formatted: string, rangeValue: [Date | null, Date | null]) => void;
}

export const DateRangeValueInput: React.FC<DateRangeValueInputProps> = ({
  value,
  onChange,
  onComplete,
}) => {
  const handleChange = (val: [Date | string | null, Date | string | null]) => {
    const start = toDate(val[0]);
    const end = toDate(val[1]);
    onChange([start, end]);
    if (start && end) {
      const formatted = formatDateRange(start, end);
      onComplete(formatted, [start, end]);
    }
  };

  return (
    <div className={classes.container}>
      <DatePickerInput<"range">
        type="range"
        valueFormat="MMM DD, YYYY"
        value={value}
        onChange={handleChange}
        placeholder="Select range"
        size="xs"
        w={200}
        leftSection={<IconCalendar size={14} />}
        popoverProps={{ withinPortal: true }}
        styles={{
          input: {
            borderColor: "var(--mantine-primary-color-filled)",
            border: "none",
            outline: "none",
            height: "24px",
            minHeight: "24px",
          },
        }}
        classNames={{
          input: "!border-0 !outline-none focus:!outline-none focus:!ring-0",
        }}
      />
    </div>
  );
};

export default DateRangeValueInput;

