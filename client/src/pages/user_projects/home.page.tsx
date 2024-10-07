import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IonBreadcrumb, IonBreadcrumbs, IonIcon } from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import { LazyLoading } from "@/components";
import { NavType, PageType, CrudType } from "@/util";
import { IProject, Project } from "@/models";
import { ProjectPage } from "./project.page";
import { ProjectsPage } from "./projects.page";

type projectState = {
  pageType: PageType;
  project?: IProject;
};
const projectStateInit: projectState = {
  pageType: PageType.Default,
  project: Project
};
export function ProjectsHomePage() {
  const [projectState, setProjectState] = useState(projectStateInit);
  const navigate = useNavigate();
  const handleClick = (pageType: PageType, project?: IProject) => {
    if (pageType === PageType.Default) {
      setProjectState(prev => ({ ...prev, pageType, project: Project }));
    } else {
      setProjectState(prev => ({ ...prev, pageType, project }));
    }
  };
  return (
    <>
      <IonBreadcrumbs className="ion-margin-vertical">
        <IonBreadcrumb onClick={() => navigate(NavType.RootUrl)} className="cursor-pointer">
          <IonIcon slot="separator" icon={caretForwardOutline} />
          Home
        </IonBreadcrumb>
        <IonBreadcrumb
          onClick={() => navigate(`${NavType.ProjectsUrl}${NavType.NotFoundUrl}`)}
          className="cursor-pointer">
          <IonIcon slot="separator" icon={caretForwardOutline} />
          Projects
        </IonBreadcrumb>
        {projectState.project?.type !== CrudType.Read && (
          <IonBreadcrumb>
            <IonIcon slot="separator" /> {projectState.project?.name || "New Project"}
          </IonBreadcrumb>
        )}
      </IonBreadcrumbs>
      {projectState.pageType === PageType.Step1 && (
        <LazyLoading>
          <ProjectPage project={projectState.project} handleClick={handleClick} />
        </LazyLoading>
      )}
      {projectState.pageType === PageType.Default && <ProjectsPage handleClick={handleClick} />}
    </>
  );
}
