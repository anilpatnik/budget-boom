import { useRef, useState, useEffect } from "react";
import {
  IonButton,
  IonFabButton,
  IonSpinner,
  useIonAlert,
  useIonModal,
  useIonToast
} from "@ionic/react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { CrudType, dateFormat, constants } from "@/util";
import { IProject, Project } from "@/models";
import { deleteProjectAsync, getProjectsAsync } from "@/services";
import { ProjectPage } from "./project.page";
import { Icon } from "@/components";

export function ProjectsPage() {
  const hasMounted = useRef(false);
  const [records, setRecords] = useState<IProject[]>([]);
  const [record, setRecord] = useState<IProject>(Project);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInit, setLoadingInit] = useState<boolean>(false);
  const [loadingCol, setLoadingCol] = useState<string>(String.empty);
  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();

  const fetchData = async (pageNum: number = 0) => {
    if (loading) return;
    if (pageNum === 0) setLoadingInit(true);
    else setLoading(true);
    try {
      const response = await getProjectsAsync(pageNum, constants.PAGE_SIZE);
      setRecords(prev => [...prev, ...(response?.data ?? [])]);
      setTotal(response?.count ?? 0);
    } catch (error) {
      console.error("error fetching data:", error);
    } finally {
      if (pageNum === 0) setLoadingInit(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    fetchData();
  }, []);

  const loadMore = () => {
    if (records?.length < total) {
      const newPage = page + 1;
      setPage(newPage);
      setTimeout(() => fetchData(newPage), 200);
    }
  };

  const addRecord = (item: IProject) => {
    setRecords(prev => [item, ...prev]);
    setTotal(prev => prev + 1);
  };
  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(x => x?.id !== id));
    setTotal(prev => prev - 1);
  };
  const editRecord = (item: IProject) => {
    setRecords(prev => prev.map(x => (x.id === item.id ? item : x)));
  };

  const [presentModal, dismissModal] = useIonModal(ProjectPage, {
    project: record,
    handleClose: () => dismissModal(),
    handleNew: (item?: any) => {
      addRecord(item);
      setTimeout(dismissModal, 200);
    },
    handleEdit: (item?: any) => {
      editRecord(item);
      setTimeout(dismissModal, 200);
    }
  });
  const handleOpen = (project?: IProject, col?: string) => {
    const colId = `${project?.id}-${col}`;
    setLoadingCol(colId);
    const newProject = { ...project, type: project?.id ? CrudType.Update : CrudType.Create };
    setRecord(newProject);
    setTimeout(() => {
      presentModal({
        backdropDismiss: false,
        keyboardClose: false
        // cssClass: "desktop-modal-class"
      });
      setLoadingCol(String.empty);
    }, 200);
  };
  const handleDelete = async (id: string, col?: string) => {
    const colId = `${id}-${col}`;
    setLoadingCol(colId);
    const res = await deleteProjectAsync(id);
    if (res && !res?.success) {
      present({
        message: res?.resource,
        color: constants.DANGER,
        duration: 5000
      });
      setLoadingCol(String.empty);
      return;
    } else {
      present({
        message: "Deleted Successfully",
        color: constants.SUCCESS,
        duration: 3000
      });
      setTimeout(() => {
        deleteRecord(id);
        setLoadingCol(String.empty);
      }, 200);
    }
  };

  if (loadingInit)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;

  return (
    <Box className="px-2">
      <TableContainer
        component={Paper}
        sx={{ maxHeight: { xs: 650, sm: 600 } }}
        className="tableContainer">
        <Table className="styled-table" stickyHeader>
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
                <Box className="flex items-center">
                  {constants.PROJECTS_MAX > records?.length && (
                    <IonFabButton
                      id="id-create-button"
                      title="ADD PROJECT"
                      size="small"
                      onClick={() => handleOpen(Project)}>
                      <Icon name="add" />
                    </IonFabButton>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records?.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="left">{item?.name}</TableCell>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {item?.budget ? `$${item?.budget?.toFixed(2)}` : String.empty}
                </TableCell>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {item?.startDate ? dateFormat(item.startDate) : String.empty}
                </TableCell>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {item?.endDate ? dateFormat(item.endDate) : String.empty}
                </TableCell>
                <TableCell align="left">
                  <Box className="flex items-center">
                    <IonButton
                      id="id-edit-button"
                      title="EDIT PROJECT"
                      size="small"
                      buttonType="icon"
                      onClick={() => handleOpen(item, "EDIT")}>
                      {loadingCol === `${item?.id}-EDIT` ? (
                        <Icon name="sync-sharp" css="text-xl text-blue-500 icon-spinner" />
                      ) : (
                        <Icon name="card-sharp" css="text-xl text-blue-500" />
                      )}
                    </IonButton>
                    <IonButton
                      id="id-delete-button"
                      title="DELETE PROJECT"
                      fill="clear"
                      onClick={() =>
                        presentAlert({
                          header: "Are you sure?",
                          buttons: [
                            { text: "Cancel" },
                            {
                              text: "Confirm",
                              handler: () => {
                                handleDelete(item?.id || String.empty, "DELETE");
                              }
                            }
                          ]
                        })
                      }>
                      {loadingCol === `${item?.id}-DELETE` ? (
                        <Icon name="sync-sharp" css="text-xl text-red-500 icon-spinner" />
                      ) : (
                        <Icon name="trash-bin-sharp" css="text-xl text-red-500" />
                      )}
                    </IonButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {records?.length < constants.PROJECTS_MAX && records?.length < total && (
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell colSpan={5}>
                  <IonButton size="small" disabled={loading} onClick={loadMore} className="my-3">
                    {loading ? "Loading..." : "Load More"}
                  </IonButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
