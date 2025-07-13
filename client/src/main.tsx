import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { setupIonicReact } from "@ionic/react";
import { AppPage } from "@/pages";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/* Custom styles */
import "./index.css";

setupIonicReact({ mode: "md" }); // Ionic

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AppPage />
  </StrictMode>
);
