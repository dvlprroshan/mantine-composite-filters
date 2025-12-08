import { ActionIcon, Transition } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import cx from "clsx";
import React from "react";

import type { ActiveFilter } from "../../types/filter.types";
import { getFieldIcon, getOperatorSymbol } from "../../utils";
import classes from "./FilterPill.module.css";

export interface FilterPillProps {
  filter: ActiveFilter;
  onRemove: (id: string) => void;
  onFieldClick?: (filter: ActiveFilter) => void;
  onOperatorClick?: (filter: ActiveFilter) => void;
  onValueClick?: (filter: ActiveFilter) => void;
  isHighlighted?: boolean;
  isCompact?: boolean;
}

export const FilterPill: React.FC<FilterPillProps> = ({
  filter,
  onRemove,
  onFieldClick,
  onOperatorClick,
  onValueClick,
  isCompact = false,
}) => {
  const icon = filter.icon || getFieldIcon(filter.type, 14);
  
  return (
    <Transition
      mounted={true}
      transition="pop"
      duration={200}
      timingFunction="ease-out"
    >
      {(styles) => (
        <div
          style={styles}
          className={classes.pill}
        >
          <div
            className={cx(classes.box, classes.fieldBox, classes.fieldBoxNonClickable)}
          >
            {icon && (
              <div className={classes.iconWrapper}>
                {icon}
              </div>
            )}
            <span className={cx(classes.label, isCompact ? classes.labelCompact : classes.labelNormal)}>
              {filter.label}
            </span>
          </div>
          
          <div
            className={cx(classes.box, classes.operatorBox)}
            onClick={(e) => {
              e.stopPropagation();
              onOperatorClick?.(filter);
            }}
          >
            <span className={cx(classes.operator, isCompact ? classes.operatorCompact : classes.operatorNormal)}>
              {getOperatorSymbol(filter.operator)}
            </span>
          </div>
          
          <div
            className={cx(classes.box, classes.valueBox)}
            onClick={(e) => {
              e.stopPropagation();
              onValueClick?.(filter);
            }}
          >
            <span className={cx(classes.value, isCompact ? classes.valueCompact : classes.valueNormal)}>
              {filter.displayValue}
            </span>
          </div>
          
          <ActionIcon
            className={classes.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(filter.id);
            }}
            radius="sm"
            size="xs"
            color="gray"
            variant="subtle"
            style={{ opacity: 0.6 }}
          >
            <IconX size={12} />
          </ActionIcon>
        </div>
      )}
    </Transition>
  );
};

export default FilterPill;

