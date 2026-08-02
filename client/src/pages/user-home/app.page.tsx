import { RouterProvider } from "react-router-dom";
import { IonApp } from "@ionic/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { router } from "@/layouts";

export function AppPage() {
  return (
    <ThemeProvider theme={createTheme({ typography: { fontFamily: "revert" } })}>
      <IonApp>
        <RouterProvider router={router} />
      </IonApp>
    </ThemeProvider>
  );
}
