import { createContext, useContext } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { laptopOutline } from "ionicons/icons";

import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

type ContextProps = {
  Shepherd: typeof Shepherd;
};
const ShepherdContext = createContext({} as ContextProps);
const ShepherdProvider = ({ children }: any) => {
  return <ShepherdContext.Provider value={{ Shepherd }}>{children}</ShepherdContext.Provider>;
};
const useShepherd = () => useContext(ShepherdContext);
export { ShepherdProvider, useShepherd };

export function ShepherdDemo() {
  const { Shepherd } = useShepherd();
  const tourOptions: Shepherd.TourOptions = {
    useModalOverlay: true,
    defaultStepOptions: { scrollTo: true }
  };
  const tour = new Shepherd.Tour({ ...tourOptions });
  const steps: Shepherd.StepOptions[] = [
    {
      id: "step1",
      title: "Login",
      text: "Click the <b>SIGN IN</b> button if you're already a member, or <b>SIGN UP</b> using your <b>Gmail</b> or preferred email address.",
      attachTo: { element: ".step1", on: "auto" },
      buttons: [{ text: "Next", action: () => tour.next() }]
    },
    {
      id: "step2",
      title: "Manage Expenses",
      text: "Welcome to the demo page!",
      attachTo: { element: ".step2", on: "auto" },
      buttons: [
        { text: "Back", action: () => tour.back() },
        { text: "Next", action: () => tour.next() }
      ]
    },
    {
      id: "step3",
      title: "Create or Update Expense",
      text: "Welcome to the demo page!",
      attachTo: { element: ".step3", on: "auto" },
      buttons: [
        { text: "Back", action: () => tour.back() },
        { text: "Next", action: () => tour.next() }
      ]
    },
    {
      id: "step4",
      title: "Manage Projects",
      text: "Welcome to the demo page!",
      attachTo: { element: ".step4", on: "auto" },
      buttons: [
        { text: "Back", action: () => tour.back() },
        { text: "Next", action: () => tour.next() }
      ]
    },
    {
      id: "step5",
      title: "Expense Report",
      text: "Welcome to the demo page!",
      attachTo: { element: ".step5", on: "auto" },
      buttons: [
        { text: "Back", action: () => tour.back() },
        { text: "Next", action: () => tour.next() }
      ]
    },
    {
      id: "step6",
      title: "Manage Profile",
      text: "Welcome to the demo page!",
      attachTo: { element: ".step6", on: "auto" },
      buttons: [
        { text: "Back", action: () => tour.back() },
        { text: "Finish", action: () => tour.complete() }
      ]
    }
  ];
  tour.addSteps(steps);
  return (
    <IonButton id="id-logoff-menu" size="small" onClick={tour.start}>
      <IonIcon icon={laptopOutline} className="mr-2" /> Demo
    </IonButton>
  );
}
