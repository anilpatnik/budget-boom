import { useLocation, useNavigate } from "react-router-dom";
import { IonBreadcrumb, IonBreadcrumbs } from "@ionic/react";
import { NavType } from "@/utils/enums";
import { Icon } from "@/components";
import { ExpensesPage } from "./expenses.page";
import { ExpenseReportPage } from "./report.page";

export function ExpensesHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <IonBreadcrumbs className="ion-margin-vertical">
        <IonBreadcrumb className="cursor-pointer">
          <Icon name="caret-forward-outline" slot="separator" />
          Home
        </IonBreadcrumb>
        <IonBreadcrumb onClick={() => navigate(NavType.Expenses)} className="cursor-pointer">
          <Icon name="caret-forward-outline" slot="separator" />
          Expenses
        </IonBreadcrumb>
        {location.pathname === NavType.Report && (
          <IonBreadcrumb className="cursor-pointer">
            <Icon name="caret-forward-outline" slot="separator" />
            Report
          </IonBreadcrumb>
        )}
      </IonBreadcrumbs>
      {location.pathname === NavType.Expenses && <ExpensesPage />}
      {location.pathname === NavType.Report && <ExpenseReportPage />}
    </>
  );
}
