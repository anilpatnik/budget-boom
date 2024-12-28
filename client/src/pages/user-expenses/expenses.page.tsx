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
import { useQuery } from "@tanstack/react-query";
import { toast, Slide } from "react-toastify";
import { CrudType, dateFormat, constants, formatPrice, totalPrice } from "@/util";
import { IExpense, Expense, IExpenseSearch, ExpenseSearch } from "@/models";
import { getExpensesAsync, deleteExpenseAsync, getCategory, getAllProjectsAsync } from "@/services";
import { Icon } from "@/components";
import { ExpensePage } from "./expense.page";
import { ExpenseSearchPage } from "./search.page";
import { useStore } from "@/contexts";

export function ExpensesPage() {
  const { user } = useStore();
  const hasMounted = useRef(false);
  const [records, setRecords] = useState<IExpense[]>([]);
  const [record, setRecord] = useState<IExpense>(Expense);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInit, setLoadingInit] = useState<boolean>(false);
  const [loadingCol, setLoadingCol] = useState<string>(String.empty);
  const [payload, setPayload] = useState<IExpenseSearch>({
    ...ExpenseSearch,
    page: 0,
    size: constants.PAGE_SIZE
  });
  const queryRef = useRef(payload);
  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();

  const { isLoading: loadingProjects, data: projects } = useQuery({
    queryKey: ["all-user-projects"],
    refetchOnMount: true,
    queryFn: async () => await getAllProjectsAsync()
  });

  const fetchData = async () => {
    if (loading) return;
    if (queryRef.current.page === 0) setLoadingInit(true);
    else setLoading(true);
    try {
      const response = await getExpensesAsync(queryRef.current);
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
    const res = await deleteExpenseAsync(id);
    if (res && !res?.success) {
      present({
        message: res?.resource,
        color: constants.DANGER,
        duration: constants.FAILURE_DELAY
      });
      setLoadingCol(String.empty);
      return;
    } else {
      present({
        message: "Deleted Successfully",
        color: constants.SUCCESS,
        duration: constants.SUCCESS_DELAY
      });
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
      endDate: item?.endDate
    }));
    setTimeout(() => {
      setRecords([]);
      fetchData();
    }, constants.DELAY);
  };

  if (loadingProjects || loadingInit)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: { xs: window.innerHeight - 212, sm: 600 } }}
      className="tableContainer">
      <Table className="styled-table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <Box sx={{ display: { xs: "none", sm: "table-cell" } }}>Date</Box>
              <Box sx={{ display: { xs: "table-cell", sm: "none" } }}>
                <Box>Total</Box>
                <Box className={totalPrice(records) < 0 ? "text-red-700" : String.empty}>
                  {formatPrice(totalPrice(records), user?.countryId, user?.currency)}
                </Box>
              </Box>
            </TableCell>
            <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
              <Box>Total</Box>
              <Box sx={{ display: { xs: "none", sm: "table-cell" } }}>
                <Box className={totalPrice(records) < 0 ? "text-red-700" : String.empty}>
                  {formatPrice(totalPrice(records), user?.countryId, user?.currency)}
                </Box>
              </Box>
            </TableCell>
            <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Category
            </TableCell>
            <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Tax
            </TableCell>
            <TableCell align="left" sx={{ display: { xs: "table-cell", sm: "none" } }}>
              Notes
            </TableCell>
            <TableCell align="left">
              <Box className="flex items-center">
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
                  onClick={() => handleSearchOpen()}>
                  <Icon name="options-sharp" />
                </IonFabButton>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records?.map((item, index) => (
            <TableRow key={index}>
              <TableCell align="left" sx={{ minWidth: 150 }}>
                <Box>{item?.entryDate && dateFormat(item.entryDate)}</Box>
                <Box sx={{ display: { xs: "table-cell", sm: "none" } }}>
                  <Box className="mt-2 flex items-center">
                    {item?.categoryId && (
                      <Icon
                        name={getCategory(item.categoryId).icon}
                        css="text-2xl text-black mr-3"
                      />
                    )}
                    {item?.price && (
                      <Box className={item.price < 0 ? "text-red-700" : String.empty}>
                        {formatPrice(item.price, user?.countryId, user?.currency)}
                      </Box>
                    )}
                  </Box>
                </Box>
              </TableCell>
              <TableCell
                sx={{ display: { xs: "none", sm: "table-cell", minWidth: 150 } }}
                align="left">
                {item?.price && (
                  <Box className={item.price < 0 ? "text-red-700" : String.empty}>
                    {formatPrice(item.price, user?.countryId, user?.currency)}
                  </Box>
                )}
              </TableCell>
              <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                <Box className="flex items-center">
                  <Box>
                    {item?.categoryId && (
                      <Box className="flex items-center">
                        <Icon
                          name={getCategory(item.categoryId).icon}
                          css="text-2xl text-black mr-2"
                        />
                        {getCategory(item.categoryId).name}
                      </Box>
                    )}
                  </Box>
                  <Box>
                    {item?.notes && (
                      <IonButton
                        buttonType="icon"
                        onClick={() =>
                          toast(item.notes, {
                            position: "top-center",
                            autoClose: 1000,
                            theme: "dark",
                            transition: Slide
                          })
                        }>
                        <Icon name="information-circle-sharp" css="text-2xl text-cyan-500" />
                      </IonButton>
                    )}
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                {item.taxable && (
                  <Icon name="checkmark-circle-sharp" css="text-2xl text-green-500" />
                )}
              </TableCell>
              <TableCell align="left" sx={{ display: { xs: "table-cell", sm: "none" } }}>
                {item?.notes && (
                  <IonButton
                    buttonType="icon"
                    onClick={() =>
                      toast(item.notes, {
                        position: "top-center",
                        autoClose: 1000,
                        theme: "dark",
                        transition: Slide
                      })
                    }>
                    <Icon name="information-circle-sharp" css="text-2xl text-cyan-500" />
                  </IonButton>
                )}
              </TableCell>
              <TableCell align="left">
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
