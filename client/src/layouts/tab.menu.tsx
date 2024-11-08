import { useNavigate } from "react-router-dom";
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import {
  cashOutline,
  gridOutline,
  libraryOutline,
  lockClosedOutline,
  lockOpenOutline,
  peopleOutline,
  personOutline
} from "ionicons/icons";
import { NavType, RoleType, fb } from "@/util";
import { useStore } from "@/contexts";
import { User } from "@/models";

export function TabMenu({ children }: { children: any }) {
  const { user, setAuth } = useStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    sessionStorage.clear();
    localStorage.clear();
    setAuth({ ...User });
    await fb.fSignOut();
    navigate(NavType.Root);
  };
  return (
    <IonTabs>
      {children}
      <IonTabBar className="ion-hide-md-up" slot="bottom">
        {/* Login */}
        {!user.auth && (
          <IonTabButton tab="login" href={NavType.SignIn}>
            <IonIcon icon={lockOpenOutline} />
            <IonLabel>Login</IonLabel>
          </IonTabButton>
        )}
        {/* Users */}
        {user.auth && user?.role === RoleType.Admin && (
          <IonTabButton tab="users" href={NavType.Users}>
            <IonIcon icon={peopleOutline} />
            <IonLabel>Users</IonLabel>
          </IonTabButton>
        )}
        {/* Categories */}
        {user.auth && user?.role === RoleType.Admin && (
          <IonTabButton tab="categories" href={NavType.Categories}>
            <IonIcon icon={gridOutline} />
            <IonLabel>Categories</IonLabel>
          </IonTabButton>
        )}
        {/* Projects */}
        {user.auth && user?.role === RoleType.User && (
          <IonTabButton tab="expenses" href={NavType.Expenses}>
            <IonIcon icon={cashOutline} />
            <IonLabel>Expenses</IonLabel>
          </IonTabButton>
        )}
        {/* Projects */}
        {user.auth && user?.role === RoleType.User && (
          <IonTabButton tab="projects" href={NavType.Projects}>
            <IonIcon icon={libraryOutline} />
            <IonLabel>Projects</IonLabel>
          </IonTabButton>
        )}
        {/* Profile */}
        {user.auth && (
          <IonTabButton tab="myprofile" href={NavType.Profile}>
            <IonIcon icon={personOutline} />
            <IonLabel>My Profile</IonLabel>
          </IonTabButton>
        )}
        {user.auth && (
          <IonTabButton tab="logout" onClick={handleLogout}>
            <IonIcon icon={lockClosedOutline} />
            <IonLabel>Logout</IonLabel>
          </IonTabButton>
        )}
      </IonTabBar>
    </IonTabs>
  );
}
