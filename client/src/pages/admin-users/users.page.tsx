import { useRef, useState, useEffect } from "react";
import {
  IonButton,
  IonCol,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonRow,
  IonSpinner,
  useIonAlert,
  useIonModal,
  useIonToast
} from "@ionic/react";
import { add, createOutline, searchOutline, trashOutline } from "ionicons/icons";
import {
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { CrudType, RoleType, newPassword, constants } from "@/util";
import { AdminUser, IAdminUser, AdminUserSearch, IAdminUserSearch } from "@/models";
import { deleteUserAsync, getUserAsync, getUsersAsync } from "@/services";
import { UserProfilePage } from "./profile.page";

export function UsersPage() {
  const hasMounted = useRef(false);
  const [records, setRecords] = useState<IAdminUser[]>([]);
  const [record, setRecord] = useState<IAdminUser>(AdminUser);
  const [payload, setPayload] = useState<IAdminUserSearch>({
    ...AdminUserSearch,
    page: 0,
    size: constants.PAGE_SIZE
  });
  const [total, setTotal] = useState<number>(0);
  const [initLoading, setInitLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();

  const fetchData = async (pageNum: number = 0) => {
    if (loading) return;
    if (pageNum === 0) setInitLoading(true);
    else setLoading(true);
    try {
      const newPayload: IAdminUserSearch = { ...payload, page: pageNum };
      const response = await getUsersAsync(newPayload);
      setRecords(prev => [...prev, ...(response?.data ?? [])]);
      setTotal(response?.count ?? 0);
    } catch (error) {
      console.error("error fetching data:", error);
    } finally {
      if (pageNum === 0) setInitLoading(false);
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
      const newPage = (payload?.page ?? 0) + 1;
      setPayload(prev => ({ ...prev, page: newPage }));
      setTimeout(() => fetchData(newPage), 200);
    }
  };

  const addRecord = (item: IAdminUser) => {
    setRecords(prev => [item, ...prev]);
    setTotal(prev => prev + 1);
  };
  const deleteRecord = (uid: string) => {
    setRecords(prev => prev.filter(x => x?.uid !== uid));
    setTotal(prev => prev - 1);
  };
  const editRecord = (item: IAdminUser) => {
    setRecords(prev => prev.map(x => (x.uid === item.uid ? item : x)));
  };

  const [presentModal, dismissModal] = useIonModal(UserProfilePage, {
    user: record,
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
  const handleOpen = async (user?: IAdminUser) => {
    setLoading(true);
    const dbUser = await getUserAsync(user?.uid || String.empty);
    const password = newPassword();
    if (dbUser) {
      const newUser = { ...dbUser, password, type: CrudType.Update };
      setRecord(newUser);
    } else {
      const newUser = { ...user, password, type: CrudType.Create };
      setRecord(newUser);
    }
    setTimeout(() => {
      presentModal({
        backdropDismiss: false,
        keyboardClose: false
        // cssClass: "desktop-modal-class"
      });
      setLoading(false);
    }, 200);
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    const res = await deleteUserAsync(id);
    if (res && !res?.success) {
      present({
        message: res?.resource,
        color: constants.DANGER,
        duration: 5000
      });
      setLoading(false);
      return;
    } else {
      present({
        message: "Deleted Successfully",
        color: constants.SUCCESS,
        duration: 3000
      });
      setTimeout(() => {
        deleteRecord(id);
        setLoading(false);
      }, 200);
    }
  };
  const handleChange = (e: any) => {
    const input = e.target.value;
    setPayload(prev => ({ ...prev, searchInput: input }));
    // set name or email
    if (input.includes("@")) setPayload(prev => ({ ...prev, searchType: 20 }));
    else setPayload(prev => ({ ...prev, searchType: 10 }));
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPayload(prev => ({ ...prev, page: 0 }));
    setTimeout(() => {
      setRecords([]);
      fetchData();
    }, 200);
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <Paper sx={{ p: "2px 4px", display: "flex", alignItems: "center" }} component="form">
            <InputBase
              sx={{
                ml: 1,
                flex: 1,
                letterSpacing: "0.075em"
              }}
              id="searchInput"
              name="searchInput"
              value={payload.searchInput}
              onChange={handleChange}
              fullWidth
              placeholder="Search with name or email"
              inputProps={{ "aria-label": "Search with name or email" }}
            />
            <IconButton aria-label="search" type="submit" onClick={handleSubmit}>
              <IonIcon slot="start" icon={searchOutline} />
            </IconButton>
          </Paper>
        </IonCol>
      </IonRow>
      {initLoading && <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>}
      {!initLoading && (
        <>
          <IonRow>
            <IonCol>
              <TableContainer component={Paper}>
                <Table className="styled-table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                        Email
                      </TableCell>
                      <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                        Role
                      </TableCell>
                      <TableCell align="left">
                        <IonFabButton
                          id="id-create-button"
                          title="ADD USER"
                          size="small"
                          onClick={() => handleOpen(AdminUser)}>
                          <IonIcon icon={add} />
                        </IonFabButton>
                      </TableCell>
                      <TableCell align="left">
                        {loading && <IonSpinner name="lines-sharp-small"></IonSpinner>}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records?.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell align="left">{item?.name}</TableCell>
                        <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                          {item?.email}
                        </TableCell>
                        <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                          {RoleType[item?.role || 10]?.replace(/([A-Z])/g, " $1")?.trim()}
                        </TableCell>
                        <TableCell align="left">
                          <IonButton
                            id="id-edit-button"
                            title="EDIT USER"
                            size="small"
                            buttonType="icon"
                            onClick={() => handleOpen(item)}>
                            <IonIcon icon={createOutline}></IonIcon>
                          </IonButton>
                        </TableCell>
                        <TableCell align="left">
                          <IonButton
                            id="id-delete-button"
                            title="DELETE USER"
                            fill="clear"
                            onClick={() =>
                              presentAlert({
                                header: "Are you sure?",
                                buttons: [
                                  { text: "Cancel" },
                                  {
                                    text: "Confirm",
                                    handler: () => {
                                      handleDelete(item?.uid || String.empty);
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
          {records?.length < total && (
            <IonRow>
              <IonCol className="flex items-center justify-center my-2">
                <IonButton size="small" disabled={loading} onClick={loadMore}>
                  {loading ? "Loading..." : "Load More"}
                </IonButton>
              </IonCol>
            </IonRow>
          )}
        </>
      )}
    </IonGrid>
  );
}
