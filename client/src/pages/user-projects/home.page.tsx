import { useNavigate } from "react-router-dom";
import { IonBreadcrumb, IonBreadcrumbs } from "@ionic/react";
import { NavType } from "@/utils/enums";
import { Icon } from "@/components";
import { ProjectsPage } from "./projects.page";

export function ProjectsHomePage() {
  const navigate = useNavigate();
  return (
    <>
      <IonBreadcrumbs className="ion-margin-vertical">
        <IonBreadcrumb className="cursor-pointer">
          <Icon name="caret-forward-outline" slot="separator" />
          Home
        </IonBreadcrumb>
        <IonBreadcrumb onClick={() => navigate(NavType.Projects)} className="cursor-pointer">
          <Icon name="caret-forward-outline" slot="separator" />
          Projects
        </IonBreadcrumb>
      </IonBreadcrumbs>
      <ProjectsPage />
    </>
  );
}
