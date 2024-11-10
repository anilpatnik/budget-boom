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
  pageNum?: number;
  project?: IProject;
  navBack?: boolean;
};
const projectStateInit: projectState = {
  pageType: PageType.Default,
  pageNum: 0,
  project: Project,
  navBack: false
};
export function ProjectsHomePage() {
  const [projectState, setProjectState] = useState(projectStateInit);
  const navigate = useNavigate();
  const handleClick = (
    pageType: PageType,
    pageNum?: number,
    project?: IProject,
    navBack?: boolean
  ) => {
    if (pageType === PageType.Default) {
      setProjectState(prev => ({ ...prev, pageType, pageNum, project: Project, navBack }));
    } else {
      setProjectState(prev => ({ ...prev, pageType, pageNum, project, navBack }));
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
          onClick={() => navigate(`${NavType.Projects}${NavType.NotFound}`)}
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
          <ProjectPage
            project={projectState.project}
            handleClick={handleClick}
            pageNum={projectState.pageNum}
          />
        </LazyLoading>
      )}
      {projectState.pageType === PageType.Default && (
        <ProjectsPage
          handleClick={handleClick}
          pageNum={projectState.pageNum}
          navBack={projectState.navBack}
        />
      )}
    </>
  );
}
