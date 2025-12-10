import React, { useEffect, useRef, useState } from "react";
import { DateInput } from "@mantine/dates";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState<Date | null>(value);
  const isTypingRef = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const completeSelection = (dateVal: Date) => {
    onChange(dateVal);
    const formatted = formatDate(dateVal);
    onComplete(formatted, dateVal.toISOString());
  };

  const handleChange = (val: Date | string | null) => {
    const dateVal = toDate(val);
    setLocalValue(dateVal);
    onChange(dateVal);
    
    // Only auto-complete if not typing (i.e., selected from calendar)
    if (dateVal && !isTypingRef.current) {
      completeSelection(dateVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    isTypingRef.current = true;
    if (e.key === "Escape") {
      onCancel?.();
    } else if (e.key === "Enter" && localValue) {
      completeSelection(localValue);
    }
  };

  const handleBlur = () => {
    isTypingRef.current = false;
  };

  const handleFocus = () => {
    isTypingRef.current = false;
  };

  return (
    <div className={classes.container}>
      <DateInput
        ref={inputRef}
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="Select date..."
        valueFormat="MMM D, YYYY"
        popoverProps={{ withinPortal: true, shadow: "md" }}
        classNames={{ input: classes.input }}
        variant="unstyled"
        size="xs"
      />
    </div>
  );
};

export default DateValueInput;

