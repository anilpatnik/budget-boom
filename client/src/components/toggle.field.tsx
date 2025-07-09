import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
  ToggleButtonProps
} from "@mui/material";

type Props = {
  name?: string;
  value?: boolean;
  trueLabel?: string;
  falseLabel?: string;
  handleChange?: (e: any, value: boolean) => void;
  exclusive?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  color?: ToggleButtonGroupProps["color"];
  size?: ToggleButtonProps["size"];
};
export function ToggleField({
  name,
  value,
  trueLabel = "Yes",
  falseLabel = "No",
  handleChange,
  exclusive = true,
  fullWidth = true,
  disabled = false,
  color = "primary",
  size = "small"
}: Props) {
  return (
    <ToggleButtonGroup
      id={`id-${name}`}
      value={value}
      onChange={handleChange}
      exclusive={exclusive}
      fullWidth={fullWidth}
      disabled={disabled}
      color={color}
      size={size}>
      <ToggleButton value={true}>{trueLabel}</ToggleButton>
      <ToggleButton value={false}>{falseLabel}</ToggleButton>
    </ToggleButtonGroup>
  );
}
