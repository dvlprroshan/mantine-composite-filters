import React from "react";
import { Tooltip } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import classes from "./FilterStatusBar.module.css";

export interface FilterStatusBarProps {
  activeCount: number;
  maxFilters?: number;
  onRefresh: () => void;
}

export const FilterStatusBar: React.FC<FilterStatusBarProps> = ({
  activeCount,
  maxFilters,
  onRefresh,
}) => {
  if (activeCount === 0) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Tooltip label="Refresh filters">
        <button
          type="button"
          onClick={onRefresh}
          className={classes.refreshButton}
        >
          <IconRefresh size={14} />
        </button>
      </Tooltip>
      <span className={classes.text}>
        {activeCount} active filter{activeCount !== 1 ? "s" : ""}
        {maxFilters && ` of ${maxFilters} maximum`}
      </span>
    </div>
  );
};

export default FilterStatusBar;

