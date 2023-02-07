import { Controller } from "react-hook-form";
import { Autocomplete as MuiAutocomplete } from "@mui/material";

const Autocomplete = ({
  name,
  control,
  onChange: onValueChange,
  ...autocomplete
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value, onChange: setValue } = field;

        return (
          <MuiAutocomplete
            {...autocomplete}
            value={value}
            // onChange={(_, value) => onChange(value)}
            onChange={(e, value) => {
              if (onValueChange) return setValue(onValueChange(e, value));

              setValue(value);
            }}
            sx={{
              borderRadius: "10px",
              background: "#eee",
            }}
          />
        );
      }}
    />
  );
};

export default Autocomplete;
