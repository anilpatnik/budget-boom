import { TextField } from "@mui/material";
import { dateHelper } from "@/utils";

type Props = {
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
export function DateField({
  name,
  value,
  label,
  optional = false,
  touched,
  errorMessage,
  handleChange,
  handleBlur,
  disabled = false,
  min = dateHelper.yearStart,
  max = dateHelper.yearEnd
}: Props) {
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
      error={touched && Boolean(errorMessage)}
      helperText={touched && errorMessage}
      disabled={disabled}
    />
  );
}
