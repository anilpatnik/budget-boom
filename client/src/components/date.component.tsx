import { TextField } from "@mui/material";
import { dateY90, dateT90 } from "@/util";

type ComponentProps = {
  name?: string;
  value?: string;
  label?: string;
  optional?: boolean;
  touched?: boolean;
  errorMessage?: string;
  handleChange?: (e: any) => void;
  handleBlur?: (e: any) => void;
  disabled?: boolean;
  min?: string;
  max?: string;
};
export function DateComponent({
  name,
  value,
  label,
  optional = false,
  touched,
  errorMessage,
  handleChange,
  handleBlur,
  disabled = false,
  min = dateY90,
  max = dateT90
}: ComponentProps) {
  return (
    <TextField
      id={`id-${name}`}
      name={name}
      label={`${label} ${optional ? "(Optional)" : ""}`}
      type="date"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      variant="standard"
      onKeyDown={e => e.preventDefault()} // disable keyboard input
      slotProps={{ input: { min, max }, inputLabel: { shrink: true } }}
      error={touched && Boolean(errorMessage)}
      helperText={touched && errorMessage}
      disabled={disabled}
    />
  );
}
