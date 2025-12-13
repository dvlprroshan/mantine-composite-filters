import React from "react";
import classes from "./FilterMaxReached.module.css";

export interface FilterMaxReachedProps {
  maxFilters: number;
}

export const FilterMaxReached: React.FC<FilterMaxReachedProps> = ({ maxFilters }) => {
  return (
    <p className={classes.text}>
      Maximum of {maxFilters} filters reached
    </p>
  );
};

export default FilterMaxReached;

