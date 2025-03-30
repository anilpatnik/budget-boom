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
      text: `Click <b>SIGN IN</b> button if you're already a member, or <b>SIGN UP</b> using your <b>Gmail</b> or preferred email address`,
      attachTo: { element: ".step1", on: "auto" },
      buttons: [{ text: "Next", action: () => tour.next() }]
    },
    {
      id: "step2",
      title: "Manage Expenses",
      text: `
      <ul>
        <li>View your daily <span class="text-red-500 font-bold">Expenses</span> and <span class="text-green-500 font-bold">Income</span> at a glance</li>
        <li>Click <span class="text-blue-500 font-bold">Add</span> button to log a new expense or income</li>
        <li>Use <span class="text-blue-500 font-bold">Edit</span> button to correct mistakes or <span class="text-red-500 font-bold">Delete</span> button to remove entries</li>
        <li>Find specific records using <span class="text-yellow-500 font-bold">Filter</span> button to search by date range, project, and category</li>
      </ul>`,
      attachTo: { element: ".step2", on: "auto" },
      buttons: [
        { text: "Back", action: () => tour.back() },
        { text: "Next", action: () => tour.next() }
      ]
    },
    {
      id: "step3",
      title: "Create or Update Expense",
      text: `
      <ul>
        <li>Enter the transaction details in the provided input fields</li>
        <li>Toggle between Money Spent (Expense) or Money Received (Income) based on the transaction type</li>
        <li>Toggle on if the transaction is tax claimable</li>
        <li>Select if the transaction is project related otherwise, it will be a personal expense</li>
      </ul>`,
      attachTo: { element: ".step3", on: "auto" },
      buttons: [
        { text: "Back", action: () => tour.back() },
        { text: "Next", action: () => tour.next() }
      ]
    },
    {
      id: "step4",
      title: "Manage Projects",
      text: `You can create a project, set a budget, and track your spending by logging each transaction associated with the project`,
      attachTo: { element: ".step4", on: "auto" },
      buttons: [
        { text: "Back", action: () => tour.back() },
        { text: "Next", action: () => tour.next() }
      ]
    },
    {
      id: "step5",
      title: "Expense Report",
      text: `Generate a report that shows spending across each category, with the ability to filter by date range and project`,
      attachTo: { element: ".step5", on: "auto" },
      buttons: [
        { text: "Back", action: () => tour.back() },
        { text: "Next", action: () => tour.next() }
      ]
    },
    {
      id: "step6",
      title: "Manage Profile",
      text: `
      <ul>
        <li>Update your profile picture, name, and country of residence</li>
        <li>Transactions will be displayed in your selected country's currency</li>
        <li>Profile pictures cannot be updated for Gmail logins</li>
        <li>If you wish to delete your account, you can do so, which will permanently remove all your data</li>
      </ul>`,
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
