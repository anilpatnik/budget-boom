import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import {
  barChartOutline,
  cashOutline,
  libraryOutline,
  lockClosedOutline,
  peopleOutline,
  personOutline
} from "ionicons/icons";
import { NavType, RoleType } from "@/util";
import { useStore } from "@/contexts";

export function TabMenu({ children }: { children: any }) {
  const { user } = useStore();
  return (
    <IonTabs>
      {children}
      {user.auth && (
        <IonTabBar className="ion-hide-md-up" slot="bottom">
          {/* Users */}
          {user?.role === RoleType.Admin && (
            <IonTabButton tab="users" href={NavType.Users}>
              <IonIcon icon={peopleOutline} />
              <IonLabel>Users</IonLabel>
            </IonTabButton>
          )}
          {/* Expenses */}
          {user?.role === RoleType.User && (
            <IonTabButton tab="expenses" href={NavType.Expenses}>
              <IonIcon icon={cashOutline} />
              <IonLabel>Expenses</IonLabel>
            </IonTabButton>
          )}
          {/* Projects */}
          {user?.role === RoleType.User && (
            <IonTabButton tab="projects" href={NavType.Projects}>
              <IonIcon icon={libraryOutline} />
              <IonLabel>Projects</IonLabel>
            </IonTabButton>
          )}
          {/* Report */}
          {user?.role === RoleType.User && (
            <IonTabButton tab="report" href={NavType.Report}>
              <IonIcon icon={barChartOutline} />
              <IonLabel>Report</IonLabel>
            </IonTabButton>
          )}
          {/* Profile */}
          <IonTabButton tab="myprofile" href={NavType.Profile}>
            <IonIcon icon={personOutline} />
            <IonLabel>My Profile</IonLabel>
          </IonTabButton>
          <IonTabButton tab="logout" href={NavType.SignOut}>
            <IonIcon icon={lockClosedOutline} />
            <IonLabel>Logout</IonLabel>
          </IonTabButton>
        </IonTabBar>
      )}
    </IonTabs>
  );
}
