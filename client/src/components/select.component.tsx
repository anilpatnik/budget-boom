import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { Icon } from "./icon.component";

type Payload = {
  id?: string;
  name?: string;
  code?: string;
  icon?: string;
};
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
  payload: Payload[];
};
export function SelectComponent({
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
}: ComponentProps) {
  return (
    <FormControl error={touched && Boolean(errorMessage)} fullWidth>
      <InputLabel id={`id-${name}-label`} shrink={true} variant="standard">
        {`${label} ${optional ? "(Optional)" : ""}`}
      </InputLabel>
      <Select
        sx={{ fontSize: "0.975em", letterSpacing: "0.075em" }}
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
              {x.icon && x.icon.length > 0 && <Icon name={x.icon} css="mr-2" />}
              {x.code && x.code.length > 0 ? `${x.name}, ${x.code}` : x.name}
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
