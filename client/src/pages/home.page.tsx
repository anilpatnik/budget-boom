import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonLabel,
  IonRow
} from "@ionic/react";
import { constants, NavType, RoleType } from "@/util";
import { useStore } from "@/contexts";

export function RootPage() {
  const hasMounted = useRef(false);
  const { user } = useStore();
  const navigate = useNavigate();
  // const isFetching = useRef(false);
  /*
  const fetchData = async () => {
    try {
      // request is already in progress
      if (isFetching.current) return;
      // prevent another request
      isFetching.current = true;
      const projects = await getAllProjectsAsync();
      setProjects(projects);
    } catch (error) {
      const err = error as Error;
      // console.log("initial fetch", err.message);
    } finally {
      setTimeout(() => {
        // reset to allow new request
        isFetching.current = false;
        navigate(NavType.Profile);
      }, constants.DELAY);
    }
  };
  */
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    // fetchData();
    if (user.auth && user.role === RoleType.Admin) {
      setTimeout(() => navigate(NavType.Profile), constants.DELAY);
    }
    if (user.auth) {
      setTimeout(() => navigate(NavType.Expenses), constants.DELAY);
    }
  }, []);
  return (
    <IonGrid>
      <IonRow className="ion-hide-md-down text-center">
        <IonCol>
          <img alt={String.empty} src={constants.LOGO_IMG} loading="lazy" />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Track and Manage Your Expenses with Ease</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              Effortlessly manage your daily expenses when using multiple cards or cash
              transactions. Organize and track your spending by category (daily, weekly, monthly or
              yearly) to gain better insights into your financial habits. Set and monitor budgets
              for specific projects like holidays, home maintenance, parties or any other goal to
              ensure efficient budgeting. Easily associate income or expense items with categories,
              simplifying self submission for year end tax filings. Customize your experience by
              selecting your country in your profile to view and manage your finances in your local
              currency
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>
                How it works? click the <IonLabel className="font-bold">DEMO</IonLabel> button
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <img
                  alt={String.empty}
                  src={constants.DEMO_1}
                  className="step1 w-21 h-21 object-cover"
                />
                <img
                  alt={String.empty}
                  src={constants.DEMO_2}
                  className="step2 w-21 h-21 object-cover"
                />
                <img
                  alt={String.empty}
                  src={constants.DEMO_3}
                  className="step3 w-21 h-21 object-cover"
                />
                <img
                  alt={String.empty}
                  src={constants.DEMO_4}
                  className="step4 w-21 h-21 object-cover"
                />
                <img
                  alt={String.empty}
                  src={constants.DEMO_5}
                  className="step5 w-21 h-21 object-cover"
                />
                <img
                  alt={String.empty}
                  src={constants.DEMO_6}
                  className="step6 w-21 h-21 object-cover"
                />
              </div>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
