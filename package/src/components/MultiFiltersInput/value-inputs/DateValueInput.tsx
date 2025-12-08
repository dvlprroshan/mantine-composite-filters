import React from "react";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import { formatDate, toDate } from "../../../utils";
import classes from "./DateValueInput.module.css";

export interface DateValueInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  onComplete: (formatted: string, isoValue: string) => void;
}

export const DateValueInput: React.FC<DateValueInputProps> = ({
  value,
  onChange,
  onComplete,
}) => {
  const handleChange = (val: Date | string | null) => {
    const dateVal = toDate(val);
    onChange(dateVal);
    if (dateVal) {
      const formatted = formatDate(dateVal);
      onComplete(formatted, dateVal.toISOString());
    }
  };

  return (
    <div className={classes.container}>
      <DatePickerInput<"default">
        valueFormat="MMM DD, YYYY"
        value={value}
        onChange={handleChange}
        placeholder="Select date"
        size="xs"
        w={150}
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

export default DateValueInput;

