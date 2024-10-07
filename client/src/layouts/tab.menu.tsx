import { useNavigate } from "react-router-dom";
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import {
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
    navigate(NavType.RootUrl);
  };
  return (
    <IonTabs>
      {children}
      <IonTabBar className="ion-hide-md-up" slot="bottom">
        {/* Login */}
        {!user.auth && (
          <IonTabButton tab="login" href={NavType.SignInUrl}>
            <IonIcon icon={lockOpenOutline} />
            <IonLabel>Login</IonLabel>
          </IonTabButton>
        )}
        {/* Users */}
        {user.auth && user?.role === RoleType.Admin && (
          <IonTabButton tab="users" href={NavType.UsersUrl}>
            <IonIcon icon={peopleOutline} />
            <IonLabel>Users</IonLabel>
          </IonTabButton>
        )}
        {/* Projects */}
        {user.auth && (
          <IonTabButton tab="projects" href={NavType.ProjectsUrl}>
            <IonIcon icon={libraryOutline} />
            <IonLabel>Projects</IonLabel>
          </IonTabButton>
        )}
        {/* Profile */}
        {user.auth && (
          <IonTabButton tab="myprofile" href={NavType.ProfileUrl}>
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
