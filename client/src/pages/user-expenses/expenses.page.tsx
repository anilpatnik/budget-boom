import { useRef, useState, useEffect, Fragment, useMemo } from "react";
import { useLocation } from "react-router-dom";
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
import {
  IExpense,
  Expense,
  IExpenseSearch,
  ExpenseSearch,
  IProject,
  IExpenseCursor
} from "@/models";
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
  const [nextCursor, setCursor] = useState<IExpenseCursor | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInit, setLoadingInit] = useState<boolean>(false);
  const [loadingCol, setLoadingCol] = useState<string>(String.empty);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [presentAlert] = useIonAlert();

  // initial search payload
  const queryParams = useMemo(() => {
    const params = new URLSearchParams(search);
    return {
      projectId: params.get("q") || String.empty
      // categoryId: params.get("m") || String.empty
    };
  }, [search]);
  const [payload, setPayload] = useState<IExpenseSearch>({
    ...ExpenseSearch,
    size: constants.PAGE_SIZE,
    projectId: queryParams.projectId,
    skip: Boolean(queryParams.projectId)
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
    if (!hasMore && records.length > 0) return; // Don't load more if no more data
    setLoading(true);
    try {
      const response = await expenseService.getExpensesAsync(queryRef.current);
      const arrData = response?.data ?? [];
      setRecords(prev => [...prev, ...arrData]);
      setHasMore(response?.hasMore ?? false);
      setCursor(response?.nextCursor);
    } catch (error) {
      console.error("error fetching data:", error);
    } finally {
      setLoading(false);
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
    if (hasMore) {
      setPayload(prev => ({ ...prev, nextCursor }));
      setTimeout(() => fetchData(), constants.DELAY);
    }
  };

  const addRecord = (item: IExpense) => {
    setRecords(prev => [item, ...prev]);
  };
  const deleteRecord = (id: string) => {
    setRecords(prev => {
      const updated = prev.filter(x => x?.id !== id);
      // if the deleted ID was the last one used for the cursor
      if (nextCursor && nextCursor.id === id) {
        const last = updated[updated.length - 1];
        if (last) setCursor({ id: last.id, entryDate: last.entryDate });
      }
      return updated;
    });
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
      projectId: item?.projectId,
      categoryId: item?.categoryId,
      startDate: item?.startDate,
      endDate: item?.endDate,
      skip: item?.skip,
      nextCursor: undefined
    }));
    setTimeout(() => {
      setRecords([]);
      setCursor(undefined);
      fetchData();
    }, constants.DELAY);
  };

  const handleReset = () => {
    setPayload({
      ...ExpenseSearch,
      size: constants.PAGE_SIZE,
      projectId: String.empty,
      skip: false
    });
    setRecords([]);
    setCursor(undefined);
    setTimeout(fetchData, constants.DELAY);
  };

  return (
    <Box>
      {/* Filter status and reset button */}
      {(payload.projectId || payload.categoryId || (payload.startDate && payload.endDate)) && (
        <Box
          sx={{
            p: 2,
            bgcolor: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
          <Box>
            {payload.projectId && <span className="mr-3">🏗️ Project: {payload.projectId}</span>}
            {payload.categoryId && <span className="mr-3">📂 Category: {payload.categoryId}</span>}
            {payload.startDate && payload.endDate && (
              <span className="mr-3">
                📅 {dateHelper.dateFormat(payload.startDate)} -{" "}
                {dateHelper.dateFormat(payload.endDate)}
              </span>
            )}
          </Box>
          <IonButton color="danger" size="small" onClick={handleReset}>
            <Icon name="close-circle" slot="start" />
            RESET
          </IonButton>
        </Box>
      )}

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
                    {helper.formatPrice(
                      helper.totalIncome(records),
                      user?.countryId,
                      user?.currency
                    )}
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
                    {helper.formatPrice(
                      helper.totalIncome(records),
                      user?.countryId,
                      user?.currency
                    )}
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
            {hasMore && (
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
                <TableCell colSpan={5}>
                  <IonSpinner name="lines-sharp-small"></IonSpinner>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
