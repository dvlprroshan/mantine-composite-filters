import React from "react";
import { Combobox } from "@mantine/core";

import type { FilterDefinition } from "../../../types/filter.types";
import { getOperatorLabel, getOperatorSymbol, getOperatorsForField } from "../../../utils";
import classes from "./OperatorDropdown.module.css";

export interface OperatorDropdownProps {
  field: FilterDefinition;
}

export const OperatorDropdown: React.FC<OperatorDropdownProps> = ({
  field,
}) => {
  const operators = getOperatorsForField(field);

  return (
    <Combobox.Options className={classes.options}>
      <div className={classes.spaceY}>
        {operators.map((op) => (
          <Combobox.Option
            key={op}
            value={op}
            className={classes.option}
          >
            <span className={classes.operatorLabel}>
              {getOperatorSymbol(op)} {getOperatorLabel(op)}
            </span>
          </Combobox.Option>
        ))}
      </div>
    </Combobox.Options>
  );
};

export default OperatorDropdown;

