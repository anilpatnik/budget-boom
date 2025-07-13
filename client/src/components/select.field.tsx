import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { LucideIcon } from "@/components";

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
  handleChange?: (e: any) => void;
  handleBlur?: (e: any) => void;
  disabled?: boolean;
  payload: Payload[];
};
export function SelectField({
  name,
  value,
  label,
  optional = false,
  touched,
  errorMessage,
  handleChange,
  handleBlur,
  disabled = false,
  payload = []
}: Props) {
  return (
    <FormControl error={touched && Boolean(errorMessage)} fullWidth>
      <InputLabel id={`id-${name}-label`} shrink={true} variant="standard">
        {`${label} ${optional ? "(Optional)" : ""}`}
      </InputLabel>
      <Select
        MenuProps={{ disableEnforceFocus: true }}
        id={`id-${name}`}
        name={name}
        value={value}
        labelId={`${name}-label`}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        aria-describedby={`${name}-error-text`}
        variant="standard">
        {optional && <MenuItem value="">{`Select ${label}`}</MenuItem>}
        {payload?.map((x, index) => (
          <MenuItem key={index} value={x.id}>
            <div className="flex items-center">
              {x.icon && x.icon.length > 0 && (
                <LucideIcon name={x.icon} css="text-lg text-black mr-2" />
              )}
              {x.name}
            </div>
          </MenuItem>
        ))}
      </Select>
      <FormHelperText id={`id-${name}-error-text`} variant="standard">
        {errorMessage}
      </FormHelperText>
    </FormControl>
  );
}
