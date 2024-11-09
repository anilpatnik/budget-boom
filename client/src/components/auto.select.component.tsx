import { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";

type Payload = {
  id?: string;
  name?: string;
  icon?: string;
};
type ComponentProps = {
  name?: string;
  value?: string;
  label?: string;
  optional?: boolean;
  touched?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  payload: Payload[];
  handleChange: (value: string) => void;
};
export function AutoSelectComponent({
  name,
  value,
  label,
  optional = false,
  touched,
  errorMessage,
  disabled = false,
  payload = [],
  handleChange
}: ComponentProps) {
  const selectedValue = useMemo(() => payload.find(option => option.id === value), [payload]);
  return (
    <Autocomplete
      id={`id-${name}`}
      options={payload}
      getOptionLabel={option => option.name || String.empty}
      defaultValue={selectedValue}
      onChange={(e, value) => handleChange(value?.id || String.empty)}
      disabled={disabled}
      renderInput={params => (
        <TextField
          {...params}
          id={`id-${name}`}
          name={name}
          label={`${label} ${optional ? "(Optional)" : ""}`}
          variant="standard"
          error={touched && Boolean(errorMessage)}
          helperText={touched && errorMessage}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ input: { fontSize: "0.975em", letterSpacing: "0.075em" } }}
        />
      )}
    />
  );
}
