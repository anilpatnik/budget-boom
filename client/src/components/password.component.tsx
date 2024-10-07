import { useState } from "react";
import { IonIcon } from "@ionic/react";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { IconButton, InputAdornment, TextField } from "@mui/material";

type ComponentProps = {
  name?: string;
  value?: string;
  label?: string;
  autoComplete?: string;
  touched?: boolean;
  errorMessage?: string;
  handleChange?: (e: any) => void;
  handleBlur?: (e: any) => void;
};
export function PasswordComponent({
  name,
  value,
  label,
  autoComplete = "off",
  touched,
  errorMessage,
  handleChange,
  handleBlur
}: ComponentProps) {
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
      InputLabelProps={{ shrink: true }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
              {showPassword ? (
                <IonIcon slot="start" icon={eyeOffOutline} />
              ) : (
                <IonIcon slot="start" icon={eyeOutline} />
              )}
            </IconButton>
          </InputAdornment>
        )
      }}
      error={touched && Boolean(errorMessage)}
      helperText={touched && errorMessage}
      sx={{ input: { fontSize: "0.975em", letterSpacing: "0.075em" } }}
    />
  );
}
