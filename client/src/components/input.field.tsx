import { InputAdornment, TextField } from "@mui/material";

type Props = {
  name?: string;
  value?: string;
  label?: string;
  optional?: boolean;
  type?: string;
  autoComplete?: string;
  touched?: boolean;
  multiline?: boolean;
  fullWidth?: boolean;
  rows?: string | number;
  errorMessage?: string;
  handleChange?: (e: any) => void;
  handleBlur?: (e: any) => void;
  disabled?: boolean;
  startAdor?: boolean;
  startAdorText?: string;
};
export function InputField({
  name,
  value,
  label,
  optional = false,
  type,
  autoComplete = "off",
  touched,
  multiline,
  fullWidth = true,
  rows,
  errorMessage,
  handleChange,
  handleBlur,
  disabled = false,
  startAdor = false,
  startAdorText
}: Props) {
  return (
    <TextField
      id={`id-${name}`}
      name={name}
      label={`${label} ${optional ? "(Optional)" : ""}`}
      type={type}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      autoComplete={autoComplete}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      variant="standard"
      error={touched && Boolean(errorMessage)}
      helperText={touched && errorMessage}
      disabled={disabled}
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          startAdornment: startAdor ? (
            <InputAdornment position="start">{startAdorText}</InputAdornment>
          ) : null
        }
      }}
    />
  );
}
