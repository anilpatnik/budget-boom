import { useRef, useState, useEffect, Fragment, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { IonButton, IonFabButton, useIonAlert, useIonModal } from "@ionic/react";
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
import { IExpense, Expense, IExpenseSearch, ExpenseSearch, IProject } from "@/models";
import { lookupService, projectService, expenseService } from "@/services";
import { Icon, LucideIcon } from "@/components";
import { useStore } from "@/contexts";
import { ExpensePage } from "./expense.page";
import { ExpenseSearchPage } from "./expense.search.page";

export function ExpensesPage() {
  const { user } = useStore();
  const { search } = useLocation();
  const hasMounted = useRef(false);
  const [records, setRecords] = useState<IExpense[]>([]);
  const [record, setRecord] = useState<IExpense>(Expense);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInit, setLoadingInit] = useState<boolean>(false);
  const [loadingCol, setLoadingCol] = useState<string>(String.empty);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [presentAlert] = useIonAlert();

  // initial search payload
  const projectId = useMemo(() => {
    return new URLSearchParams(search).get("q") || String.empty;
  }, [search]);
  const [payload, setPayload] = useState<IExpenseSearch>({
    ...ExpenseSearch,
    page: 0,
    size: constants.PAGE_SIZE,
    projectId,
    skip: Boolean(projectId)
  });
  const queryRef = useRef(payload);

  // fetch projects
  const fetchProjects = async () => {
    const allProjects = await projectService.getAllProjectsAsync();
    const activeProjects = allProjects.filter(x => !x.inactive);
    setProjects(activeProjects);
  };

  // fetch expenses
  const fetchData = async () => {
    if (loading) return;
    if (queryRef.current.page !== 0) setLoading(true);
    try {
      const response = await expenseService.getExpensesAsync(queryRef.current);
      setRecords(prev => [...prev, ...(response?.data ?? [])]);
      setTotal(response?.count ?? 0);
    } catch (error) {
      console.error("error fetching data:", error);
    } finally {
      if (queryRef.current.page !== 0) setLoading(false);
    }
  };

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    // fetch initial data
    const loadInitialData = async () => {
      try {
        setLoadingInit(true);
        await Promise.all([fetchProjects(), fetchData()]);
      } finally {
        setLoadingInit(false);
      }
    };
    loadInitialData();
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

  const addRecord = (item: IExpense) => {
    setRecords(prev => [item, ...prev]);
    setTotal(prev => prev + 1);
  };
  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(x => x?.id !== id));
    setTotal(prev => prev - 1);
  };
  const editRecord = (item: IExpense) => {
    setRecords(prev => prev.map(x => (x.id === item.id ? item : x)));
  };

  const [presentModal, dismissModal] = useIonModal(ExpensePage, {
    projects,
    expense: record,
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
  const handleOpen = (expense?: IExpense, col?: string) => {
    const colId = `${expense?.id}-${col}`;
    setLoadingCol(colId);
    const newExpense = { ...expense, type: expense?.id ? CrudType.Update : CrudType.Create };
    setRecord(newExpense);
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
    const res = await expenseService.deleteExpenseAsync(id);
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

  const [presentSearchModal, dismissSearchModal] = useIonModal(ExpenseSearchPage, {
    search: payload,
    projects,
    handleClose: () => dismissSearchModal(),
    handleSearch: (item?: any) => {
      handleSearch(item);
      setTimeout(dismissSearchModal, constants.DELAY);
    }
  });
  const handleSearchOpen = () => {
    setTimeout(() => {
      presentSearchModal({
        backdropDismiss: false,
        keyboardClose: false
        // cssClass: "desktop-modal-class"
      });
    }, constants.DELAY);
  };
  const handleSearch = (item: IExpenseSearch) => {
    setPayload(prev => ({
      ...prev,
      page: 0,
      projectId: item?.projectId,
      categoryId: item?.categoryId,
      startDate: item?.startDate,
      endDate: item?.endDate,
      skip: item?.skip
    }));
    setTimeout(() => {
      setRecords([]);
      fetchData();
    }, constants.DELAY);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: { xs: window.innerHeight - 212, sm: 600 } }}
      className="tableContainer">
      <Table className="styled-table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Category
            </TableCell>
            <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
              <div className="space-y-2">
                <div className="text-green-700">
                  {helper.formatPrice(helper.totalIncome(records), user?.countryId, user?.currency)}
                </div>
                <div className="text-red-700">
                  {helper.formatPrice(
                    helper.totalExpense(records),
                    user?.countryId,
                    user?.currency
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell align="left" sx={{ display: { xs: "table-cell", sm: "none" } }}>
              <div className="space-y-2">
                <div className="text-green-700">
                  {helper.formatPrice(helper.totalIncome(records), user?.countryId, user?.currency)}
                </div>
                <div className="text-red-700">
                  {helper.formatPrice(
                    helper.totalExpense(records),
                    user?.countryId,
                    user?.currency
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell align="left">
              <Box className="flex">
                <IonFabButton
                  id="id-create-button"
                  title="ADD EXPENSE"
                  size="small"
                  onClick={() => handleOpen(Expense)}>
                  <Icon name="add" />
                </IonFabButton>
                <IonFabButton
                  id="id-search-button"
                  title="SEARCH EXPENSES"
                  color="warning"
                  size="small"
                  className="ml-5"
                  onClick={() => handleSearchOpen()}>
                  <Icon name="options-sharp" />
                </IonFabButton>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records?.map((item, index) => (
            <Fragment key={index}>
              <TableRow>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {item?.entryDate && dateHelper.dateFormat(item.entryDate)}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ display: { xs: "table-cell", sm: "none" } }}
                  rowSpan={2}>
                  <div>
                    <div className="mb-3.5 mt-1.5">
                      {item?.entryDate && dateHelper.dateFormat(item.entryDate)}
                    </div>
                    <div className="flex items-center">
                      {item?.price && (
                        <div className="text-xl mr-3">{item.price < 0 ? `📉` : `📈`}</div>
                      )}
                      {item?.categoryId && (
                        <LucideIcon
                          name={lookupService.getCategory(item.categoryId).icon}
                          css="text-2xl"
                        />
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {item?.categoryId && (
                    <Box className="flex items-center">
                      <LucideIcon
                        name={lookupService.getCategory(item.categoryId).icon}
                        css="text-2xl text-black mr-2"
                      />
                      {item?.notes ? item.notes : lookupService.getCategory(item.categoryId).name}
                    </Box>
                  )}
                </TableCell>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {item?.price && (
                    <Box
                      className={
                        item.price < 0 ? "text-red-700 font-bold" : "text-green-700 font-bold"
                      }>
                      {helper.formatPrice(item.price, user?.countryId, user?.currency)}
                    </Box>
                  )}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: { xs: "table-cell", sm: "none" },
                    borderBottom: "none",
                    borderTop: "none"
                  }}>
                  {item?.price && (
                    <Box
                      className={
                        item.price < 0 ? "text-red-700 font-bold" : "text-green-700 font-bold"
                      }>
                      {helper.formatPrice(item.price, user?.countryId, user?.currency)}
                    </Box>
                  )}
                </TableCell>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  <Box className="flex items-center">
                    <IonButton
                      id="id-edit-button"
                      title="EDIT EXPENSE"
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
                      title="DELETE EXPENSE"
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
                      title="EDIT EXPENSE"
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
                      title="DELETE EXPENSE"
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
              {item?.categoryId && (
                <TableRow sx={{ display: { xs: "table-row", sm: "none" } }}>
                  <TableCell colSpan={3}>
                    <Box>
                      {item?.notes ? item.notes : lookupService.getCategory(item.categoryId).name}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
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
          {loadingInit && (
            <TableRow>
              <TableCell colSpan={5} className="!text-center !py-10">
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
