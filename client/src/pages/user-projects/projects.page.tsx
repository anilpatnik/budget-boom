import { useState } from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonSpinner,
  useIonAlert,
  useIonToast
} from "@ionic/react";
import { addCircleOutline, createOutline, trashOutline } from "ionicons/icons";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { PageType, CrudType, formatddMMMyyyy } from "@/util";
import { IPaging, IProject, Project } from "@/models";
import { deleteProjectAsync, getProjectAsync, getProjectsAsync } from "@/services";
import { PagingComponent } from "@/components";

type ComponentProps = {
  handleClick: (pageType: PageType, project?: IProject) => void;
};
export function ProjectsPage({ handleClick }: ComponentProps) {
  const [payload, setPayload] = useState<IPaging>({ page: 0, size: 10 });
  const [loading, setLoading] = useState(false);
  const [paging, setPaging] = useState(false);
  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();

  const {
    isFetching,
    data: projects,
    refetch
  } = useQuery({
    queryKey: ["user-projects"],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => await getProjectsAsync(payload)
  });

  const handleEdit = async (id: string) => {
    setLoading(true);
    try {
      const project = await getProjectAsync(id);
      if (project) {
        const newProject = { ...project, type: CrudType.Update };
        handleClick(PageType.Step1, newProject);
      }
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    const res = await deleteProjectAsync(id);
    if (res && !res?.success) {
      present({
        message: res?.resource,
        color: "danger",
        duration: 5000
      });
    } else {
      present({
        message: "Deleted Successfully",
        color: "success",
        duration: 3000
      });
    }
    setTimeout(() => {
      setLoading(false);
      refetch();
    }, 200);
  };
  const handlePaging = (e: any, value: number) => {
    setPaging(true);
    setPayload(prev => ({
      ...prev,
      page: value - 1,
      skipPaging: false
    }));
    setTimeout(async () => {
      await refetch();
      setPaging(false);
    }, 1000);
  };

  if (isFetching)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <TableContainer component={Paper}>
            <Table className="styled-table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    Budget
                  </TableCell>
                  <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    Start Date
                  </TableCell>
                  <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    End Date
                  </TableCell>
                  <TableCell align="left">
                    <IonButton
                      id="id-create-button"
                      title="CREATE PROJECT"
                      size="small"
                      aria-hidden="false"
                      buttonType="icon"
                      onClick={() => {
                        const newProject = { ...Project, type: CrudType.Create };
                        handleClick(PageType.Step1, newProject);
                      }}>
                      <IonIcon icon={addCircleOutline}></IonIcon>
                    </IonButton>
                  </TableCell>
                  <TableCell align="left">
                    {loading && <IonSpinner name="lines-sharp-small"></IonSpinner>}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects?.data?.map((item, index) => (
                  <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell align="left">{item?.name}</TableCell>
                    <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      {item?.budget ? `$${item?.budget?.toFixed(2)}` : String.empty}
                    </TableCell>
                    <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      {item?.startDate ? formatddMMMyyyy(item.startDate) : String.empty}
                    </TableCell>
                    <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      {item?.endDate ? formatddMMMyyyy(item.endDate) : String.empty}
                    </TableCell>
                    <TableCell align="left">
                      <IonButton
                        id="id-edit-button"
                        title="EDIT PROJECT"
                        size="small"
                        aria-hidden="false"
                        buttonType="icon"
                        onClick={() => handleEdit(item.id || String.empty)}>
                        <IonIcon icon={createOutline}></IonIcon>
                      </IonButton>
                    </TableCell>
                    <TableCell align="left">
                      <IonButton
                        id="id-delete-button"
                        title="Delete"
                        fill="clear"
                        aria-hidden="false"
                        onClick={() =>
                          presentAlert({
                            header: "Are you sure?",
                            buttons: [
                              { text: "Cancel" },
                              {
                                text: "Confirm",
                                handler: () => {
                                  handleDelete(item?.id || String.empty);
                                }
                              }
                            ]
                          })
                        }>
                        <IonIcon color="danger" icon={trashOutline}></IonIcon>
                      </IonButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-margin-top ion-text-end">
          <PagingComponent
            count={projects?.count ?? 0}
            page={payload.page ?? 0}
            size={payload.size ?? 10}
            handlePaging={handlePaging}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
