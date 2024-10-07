import { useState } from "react";
import { IonButton, IonIcon, IonSpinner, useIonAlert, useIonToast } from "@ionic/react";
import { addCircleOutline, createOutline, searchOutline, trashOutline } from "ionicons/icons";
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
import { useQuery } from "@tanstack/react-query";
import { PageType, CrudType, RoleType, newPassword } from "@/util";
import { AdminUser, IAdminUser, AdminUserSearch } from "@/models";
import { deleteUserAsync, getUserAsync, getUsersAsync } from "@/services";

type ComponentProps = {
  handleClick: (
    pageType: PageType,
    searchType?: number,
    searchInput?: string,
    user?: IAdminUser
  ) => void;
  searchType?: number;
  searchInput?: string;
};
export function UsersPage({ handleClick, searchType, searchInput }: ComponentProps) {
  const [searchTypeNew, setSearchType] = useState(searchType || 10);
  const [searchInputNew, setSearchInput] = useState(searchInput || String.empty);
  const [loading, setLoading] = useState(false);
  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();

  const {
    isFetching,
    data: users,
    refetch
  } = useQuery({
    queryKey: ["admin-users"],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () =>
      await getUsersAsync({
        ...AdminUserSearch,
        searchType: searchTypeNew,
        searchInput: searchInputNew
      })
  });

  const handleEditClick = async (id: string) => {
    setLoading(true);
    try {
      const user = await getUserAsync(id);
      if (user) {
        const password = newPassword();
        const newUser = { ...user, password, type: CrudType.Update };
        handleClick(PageType.Step1, searchTypeNew, searchInputNew, newUser);
      }
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };
  const handleChange = (e: any) => {
    const input = e.target.value;
    setSearchInput(input);
    // set name or email
    if (input.includes("@")) setSearchType(20);
    else setSearchType(10);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    refetch();
  };
  const handleUserDelete = async (id: string) => {
    setLoading(true);
    const res = await deleteUserAsync(id);
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

  return (
    <>
      <div className="ion-margin">
        <Paper sx={{ p: "2px 4px", display: "flex", alignItems: "center" }} component="form">
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              letterSpacing: "0.075em"
            }}
            id="searchInput"
            name="searchInput"
            value={searchInputNew}
            onChange={handleChange}
            fullWidth
            placeholder="Search with name or email"
            inputProps={{ "aria-label": "Search with name or email" }}
          />
          <IconButton aria-label="search" type="submit" onClick={handleSubmit}>
            <IonIcon slot="start" icon={searchOutline} />
          </IconButton>
        </Paper>
      </div>
      {isFetching ? (
        <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>
      ) : (
        <div className="ion-margin">
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
                    <IonButton
                      id="id-create-button"
                      title="CREATE USER"
                      size="small"
                      buttonType="icon"
                      onClick={() => {
                        const password = newPassword();
                        const newUser = { ...AdminUser, password, type: CrudType.Create };
                        handleClick(PageType.Step1, searchTypeNew, searchInputNew, newUser);
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
                {users?.map((item, index) => (
                  <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
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
                        onClick={() => handleEditClick(item.uid || String.empty)}>
                        <IonIcon icon={createOutline}></IonIcon>
                      </IonButton>
                    </TableCell>
                    <TableCell align="left">
                      <IonButton
                        id="id-delete-button"
                        title="Delete"
                        fill="clear"
                        onClick={() =>
                          presentAlert({
                            header: "Are you sure?",
                            buttons: [
                              { text: "Cancel" },
                              {
                                text: "Confirm",
                                handler: () => {
                                  handleUserDelete(item?.uid || String.empty);
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
        </div>
      )}
    </>
  );
}
