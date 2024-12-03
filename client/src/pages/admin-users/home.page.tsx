import { useNavigate } from "react-router-dom";
import { IonBreadcrumb, IonBreadcrumbs, IonIcon } from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import { NavType } from "@/util";
import { UsersPage } from "./users.page";

export function UsersHomePage() {
  const navigate = useNavigate();
  return (
    <>
      <IonBreadcrumbs className="ion-margin-vertical">
        <IonBreadcrumb onClick={() => navigate(NavType.Root)} className="cursor-pointer">
          <IonIcon slot="separator" icon={caretForwardOutline} />
          Home
        </IonBreadcrumb>
        <IonBreadcrumb onClick={() => navigate(NavType.Users)} className="cursor-pointer">
          <IonIcon slot="separator" icon={caretForwardOutline} />
          Users
        </IonBreadcrumb>
      </IonBreadcrumbs>
      <UsersPage />
    </>
  );
}
