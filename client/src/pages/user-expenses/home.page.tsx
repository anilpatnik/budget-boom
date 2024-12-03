import { useNavigate } from "react-router-dom";
import { IonBreadcrumb, IonBreadcrumbs, IonIcon } from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import { NavType } from "@/util";
import { ExpensesPage } from "./expenses.page";

export function ExpensesHomePage() {
  const navigate = useNavigate();
  return (
    <>
      <IonBreadcrumbs className="ion-margin-vertical">
        <IonBreadcrumb onClick={() => navigate(NavType.Root)} className="cursor-pointer">
          <IonIcon slot="separator" icon={caretForwardOutline} />
          Home
        </IonBreadcrumb>
        <IonBreadcrumb
          onClick={() => navigate(`${NavType.Expenses}${NavType.NotFound}`)}
          className="cursor-pointer">
          <IonIcon slot="separator" icon={caretForwardOutline} />
          Expenses
        </IonBreadcrumb>
      </IonBreadcrumbs>
      <ExpensesPage />
    </>
  );
}
