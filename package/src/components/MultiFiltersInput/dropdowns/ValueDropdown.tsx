import React from "react";
import { Button, Checkbox, Combobox, ScrollArea } from "@mantine/core";
import { IconCheck, IconSearch } from "@tabler/icons-react";

import type { FilterDefinition, FilterOption } from "../../../types/filter.types";
import classes from "./ValueDropdown.module.css";

export interface ValueDropdownProps {
  field: FilterDefinition;
  options: FilterOption[];
  selectedValues: string[];
  onSubmit: () => void;
}

export const ValueDropdown: React.FC<ValueDropdownProps> = ({
  field,
  options,
  selectedValues,
  onSubmit,
}) => {
  const isMultiSelect = field.type === "multi_select";

  if (options.length === 0) {
    return (
      <Combobox.Options className={classes.options}>
        <Combobox.Empty>
          <div className={classes.emptyContainer}>
            <IconSearch size={20} className={classes.emptyIcon} />
            <span className={classes.emptyText}>No options found</span>
          </div>
        </Combobox.Empty>
      </Combobox.Options>
    );
  }

  return (
    <Combobox.Options className={classes.options}>
      <ScrollArea.Autosize mah={240} type="scroll" scrollbarSize={4}>
        <div className={classes.spaceY}>
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <Combobox.Option
                key={option.value}
                value={option.value}
                active={isMultiSelect ? isSelected : false}
                className={classes.option}
              >
                <div className={classes.optionContent}>
                  {isMultiSelect && (
                    <Checkbox
                      checked={isSelected}
                      onChange={() => {}}
                      tabIndex={-1}
                      size="xs"
                      className={classes.checkbox}
                    />
                  )}
                  <span className={classes.optionLabel}>
                    {option.label}
                  </span>
                </div>
              </Combobox.Option>
            );
          })}
        </div>
      </ScrollArea.Autosize>
      {isMultiSelect && selectedValues.length > 0 && (
        <div className={classes.footer}>
          <span className={classes.footerText}>
            {selectedValues.length} selected
          </span>
          <Button
            type="button"
            onClick={onSubmit}
            className={classes.applyButton}
          >
            <IconCheck size={12} />
            Apply
          </Button>
        </div>
      )}
    </Combobox.Options>
  );
};

export default ValueDropdown;

