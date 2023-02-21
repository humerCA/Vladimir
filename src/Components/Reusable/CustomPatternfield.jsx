import React from "react";

import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { PatternFormat } from "react-number-format";

const CustomPatternfield = ({ name, control, ...patternfield }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value = null, onChange } = field;

        return (
          <PatternFormat
            {...patternfield}
            customInput={TextField}
            value={value}
            onValueChange={(data) => {
              if (!data.value) return onChange(null);

              onChange(data.value);
            }}
            sx={{
              ".MuiInputBase-root": { borderRadius: "12px" },
            }}
          />
        );
      }}
    />
  );
};

export default CustomPatternfield;
