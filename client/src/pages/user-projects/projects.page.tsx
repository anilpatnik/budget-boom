import { useRef, useState, useEffect, Fragment } from "react";
import { IonButton, IonFabButton, IonSpinner, useIonAlert, useIonModal } from "@ionic/react";
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
import { constants, helper, dateHelper } from "@/utils";
import { CrudType } from "@/utils/enums";
import { IProject, Project } from "@/models";
import { projectService } from "@/services";
import { Icon, ProgressField } from "@/components";
import { useStore } from "@/contexts";
import { ProjectPage } from "./project.page";

export function ProjectsPage() {
  const { user } = useStore();
  const hasMounted = useRef(false);
  const [records, setRecords] = useState<IProject[]>([]);
  const [record, setRecord] = useState<IProject>(Project);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInit, setLoadingInit] = useState<boolean>(false);
  const [loadingCol, setLoadingCol] = useState<string>(String.empty);
  const [presentAlert] = useIonAlert();

  const fetchData = async (page: number = 0) => {
    if (loading) return;
    if (page === 0) setLoadingInit(true);
    else setLoading(true);
    try {
      const response = await projectService.getProjectsAsync(page, constants.PAGE_SIZE);
      setRecords(prev => [...prev, ...(response?.data ?? [])]);
      setTotal(response?.count ?? 0);
    } catch (error) {
      console.error("error fetching data:", error);
    } finally {
      if (page === 0) setLoadingInit(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    fetchData();
  }, []);

  const loadMore = () => {
    if (records.length < total) {
      setTimeout(() => fetchData(records.length), constants.DELAY);
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
      setTimeout(dismissModal, constants.DELAY);
    },
    handleEdit: (item?: any) => {
      editRecord(item);
      setTimeout(dismissModal, constants.DELAY);
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
    }, constants.DELAY);
  };
  const handleDelete = async (id: string, col?: string) => {
    const colId = `${id}-${col}`;
    setLoadingCol(colId);
    const res = await projectService.deleteProjectAsync(id);
    if (res && !res?.success) {
      helper.toastify(res?.resource, constants.ERROR, constants.FAILURE_DELAY);
      setLoadingCol(String.empty);
      return;
    } else {
      helper.toastify("Deleted Successfully", constants.SUCCESS, constants.SUCCESS_DELAY);
      setTimeout(() => {
        deleteRecord(id);
        setLoadingCol(String.empty);
      }, constants.DELAY);
    }
  };

  if (loadingInit)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: { xs: window.innerHeight - 212, sm: 600 } }}
      className="tableContainer">
      <Table className="styled-table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Name
            </TableCell>
            <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Budget
            </TableCell>
            <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Actual
            </TableCell>
            <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Start Date
            </TableCell>
            <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
              End Date
            </TableCell>
            <TableCell
              align="left"
              sx={{
                display: { xs: "table-cell", sm: "none" },
                maxWidth: 0,
                padding: "0px !important"
              }}></TableCell>
            <TableCell align="left" sx={{ display: { xs: "table-cell", sm: "none" } }}></TableCell>
            <TableCell align="left">
              <Box className="flex items-center">
                {constants.PROJECTS_MAX > records.length && (
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
            <Fragment key={index}>
              <TableRow>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {item?.inactive ? <div className="text-red-700">{item?.name}</div> : item?.name}
                </TableCell>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  <Box className="text-indigo-700 font-bold">
                    {helper.formatPrice(item.budget ?? 0, user?.countryId, user?.currency)}
                  </Box>
                </TableCell>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  <Box className="text-cyan-700 font-bold">
                    {helper.formatPrice(item.actual ?? 0, user?.countryId, user?.currency)}
                  </Box>
                </TableCell>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {item?.startDate ? dateHelper.dateFormat(item.startDate) : String.empty}
                </TableCell>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {item?.endDate ? dateHelper.dateFormat(item.endDate) : String.empty}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: { xs: "table-cell", sm: "none" },
                    maxWidth: 0,
                    padding: "0px !important"
                  }}
                  rowSpan={2}></TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: { xs: "table-cell", sm: "none" },
                    borderBottom: "none",
                    borderTop: "none"
                  }}>
                  <div className={`font-bold ${item?.inactive && "text-red-700"}`}>
                    {item?.name}
                  </div>
                </TableCell>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
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
                <TableCell
                  align="left"
                  sx={{
                    display: { xs: "table-cell", sm: "none" },
                    borderBottom: "none",
                    borderTop: "none"
                  }}>
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
              <TableRow sx={{ display: { xs: "table-row", sm: "none" } }}>
                <TableCell colSpan={2}>
                  <ProgressField
                    payload={{
                      startdate: item?.startDate,
                      endate: item?.endDate,
                      actual: Math.abs(item?.actual || 0),
                      budget: item?.budget,
                      countryId: user?.countryId,
                      currency: user?.currency,
                      inactive: item?.inactive
                    }}
                  />
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
          {records.length < total && constants.PAGE_SIZE < total && (
            <TableRow>
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
  );
}
