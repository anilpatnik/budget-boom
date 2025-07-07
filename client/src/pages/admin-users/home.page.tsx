import { useNavigate } from "react-router-dom";
import { IonBreadcrumb, IonBreadcrumbs } from "@ionic/react";
import { NavType } from "@/util";
import { UsersPage } from "./users.page";
import { Icon } from "@/components";

export function UsersHomePage() {
  const navigate = useNavigate();
  return (
    <>
      <IonBreadcrumbs className="ion-margin-vertical">
        <IonBreadcrumb className="cursor-pointer">
          <Icon name="caret-forward-outline" slot="separator" />
          Home
        </IonBreadcrumb>
        <IonBreadcrumb onClick={() => navigate(NavType.Users)} className="cursor-pointer">
          <Icon name="caret-forward-outline" slot="separator" />
          Users
        </IonBreadcrumb>
      </IonBreadcrumbs>
      <UsersPage />
    </>
  );
}
