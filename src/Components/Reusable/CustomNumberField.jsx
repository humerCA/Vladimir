import React from "react";

import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";

const Numberfield = ({ name, control, keepPrefix = false, ...numberfield }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value = null, onChange } = field;

        return (
          <NumericFormat
            {...numberfield}
            customInput={TextField}
            value={value}
            onValueChange={(data) => {
              if (!data.value) return onChange(null);

              if (keepPrefix) return onChange(data.formattedValue);

              onChange(Number(data.value));
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

export default Numberfield;
