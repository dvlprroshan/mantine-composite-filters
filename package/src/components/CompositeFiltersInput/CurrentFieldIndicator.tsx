import { IconChevronDown } from "@tabler/icons-react";
import cx from "clsx";
import React from "react";

import type { FilterDefinition, FilterOperator } from "../../types/filter.types";
import { getFieldIcon, getOperatorSymbol } from "../../utils";
import classes from "./CurrentFieldIndicator.module.css";

export interface CurrentFieldIndicatorProps {
  field: FilterDefinition;
  operator: FilterOperator | null;
  showValueIndicator?: boolean;
  isCompact?: boolean;
}

export const CurrentFieldIndicator: React.FC<CurrentFieldIndicatorProps> = ({
  field,
  operator,
  showValueIndicator = false,
  isCompact = false,
}) => {
  const icon = field.icon || getFieldIcon(field.type, 14);
  
  return (
    <div className={classes.container}>
      <div className={cx(classes.box, classes.fieldBox)}>
        {icon && (
          <div className={classes.iconWrapper}>
            {icon}
          </div>
        )}
        <span className={cx(classes.label, isCompact ? classes.labelCompact : classes.labelNormal)}>
          {field.label}
        </span>
      </div>
      {operator && (
        <div className={cx(classes.box, classes.operatorBox)}>
          <span className={cx(classes.operator, isCompact ? classes.operatorCompact : classes.operatorNormal)}>
            {getOperatorSymbol(operator)}
          </span>
        </div>
      )}
      {showValueIndicator && (
        <div className={cx(classes.box, classes.valueBox)}>
          <IconChevronDown size={12} className={classes.icon} />
        </div>
      )}
    </div>
  );
};

export default CurrentFieldIndicator;

