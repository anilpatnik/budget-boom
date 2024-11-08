import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IonBreadcrumb, IonBreadcrumbs, IonIcon } from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import { LazyLoading } from "@/components";
import { NavType, PageType, CrudType } from "@/util";
import { IExpense, Expense } from "@/models";
import { ExpensePage } from "./expense.page";
import { ExpensesPage } from "./expenses.page";

type expenseState = {
  pageType: PageType;
  expense?: IExpense;
};
const expenseStateInit: expenseState = {
  pageType: PageType.Default,
  expense: Expense
};
export function ExpensesHomePage() {
  const [expenseState, setExpenseState] = useState(expenseStateInit);
  const navigate = useNavigate();
  const handleClick = (pageType: PageType, expense?: IExpense) => {
    if (pageType === PageType.Default) {
      setExpenseState(prev => ({ ...prev, pageType, expense: Expense }));
    } else {
      setExpenseState(prev => ({ ...prev, pageType, expense }));
    }
  };
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
        {expenseState.expense?.type !== CrudType.Read && (
          <IonBreadcrumb>
            <IonIcon slot="separator" /> {expenseState.expense?.id || "New Expense"}
          </IonBreadcrumb>
        )}
      </IonBreadcrumbs>
      {expenseState.pageType === PageType.Step1 && (
        <LazyLoading>
          <ExpensePage expense={expenseState.expense} handleClick={handleClick} />
        </LazyLoading>
      )}
      {expenseState.pageType === PageType.Default && <ExpensesPage handleClick={handleClick} />}
    </>
  );
}
