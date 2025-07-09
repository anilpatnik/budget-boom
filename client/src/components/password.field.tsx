import { useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Icon } from "@/components";

type Props = {
  name?: string;
  value?: string;
  label?: string;
  autoComplete?: string;
  touched?: boolean;
  errorMessage?: string;
  handleChange?: (e: any) => void;
  handleBlur?: (e: any) => void;
};
export function PasswordField({
  name,
  value,
  label,
  autoComplete = "off",
  touched,
  errorMessage,
  handleChange,
  handleBlur
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  return (
    <TextField
      id={`id-${name}`}
      name={name}
      label={label}
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      autoComplete={autoComplete}
      fullWidth
      variant="standard"
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                {showPassword ? (
                  <Icon name="eye-off-outline" slot="start" />
                ) : (
                  <Icon name="eye-outline" slot="start" />
                )}
              </IconButton>
            </InputAdornment>
          )
        }
      }}
      error={touched && Boolean(errorMessage)}
      helperText={touched && errorMessage}
    />
  );
}
