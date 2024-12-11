import { useNavigate } from "react-router-dom";
import { IonBreadcrumb, IonBreadcrumbs } from "@ionic/react";
import { NavType } from "@/util";
import { ExpensesPage } from "./expenses.page";
import { Icon } from "@/components";

export function ExpensesHomePage() {
  const navigate = useNavigate();
  return (
    <>
      <IonBreadcrumbs className="ion-margin-vertical">
        <IonBreadcrumb onClick={() => navigate(NavType.Root)} className="cursor-pointer">
          <Icon name="caret-forward-outline" slot="separator" />
          Home
        </IonBreadcrumb>
        <IonBreadcrumb onClick={() => navigate(NavType.Expenses)} className="cursor-pointer">
          <Icon name="caret-forward-outline" slot="separator" />
          Expenses
        </IonBreadcrumb>
      </IonBreadcrumbs>
      <ExpensesPage />
    </>
  );
}
