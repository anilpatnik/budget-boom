import { RouterProvider } from "react-router-dom";
import { IonApp, IonSpinner } from "@ionic/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { constants } from "./util";
import { router } from "./layouts/navigation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: constants.TWENTY_FOUR_HOURS_IN_MS
    }
  }
});

const theme = createTheme({
  typography: {
    fontFamily: "Segoe UI"
  }
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <IonApp>
          <RouterProvider
            router={router}
            fallbackElement={
              <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>
            }
          />
        </IonApp>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
