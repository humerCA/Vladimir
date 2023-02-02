import { TextField as MuiTextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

const CustomTextField = (props) => {
  const {
    name,
    control,
    onChange: onValueChange,
    errors,
    ...textfield
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { ref, value, onChange: setValue } = field;

        return (
          <>
            <MuiTextField
              {...textfield}
              inputRef={ref}
              value={value}
              onChange={(e) => {
                if (onValueChange) return setValue(onValueChange(e));
                setValue(e);
              }}
              sx={{
                ".MuiInputBase-root": { borderRadius: "12px" },
              }}
            />
            {errors && <Typography sx={{ color: "blue" }}>{errors}</Typography>}
          </>
        );
      }}
    />
  );
};

export default CustomTextField;
