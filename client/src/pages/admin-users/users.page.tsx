import { useRef, useState, useEffect } from "react";
import {
  IonButton,
  IonCol,
  IonFabButton,
  IonGrid,
  IonRow,
  IonSpinner,
  useIonAlert,
  useIonModal
} from "@ionic/react";
import {
  Box,
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
import { constants, helper } from "@/utils";
import { CrudType, RoleType, SearchType } from "@/utils/enums";
import { AdminUser, IAdminUser, AdminUserSearch, IAdminUserSearch } from "@/models";
import { userService } from "@/services";
import { Icon } from "@/components";
import { UserProfilePage } from "./profile.page";

export function UsersPage() {
  const hasMounted = useRef(false);
  const [records, setRecords] = useState<IAdminUser[]>([]);
  const [record, setRecord] = useState<IAdminUser>(AdminUser);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInit, setLoadingInit] = useState<boolean>(false);
  const [loadingCol, setLoadingCol] = useState<string>(String.empty);
  const [payload, setPayload] = useState<IAdminUserSearch>({
    ...AdminUserSearch,
    page: 0,
    size: constants.PAGE_SIZE
  });
  const queryRef = useRef(payload);
  const [presentAlert] = useIonAlert();

  const fetchData = async () => {
    if (loading) return;
    if (queryRef.current.page === 0) setLoadingInit(true);
    else setLoading(true);
    try {
      const response = await userService.getUsersAsync(queryRef.current);
      setRecords(prev => [...prev, ...(response?.data ?? [])]);
      setTotal(response?.count ?? 0);
    } catch (error) {
      console.error("error fetching data:", error);
    } finally {
      if (queryRef.current.page === 0) setLoadingInit(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    fetchData();
  }, []);

  useEffect(() => {
    queryRef.current = payload;
  }, [payload]);

  const loadMore = () => {
    if (records.length < total) {
      setPayload(prev => ({ ...prev, page: records.length }));
      setTimeout(() => fetchData(), constants.DELAY);
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
      setTimeout(dismissModal, constants.DELAY);
    },
    handleEdit: (item?: any) => {
      editRecord(item);
      setTimeout(dismissModal, constants.DELAY);
    }
  });
  const handleOpen = async (user?: IAdminUser, col?: string) => {
    const colId = `${user?.uid}-${col}`;
    setLoadingCol(colId);
    const dbUser = await userService.getUserAsync(user?.uid || String.empty);
    const password = helper.newPassword();
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
      setLoadingCol(String.empty);
    }, constants.DELAY);
  };
  const handleDelete = async (id: string, col?: string) => {
    const colId = `${id}-${col}`;
    setLoadingCol(colId);
    const res = await userService.deleteUserAsync(id);
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
  const handleChange = (e: any) => {
    const input = e.target.value;
    setPayload(prev => ({ ...prev, searchInput: input }));
    // set name or email
    if (input.includes("@")) setPayload(prev => ({ ...prev, searchType: SearchType.Email }));
    else setPayload(prev => ({ ...prev, searchType: SearchType.Name }));
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPayload(prev => ({ ...prev, page: 0 }));
    setTimeout(() => {
      setRecords([]);
      fetchData();
    }, constants.DELAY);
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
              <Icon name="search-circle-sharp" css="text-3xl" />
            </IconButton>
          </Paper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: { xs: window.innerHeight - 212, sm: 600 } }}
            className="tableContainer">
            <Table className="styled-table" stickyHeader>
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
                    <Box className="flex items-center">
                      <IonFabButton
                        id="id-create-button"
                        title="ADD USER"
                        size="small"
                        onClick={() => handleOpen(AdminUser)}>
                        <Icon name="add" />
                      </IonFabButton>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{item?.name}</TableCell>
                    <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      {item?.email}
                    </TableCell>
                    <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      {RoleType[item?.role || 10]?.replace(/([A-Z])/g, " $1")?.trim()}
                    </TableCell>
                    <TableCell align="left">
                      <Box className="flex items-center">
                        <IonButton
                          id="id-edit-button"
                          title="EDIT USER"
                          size="small"
                          buttonType="icon"
                          onClick={() => handleOpen(item, "EDIT")}>
                          {loadingCol === `${item?.uid}-EDIT` ? (
                            <Icon name="sync-sharp" css="text-xl text-blue-500 icon-spinner" />
                          ) : (
                            <Icon name="card-sharp" css="text-xl text-blue-500" />
                          )}
                        </IonButton>
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
                                    handleDelete(item?.uid || String.empty, "DELETE");
                                  }
                                }
                              ]
                            })
                          }>
                          {loadingCol === `${item?.uid}-DELETE` ? (
                            <Icon name="sync-sharp" css="text-xl text-red-500 icon-spinner" />
                          ) : (
                            <Icon name="trash-bin-sharp" css="text-xl text-red-500" />
                          )}
                        </IonButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {records.length < total && constants.PAGE_SIZE < total && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <IonButton
                        size="small"
                        disabled={loading}
                        onClick={loadMore}
                        className="my-3">
                        {loading ? "Loading..." : "Load More"}
                      </IonButton>
                    </TableCell>
                  </TableRow>
                )}
                {loadingInit && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center! py-10!">
                      <IonSpinner name="lines-sharp-small"></IonSpinner>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
