import { Controller } from "react-hook-form";
import { Autocomplete as MuiAutocomplete } from "@mui/material";

const Autocomplete = ({ name, control, ...autocomplete }) => {
  const { multiple } = autocomplete;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value = multiple ? [] : null, onChange } = field;

        return (
          <MuiAutocomplete
            {...autocomplete}
            value={value}
            onChange={(_, value) => onChange(value)}
          />
        );
      }}
    />
  );
};

export default Autocomplete;
