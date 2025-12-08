import React from "react";
import { Combobox, ScrollArea } from "@mantine/core";
import { IconFilterOff } from "@tabler/icons-react";

import type { FilterDefinition } from "../../../types/filter.types";
import { getFieldIcon } from "../../../utils";
import classes from "./FieldDropdown.module.css";

export interface FieldDropdownProps {
  fields: FilterDefinition[];
  totalAvailable: number;
}

export const FieldDropdown: React.FC<FieldDropdownProps> = ({
  fields,
  totalAvailable,
}) => {
  if (fields.length === 0) {
    return (
      <Combobox.Options className={classes.options}>
        <Combobox.Empty>
          <div className={classes.emptyContainer}>
            <IconFilterOff size={20} className={classes.emptyIcon} />
            <span className={classes.emptyText}>No matching filters</span>
          </div>
        </Combobox.Empty>
      </Combobox.Options>
    );
  }

  return (
    <Combobox.Options className={classes.options}>
      <ScrollArea.Autosize mah={280} type="scroll" scrollbarSize={4}>
        <div className={classes.spaceY}>
          {fields.map((field) => {
            const icon = field.icon || getFieldIcon(field.type, 16);
            return (
              <Combobox.Option
                key={field.key}
                value={field.key}
                className={classes.option}
              >
                <div className={classes.optionContent}>
                  <div className={classes.iconWrapper}>
                    {icon}
                  </div>
                  <span className={classes.fieldLabel}>
                    {field.label}
                  </span>
                </div>
              </Combobox.Option>
            );
          })}
        </div>
      </ScrollArea.Autosize>
    </Combobox.Options>
  );
};

export default FieldDropdown;

