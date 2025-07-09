import { useNavigate } from "react-router-dom";
import { IonBreadcrumb, IonBreadcrumbs } from "@ionic/react";
import { NavType } from "@/utils/enums";
import { Icon } from "@/components";
import { UsersPage } from "./users.page";

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
