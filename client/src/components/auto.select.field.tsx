import { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";

type Payload = {
  id?: string;
  name?: string;
  icon?: string;
};
type Props = {
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
export function AutoSelectField({
  name,
  value,
  label,
  optional = false,
  touched,
  errorMessage,
  disabled = false,
  payload = [],
  handleChange
}: Props) {
  const selectedValue = useMemo(
    () => payload.find(option => option.id === value) || null,
    [payload, value]
  );
  return (
    <Autocomplete
      id={`id-${name}`}
      options={payload}
      getOptionLabel={option => option.name || String.empty}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.name}
        </li>
      )}
      value={selectedValue}
      onChange={(e, newValue) => handleChange(newValue?.id || "")}
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
        />
      )}
    />
  );
}
